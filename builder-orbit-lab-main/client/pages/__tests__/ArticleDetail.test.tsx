import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../test-utils';
import { mockApiResponses, mockFetch } from '../../test-utils';
import ArticleDetail from '../ArticleDetail';

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

describe('Article Detail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch(mockApiResponses.articles.data[0]);
  });

  it('renders article detail page with title', async () => {
    render(<ArticleDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    render(<ArticleDetail />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays article content', async () => {
    render(<ArticleDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test description 1')).toBeInTheDocument();
      expect(screen.getByText('Test content 1')).toBeInTheDocument();
    });
  });

  it('displays article metadata', async () => {
    render(<ArticleDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('100 views')).toBeInTheDocument();
      expect(screen.getByText('10 likes')).toBeInTheDocument();
      expect(screen.getByText('5 min read')).toBeInTheDocument();
    });
  });

  it('handles like button click', async () => {
    mockFetch({ success: true });
    render(<ArticleDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    });
    
    const likeButton = screen.getByRole('button', { name: /like/i });
    fireEvent.click(likeButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/content/1/like',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer'),
          }),
        })
      );
    });
  });

  it('handles unlike button click', async () => {
    // Mock initial like status as liked
    mockFetch({ isLiked: true });
    mockFetch({ success: true });
    render(<ArticleDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    });
    
    const unlikeButton = screen.getByRole('button', { name: /unlike/i });
    fireEvent.click(unlikeButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/content/1/like',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  it('displays tags correctly', async () => {
    render(<ArticleDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument();
      expect(screen.getByText('article')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    mockFetch({}, 500);
    render(<ArticleDetail />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load article/i)).toBeInTheDocument();
    });
  });

  it('displays back button', async () => {
    render(<ArticleDetail />);
    
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /back to articles/i })).toBeInTheDocument();
    });
  });

  it('displays share button', async () => {
    render(<ArticleDetail />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    });
  });

  it('handles share button click', async () => {
    // Mock navigator.share
    Object.assign(navigator, {
      share: vi.fn().mockResolvedValue(undefined),
    });
    
    render(<ArticleDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    });
    
    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);
    
    expect(navigator.share).toHaveBeenCalledWith({
      title: 'Test Article 1',
      text: 'Test description 1',
      url: window.location.href,
    });
  });

  it('displays related articles section', async () => {
    render(<ArticleDetail />);
    
    await waitFor(() => {
      expect(screen.getByText(/related articles/i)).toBeInTheDocument();
    });
  });

  it('handles like button loading state', async () => {
    mockFetch({ success: true });
    render(<ArticleDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    });
    
    const likeButton = screen.getByRole('button', { name: /like/i });
    fireEvent.click(likeButton);
    
    // Should show loading state
    expect(screen.getByRole('button', { name: /like/i })).toBeDisabled();
  });
});
