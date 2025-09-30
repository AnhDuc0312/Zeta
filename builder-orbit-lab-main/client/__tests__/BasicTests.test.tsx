import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import Index from '../pages/Index';
import Articles from '../pages/Articles';
import Documents from '../pages/Documents';
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

describe('Basic Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (fetch && typeof (fetch as any).mockClear === 'function') {
      (fetch as any).mockClear();
    }
  });

  describe('Index Page', () => {
    it('renders without crashing', () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] })
      });

      renderWithProviders(<Index />);
      
      expect(screen.getByText('Discover Amazing Content')).toBeInTheDocument();
    });

    it('renders search input', () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] })
      });

      renderWithProviders(<Index />);
      
      expect(screen.getByPlaceholderText('Search for content...')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] })
      });

      renderWithProviders(<Index />);
      
      expect(screen.getByText('Articles')).toBeInTheDocument();
      expect(screen.getByText('Documents')).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();
    });
  });

  describe('Articles Page', () => {
    it('renders without crashing', () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] })
      });

      renderWithProviders(<Articles />);
      
      expect(screen.getByText('Articles')).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
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
        json: async () => ({ success: true, data: [] })
      });

      renderWithProviders(<Articles />);
      
      await screen.findByText('No articles found');
      expect(screen.getByText('Try adjusting your filters or check back later')).toBeInTheDocument();
    });
  });

  describe('Documents Page', () => {
    it('renders without crashing', () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] })
      });

      renderWithProviders(<Documents />);
      
      expect(screen.getByText('Documents')).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
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
        json: async () => ({ success: true, data: [] })
      });

      renderWithProviders(<Documents />);
      
      await screen.findByText('No documents found');
      expect(screen.getByText('Try adjusting your filters or check back later')).toBeInTheDocument();
    });
  });

  describe('Search Page', () => {
    it('renders without crashing', () => {
      renderWithProviders(<Search />);
      
      expect(screen.getByText('Search Results')).toBeInTheDocument();
    });

    it('shows search input', () => {
      renderWithProviders(<Search />);
      
      expect(screen.getByPlaceholderText('Search for content...')).toBeInTheDocument();
    });

    it('shows filter controls', () => {
      renderWithProviders(<Search />);
      
      expect(screen.getByText('Filter by Type')).toBeInTheDocument();
      expect(screen.getByText('Sort by')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles API errors gracefully in Articles', async () => {
      (fetch as any).mockRejectedValueOnce(new Error('API Error'));

      renderWithProviders(<Articles />);
      
      await screen.findByText('No articles found');
    });

    it('handles API errors gracefully in Documents', async () => {
      (fetch as any).mockRejectedValueOnce(new Error('API Error'));

      renderWithProviders(<Documents />);
      
      await screen.findByText('No documents found');
    });
  });

  describe('Content Display', () => {
    it('displays articles with correct data', async () => {
      const mockArticles = [
        {
          id: '1',
          title: 'Test Article',
          description: 'Test description',
          category: 'Technology',
          author_name: 'Test Author',
          created_at: '2024-01-01T00:00:00Z',
          readTime: '5 min read',
          views: 100,
          likes: 10,
          comments: 5,
          featured: false,
          tags: ['react', 'typescript']
        }
      ];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockArticles })
      });

      renderWithProviders(<Articles />);
      
      await screen.findByText('Test Article');
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByText('By Test Author')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('displays documents with correct data', async () => {
      const mockDocuments = [
        {
          id: '1',
          title: 'Test Document',
          description: 'Test description',
          type: 'document',
          author_name: 'Test Author',
          created_at: '2024-01-01T00:00:00Z',
          views: 100,
          likes: 10,
          comments: 5,
          category: 'Technology',
          featured: false,
          file_url: '/documents/test.pdf'
        }
      ];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockDocuments })
      });

      renderWithProviders(<Documents />);
      
      await screen.findByText('Test Document');
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByText('By Test Author')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });
  });
});
