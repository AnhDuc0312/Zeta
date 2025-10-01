import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import Index from '../pages/Index';
import Search from '../pages/Search';

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

describe('Search Integration', () => {
  const mockSearchResults = [
    {
      id: '1',
      title: 'React Best Practices',
      description: 'Learn the best practices for React development',
      type: 'article',
      author_name: 'John Doe',
      created_at: '2024-01-01T00:00:00Z',
      views: 100,
      likes: 10,
      comments: 5,
      category: 'Technology',
      featured: false,
      tags: ['react', 'javascript']
    },
    {
      id: '2',
      title: 'TypeScript Guide',
      description: 'Complete guide to TypeScript',
      type: 'document',
      author_name: 'Jane Smith',
      created_at: '2024-01-02T00:00:00Z',
      views: 80,
      likes: 8,
      comments: 3,
      category: 'Technology',
      featured: true,
      tags: ['typescript', 'programming']
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockClear();
  });

  it('performs search from home page and navigates to search page', async () => {
    const user = userEvent.setup();
    
    // Mock initial content load
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: []
      })
    });

    // Mock search results
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockSearchResults
      })
    });

    renderWithProviders(<Index />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search for content...')).toBeInTheDocument();
    });

    // Perform search
    const searchInput = screen.getByPlaceholderText('Search for content...');
    await user.type(searchInput, 'react typescript');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    // Should show search results on home page
    await waitFor(() => {
      expect(screen.getByText('Search Results')).toBeInTheDocument();
      expect(screen.getByText('React Best Practices')).toBeInTheDocument();
      expect(screen.getByText('TypeScript Guide')).toBeInTheDocument();
    });
  });

  it('navigates to search page with query parameter', async () => {
    const user = userEvent.setup();
    
    // Mock search results
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockSearchResults
      })
    });

    // Mock URL with search query
    Object.defineProperty(window, 'location', {
      value: {
        search: '?q=react+typescript'
      },
      writable: true
    });

    renderWithProviders(<Search />);

    // Should load search results automatically
    await waitFor(() => {
      expect(screen.getByText('React Best Practices')).toBeInTheDocument();
      expect(screen.getByText('TypeScript Guide')).toBeInTheDocument();
    });
  });

  it('filters search results by type', async () => {
    const user = userEvent.setup();
    
    // Mock search results
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockSearchResults
      })
    });

    renderWithProviders(<Search />);

    // Wait for results to load
    await waitFor(() => {
      expect(screen.getByText('React Best Practices')).toBeInTheDocument();
      expect(screen.getByText('TypeScript Guide')).toBeInTheDocument();
    });

    // Filter by articles only
    const typeFilter = screen.getByDisplayValue('All Types');
    await user.click(typeFilter);
    
    const articleOption = screen.getByText('Articles');
    await user.click(articleOption);

    await waitFor(() => {
      expect(screen.getByText('React Best Practices')).toBeInTheDocument();
      expect(screen.queryByText('TypeScript Guide')).not.toBeInTheDocument();
    });
  });

  it('sorts search results by different criteria', async () => {
    const user = userEvent.setup();
    
    // Mock search results
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockSearchResults
      })
    });

    renderWithProviders(<Search />);

    // Wait for results to load
    await waitFor(() => {
      expect(screen.getByText('React Best Practices')).toBeInTheDocument();
    });

    // Sort by views
    const sortSelect = screen.getByDisplayValue('Recent');
    await user.click(sortSelect);
    
    const viewsOption = screen.getByText('Most Views');
    await user.click(viewsOption);

    expect(screen.getByText('Most Views')).toBeInTheDocument();
  });

  it('handles search error gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock search error
    (fetch as any).mockRejectedValueOnce(new Error('Search failed'));

    renderWithProviders(<Search />);

    // Should show error state
    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  it('shows loading state during search', async () => {
    const user = userEvent.setup();
    
    // Mock delayed search response
    (fetch as any).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: mockSearchResults
        })
      }), 100))
    );

    renderWithProviders(<Search />);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Searching...')).toBeInTheDocument();
    });

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('React Best Practices')).toBeInTheDocument();
    });
  });

  it('displays search result metadata correctly', async () => {
    // Mock search results
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [mockSearchResults[0]]
      })
    });

    renderWithProviders(<Search />);

    await waitFor(() => {
      expect(screen.getByText('React Best Practices')).toBeInTheDocument();
      expect(screen.getByText('Learn the best practices for React development')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('100 views')).toBeInTheDocument();
      expect(screen.getByText('10 likes')).toBeInTheDocument();
      expect(screen.getByText('By John Doe')).toBeInTheDocument();
    });
  });

  it('navigates to content detail from search results', async () => {
    const user = userEvent.setup();
    
    // Mock search results
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [mockSearchResults[0]]
      })
    });

    renderWithProviders(<Search />);

    await waitFor(() => {
      expect(screen.getByText('React Best Practices')).toBeInTheDocument();
    });

    // Click on search result
    const resultCard = screen.getByText('React Best Practices').closest('div');
    await user.click(resultCard!);

    // Should navigate to article detail
    expect(window.location.pathname).toBe('/articles/1');
  });

  it('handles empty search results', async () => {
    // Mock empty search results
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: []
      })
    });

    renderWithProviders(<Search />);

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search terms or filters')).toBeInTheDocument();
    });
  });

  it('maintains search state across page navigation', async () => {
    const user = userEvent.setup();
    
    // Mock search results
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockSearchResults
      })
    });

    renderWithProviders(<Search />);

    // Wait for results to load
    await waitFor(() => {
      expect(screen.getByText('React Best Practices')).toBeInTheDocument();
    });

    // Apply filter
    const typeFilter = screen.getByDisplayValue('All Types');
    await user.click(typeFilter);
    
    const articleOption = screen.getByText('Articles');
    await user.click(articleOption);

    // Filter should persist
    await waitFor(() => {
      expect(screen.getByText('Articles')).toBeInTheDocument();
    });
  });
});

