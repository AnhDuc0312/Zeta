import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../contexts/AuthContext';
import { ToastProvider } from '../../contexts/ToastContext';
import Index from '../Index';

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

describe('Index Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockClear();
  });

  it('renders hero section with search bar', () => {
    renderWithProviders(<Index />);

    expect(screen.getByText('Discover Amazing Content')).toBeInTheDocument();
    expect(screen.getByText('Find articles, documents, and notes that inspire and inform')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search for content...')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithProviders(<Index />);

    expect(screen.getByText('Articles')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('renders preview section with content', async () => {
    const mockContent = [
      {
        id: '1',
        title: 'Test Article',
        description: 'Test description',
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10
      }
    ];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockContent
      })
    });

    renderWithProviders(<Index />);

    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByText('By Test Author')).toBeInTheDocument();
    });
  });

  it('handles search input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Index />);

    const searchInput = screen.getByPlaceholderText('Search for content...');
    await user.type(searchInput, 'test query');

    expect(searchInput).toHaveValue('test query');
  });

  it('performs search when search button is clicked', async () => {
    const user = userEvent.setup();
    const mockSearchResults = [
      {
        id: '1',
        title: 'Search Result',
        description: 'Search description',
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 50,
        likes: 5
      }
    ];

    (fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: []
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockSearchResults
        })
      });

    renderWithProviders(<Index />);

    const searchInput = screen.getByPlaceholderText('Search for content...');
    await user.type(searchInput, 'test query');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Search Results')).toBeInTheDocument();
      expect(screen.getByText('Search Result')).toBeInTheDocument();
    });
  });

  it('shows loading state during search', async () => {
    const user = userEvent.setup();
    (fetch as any).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true, data: [] })
      }), 100))
    );

    renderWithProviders(<Index />);

    const searchInput = screen.getByPlaceholderText('Search for content...');
    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(screen.getByText('Searching...')).toBeInTheDocument();
    });
  });

  it('handles search error', async () => {
    const user = userEvent.setup();
    (fetch as any).mockRejectedValueOnce(new Error('Search failed'));

    renderWithProviders(<Index />);

    const searchInput = screen.getByPlaceholderText('Search for content...');
    await user.type(searchInput, 'test');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  it('displays content stats correctly', async () => {
    const mockContent = [
      {
        id: '1',
        title: 'Test Article',
        description: 'Test description',
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10
      }
    ];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockContent
      })
    });

    renderWithProviders(<Index />);

    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument(); // views
      expect(screen.getByText('10')).toBeInTheDocument(); // likes
    });
  });

  it('navigates to content detail when clicked', async () => {
    const user = userEvent.setup();
    const mockContent = [
      {
        id: '1',
        title: 'Test Article',
        description: 'Test description',
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10
      }
    ];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockContent
      })
    });

    renderWithProviders(<Index />);

    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });

    const contentCard = screen.getByText('Test Article').closest('div');
    await user.click(contentCard!);

    // Should navigate to article detail page
    expect(window.location.pathname).toBe('/articles/1');
  });

  it('shows empty state when no content', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: []
      })
    });

    renderWithProviders(<Index />);

    await waitFor(() => {
      expect(screen.getByText('No content available')).toBeInTheDocument();
    });
  });

  it('handles debounced search', async () => {
    const user = userEvent.setup();
    vi.useFakeTimers();

    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: []
      })
    });

    renderWithProviders(<Index />);

    const searchInput = screen.getByPlaceholderText('Search for content...');
    await user.type(searchInput, 'test');

    // Fast-forward timers to trigger debounced search
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/search?q=test&limit=10');
    });

    vi.useRealTimers();
  });
});