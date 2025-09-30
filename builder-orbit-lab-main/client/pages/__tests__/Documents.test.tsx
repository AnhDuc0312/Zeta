import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../contexts/AuthContext';
import { ToastProvider } from '../../contexts/ToastContext';
import Documents from '../Documents';

// Mock fetch
global.fetch = vi.fn();

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            {component}
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('Documents Page', () => {
  const mockDocuments = [
    {
      id: '1',
      title: 'Test Document 1',
      description: 'Test description 1',
      type: 'document',
      author_name: 'Test Author 1',
      created_at: '2024-01-01T00:00:00Z',
      views: 100,
      likes: 10,
      comments: 5,
      category: 'Technology',
      featured: false,
      file_url: '/documents/test1.pdf'
    },
    {
      id: '2',
      title: 'Test Document 2',
      description: 'Test description 2',
      type: 'document',
      author_name: 'Test Author 2',
      created_at: '2024-01-02T00:00:00Z',
      views: 50,
      likes: 5,
      comments: 2,
      category: 'Business',
      featured: true,
      file_url: '/documents/test2.pdf'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockClear();
  });

  it('renders page title and description', () => {
    renderWithProviders(<Documents />);

    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Access and download important documents and resources')).toBeInTheDocument();
  });

  it('renders filter controls', () => {
    renderWithProviders(<Documents />);

    expect(screen.getByText('Filter by Category')).toBeInTheDocument();
    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('loads and displays documents', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockDocuments
      })
    });

    renderWithProviders(<Documents />);

    await waitFor(() => {
      expect(screen.getByText('Test Document 1')).toBeInTheDocument();
      expect(screen.getByText('Test Document 2')).toBeInTheDocument();
    });
  });

  it('displays document metadata correctly', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [mockDocuments[0]]
      })
    });

    renderWithProviders(<Documents />);

    await waitFor(() => {
      expect(screen.getByText('Test Document 1')).toBeInTheDocument();
      expect(screen.getByText('Test description 1')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('By Test Author 1')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument(); // views
      expect(screen.getByText('10')).toBeInTheDocument(); // likes
      expect(screen.getByText('5')).toBeInTheDocument(); // comments
    });
  });

  it('shows document type badge', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [mockDocuments[0]]
      })
    });

    renderWithProviders(<Documents />);

    await waitFor(() => {
      expect(screen.getByText('Document')).toBeInTheDocument();
    });
  });

  it('shows featured badge for featured documents', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [mockDocuments[1]] // featured document
      })
    });

    renderWithProviders(<Documents />);

    await waitFor(() => {
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });
  });

  it('filters documents by category', async () => {
    const user = userEvent.setup();
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockDocuments
      })
    });

    renderWithProviders(<Documents />);

    await waitFor(() => {
      expect(screen.getByText('Test Document 1')).toBeInTheDocument();
      expect(screen.getByText('Test Document 2')).toBeInTheDocument();
    });

    const categoryFilter = screen.getByRole('combobox');
    await user.click(categoryFilter);
    
    const technologyOption = screen.getByText('Technology');
    await user.click(technologyOption);

    await waitFor(() => {
      expect(screen.getByText('Test Document 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Document 2')).not.toBeInTheDocument();
    });
  });

  it('sorts documents by different criteria', async () => {
    const user = userEvent.setup();
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockDocuments
      })
    });

    renderWithProviders(<Documents />);

    await waitFor(() => {
      expect(screen.getByText('Test Document 1')).toBeInTheDocument();
    });

    const sortSelect = screen.getByDisplayValue('Recent');
    await user.click(sortSelect);
    
    const viewsOption = screen.getByText('Most Views');
    await user.click(viewsOption);

    expect(screen.getByText('Most Views')).toBeInTheDocument();
  });

  it('navigates to document detail when clicked', async () => {
    const user = userEvent.setup();
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [mockDocuments[0]]
      })
    });

    renderWithProviders(<Documents />);

    await waitFor(() => {
      expect(screen.getByText('Test Document 1')).toBeInTheDocument();
    });

    const documentCard = screen.getByText('Test Document 1').closest('div');
    await user.click(documentCard!);

    expect(window.location.pathname).toBe('/documents/1');
  });

  it('shows loading state', () => {
    (fetch as any).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true, data: [] })
      }), 100))
    );

    renderWithProviders(<Documents />);

    expect(screen.getByText('Loading documents...')).toBeInTheDocument();
  });

  it('shows empty state when no documents', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: []
      })
    });

    renderWithProviders(<Documents />);

    await waitFor(() => {
      expect(screen.getByText('No documents found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your filters or check back later')).toBeInTheDocument();
    });
  });

  it('handles API error', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('API Error'));

    renderWithProviders(<Documents />);

    await waitFor(() => {
      expect(screen.getByText('No documents found')).toBeInTheDocument();
    });
  });

  it('formats numbers correctly', async () => {
    const documentWithLargeNumbers = {
      ...mockDocuments[0],
      views: 1500,
      likes: 1200,
      comments: 300
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [documentWithLargeNumbers]
      })
    });

    renderWithProviders(<Documents />);

    await waitFor(() => {
      expect(screen.getByText('1.5k')).toBeInTheDocument(); // views
      expect(screen.getByText('1.2k')).toBeInTheDocument(); // likes
      expect(screen.getByText('300')).toBeInTheDocument(); // comments
    });
  });

  it('handles missing data gracefully', async () => {
    const incompleteDocument = {
      id: '1',
      title: 'Incomplete Document',
      type: 'document',
      // missing other fields
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [incompleteDocument]
      })
    });

    renderWithProviders(<Documents />);

    await waitFor(() => {
      expect(screen.getByText('Incomplete Document')).toBeInTheDocument();
      expect(screen.getByText('No description available')).toBeInTheDocument();
      expect(screen.getByText('By Unknown')).toBeInTheDocument();
    });
  });

  it('maintains consistent card layout', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [mockDocuments[0]]
      })
    });

    renderWithProviders(<Documents />);

    await waitFor(() => {
      const card = screen.getByText('Test Document 1').closest('div');
      expect(card).toHaveClass('h-full', 'flex', 'flex-col');
    });
  });

  it('truncates long author names', async () => {
    const documentWithLongAuthor = {
      ...mockDocuments[0],
      author_name: 'Very Long Author Name That Should Be Truncated'
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [documentWithLongAuthor]
      })
    });

    renderWithProviders(<Documents />);

    await waitFor(() => {
      const authorElement = screen.getByText(/Very Long Author Name/);
      expect(authorElement).toHaveClass('truncate');
    });
  });
});
});
