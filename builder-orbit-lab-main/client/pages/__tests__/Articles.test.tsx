import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../test-utils';
import { mockApiResponses, mockFetch } from '../../test-utils';
import Articles from '../Articles';

describe('Articles Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch(mockApiResponses.articles);
  });

  it('renders articles page with title and filters', () => {
    render(<Articles />);
    
    expect(screen.getByText('Articles')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search articles/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /sort by/i })).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(<Articles />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays articles after loading', async () => {
    render(<Articles />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      expect(screen.getByText('Test Article 2')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    render(<Articles />);
    
    const searchInput = screen.getByPlaceholderText(/search articles/i);
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=test%20search')
      );
    });
  });

  it('handles category filter', async () => {
    render(<Articles />);
    
    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    fireEvent.change(categorySelect, { target: { value: 'Technology' } });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('category=Technology')
      );
    });
  });

  it('handles sort functionality', async () => {
    render(<Articles />);
    
    const sortSelect = screen.getByRole('combobox', { name: /sort by/i });
    fireEvent.change(sortSelect, { target: { value: 'oldest' } });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('sort=oldest')
      );
    });
  });

  it('handles pagination', async () => {
    render(<Articles />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    });
    
    // Test pagination buttons
    const nextButton = screen.getByRole('button', { name: /next/i });
    if (nextButton) {
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('page=2')
        );
      });
    }
  });

  it('displays empty state when no articles', async () => {
    mockFetch({ data: [], total: 0, page: 1, limit: 12 });
    render(<Articles />);
    
    await waitFor(() => {
      expect(screen.getByText(/no articles found/i)).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    mockFetch({}, 500);
    render(<Articles />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch articles/i)).toBeInTheDocument();
    });
  });

  it('navigates to article detail when clicked', async () => {
    render(<Articles />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    });
    
    const articleLink = screen.getByRole('link', { name: /test article 1/i });
    expect(articleLink).toHaveAttribute('href', '/articles/1');
  });

  it('displays article metadata correctly', async () => {
    render(<Articles />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('100 views')).toBeInTheDocument();
      expect(screen.getByText('10 likes')).toBeInTheDocument();
    });
  });
});
