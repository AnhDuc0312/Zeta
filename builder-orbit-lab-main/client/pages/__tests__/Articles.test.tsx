import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../contexts/AuthContext';
import { ToastProvider } from '../../contexts/ToastContext';
import Articles from '../Articles';

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

describe('Articles Page', () => {
  const mockArticles = [
    {
      id: '1',
      title: 'Test Article 1',
      description: 'Test description 1',
      category: 'Technology',
      author_name: 'Test Author 1',
      created_at: '2024-01-01T00:00:00Z',
      readTime: '5 min read',
      views: 100,
      likes: 10,
      comments: 5,
      featured: false,
      tags: ['react', 'typescript']
    },
    {
      id: '2',
      title: 'Test Article 2',
      description: 'Test description 2',
      category: 'Business',
      author_name: 'Test Author 2',
      created_at: '2024-01-02T00:00:00Z',
      readTime: '3 min read',
      views: 50,
      likes: 5,
      comments: 2,
      featured: true,
      tags: ['business', 'strategy']
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockClear();
  });

  it('renders page title and description', () => {
    renderWithProviders(<Articles />);

    expect(screen.getByText('Articles')).toBeInTheDocument();
    expect(screen.getByText('Discover insightful articles and in-depth content')).toBeInTheDocument();
  });

  it('renders filter controls', () => {
    renderWithProviders(<Articles />);

    expect(screen.getByText('Filter by Category')).toBeInTheDocument();
    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('loads and displays articles', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockArticles
      })
    });

    renderWithProviders(<Articles />);

    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      expect(screen.getByText('Test Article 2')).toBeInTheDocument();
    });
  });

  it('displays article metadata correctly', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [mockArticles[0]]
      })
    });

    renderWithProviders(<Articles />);

    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      expect(screen.getByText('Test description 1')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('By Test Author 1')).toBeInTheDocument();
      expect(screen.getByText('5 min read')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument(); // views
      expect(screen.getByText('10')).toBeInTheDocument(); // likes
      expect(screen.getByText('5')).toBeInTheDocument(); // comments
    });
  });

  it('filters articles by category', async () => {
    const user = userEvent.setup();
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockArticles
      })
    });

    renderWithProviders(<Articles />);

    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      expect(screen.getByText('Test Article 2')).toBeInTheDocument();
    });

    const categoryFilter = screen.getByRole('combobox');
    await user.click(categoryFilter);
    
    const technologyOption = screen.getByText('Technology');
    await user.click(technologyOption);

    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Article 2')).not.toBeInTheDocument();
    });
  });

  it('sorts articles by different criteria', async () => {
    const user = userEvent.setup();
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockArticles
      })
    });

    renderWithProviders(<Articles />);

    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    });

    const sortSelect = screen.getByDisplayValue('Recent');
    await user.click(sortSelect);
    
    const viewsOption = screen.getByText('Most Views');
    await user.click(viewsOption);

    // Should re-render with sorted articles
    expect(screen.getByText('Most Views')).toBeInTheDocument();
  });

  it('navigates to article detail when clicked', async () => {
    const user = userEvent.setup();
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [mockArticles[0]]
      })
    });

    renderWithProviders(<Articles />);

    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    });

    const articleCard = screen.getByText('Test Article 1').closest('article');
    await user.click(articleCard!);

    expect(window.location.pathname).toBe('/articles/1');
  });

  it('shows loading state', () => {
    (fetch as any).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true, data: [] })
      }), 100))
    );

    renderWithProviders(<Articles />);

    expect(screen.getByText('Loading articles...')).toBeInTheDocument();
  });

  it('shows empty state when no articles', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: []
      })
    });

    renderWithProviders(<Articles />);

    await waitFor(() => {
      expect(screen.getByText('No articles found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your filters or check back later')).toBeInTheDocument();
    });
  });

  it('handles API error', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('API Error'));

    renderWithProviders(<Articles />);

    await waitFor(() => {
      expect(screen.getByText('No articles found')).toBeInTheDocument();
    });
  });

  it('displays featured badge for featured articles', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [mockArticles[1]] // featured article
      })
    });

    renderWithProviders(<Articles />);

    await waitFor(() => {
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });
  });

  it('formats numbers correctly', async () => {
    const articleWithLargeNumbers = {
      ...mockArticles[0],
      views: 1500,
      likes: 1200,
      comments: 300
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [articleWithLargeNumbers]
      })
    });

    renderWithProviders(<Articles />);

    await waitFor(() => {
      expect(screen.getByText('1.5k')).toBeInTheDocument(); // views
      expect(screen.getByText('1.2k')).toBeInTheDocument(); // likes
      expect(screen.getByText('300')).toBeInTheDocument(); // comments
    });
  });

  it('handles missing data gracefully', async () => {
    const incompleteArticle = {
      id: '1',
      title: 'Incomplete Article',
      // missing other fields
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [incompleteArticle]
      })
    });

    renderWithProviders(<Articles />);

    await waitFor(() => {
      expect(screen.getByText('Incomplete Article')).toBeInTheDocument();
      expect(screen.getByText('No description available')).toBeInTheDocument();
      expect(screen.getByText('By Unknown')).toBeInTheDocument();
      expect(screen.getByText('5 min read')).toBeInTheDocument(); // fallback
    });
  });

  it('updates category filter options based on loaded articles', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockArticles
      })
    });

    renderWithProviders(<Articles />);

    await waitFor(() => {
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('Business')).toBeInTheDocument();
    });
  });
});
});
