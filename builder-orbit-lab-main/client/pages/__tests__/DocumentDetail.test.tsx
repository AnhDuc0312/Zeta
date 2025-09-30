import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../test-utils';
import { mockApiResponses, mockFetch } from '../../test-utils';
import DocumentDetail from '../DocumentDetail';

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

describe('Document Detail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch(mockApiResponses.documents.data[0]);
  });

  it('renders document detail page with title', async () => {
    render(<DocumentDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Document 1')).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    render(<DocumentDetail />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays document metadata', async () => {
    render(<DocumentDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('1.0 MB')).toBeInTheDocument();
      expect(screen.getByText('PDF')).toBeInTheDocument();
    });
  });

  it('displays download button', async () => {
    render(<DocumentDetail />);
    
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /download/i })).toBeInTheDocument();
    });
  });

  it('handles like button click', async () => {
    mockFetch({ success: true });
    render(<DocumentDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Document 1')).toBeInTheDocument();
    });
    
    const likeButton = screen.getByRole('button', { name: /like/i });
    fireEvent.click(likeButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/content/1/like',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  it('handles error state', async () => {
    mockFetch({}, 500);
    render(<DocumentDetail />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load document/i)).toBeInTheDocument();
    });
  });

  it('displays back button', async () => {
    render(<DocumentDetail />);
    
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /back to documents/i })).toBeInTheDocument();
    });
  });

  it('displays share button', async () => {
    render(<DocumentDetail />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    });
  });

  it('handles share button click', async () => {
    Object.assign(navigator, {
      share: vi.fn().mockResolvedValue(undefined),
    });
    
    render(<DocumentDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Document 1')).toBeInTheDocument();
    });
    
    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);
    
    expect(navigator.share).toHaveBeenCalledWith({
      title: 'Test Document 1',
      text: 'Test document description 1',
      url: window.location.href,
    });
  });

  it('displays file preview', async () => {
    render(<DocumentDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('File Type: PDF')).toBeInTheDocument();
      expect(screen.getByText('Size: 1.0 MB')).toBeInTheDocument();
    });
  });

});
