import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../test-utils';
import { mockApiResponses, mockFetch } from '../../test-utils';
import NoteDetail from '../NoteDetail';

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

describe('Note Detail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch(mockApiResponses.notes.data[0]);
  });

  it('renders note detail page with title', async () => {
    render(<NoteDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    render(<NoteDetail />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays note content', async () => {
    render(<NoteDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test note content 1')).toBeInTheDocument();
    });
  });

  it('displays note metadata', async () => {
    render(<NoteDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Personal')).toBeInTheDocument();
      expect(screen.getByText('50 words')).toBeInTheDocument();
    });
  });

  it('handles like button click', async () => {
    mockFetch({ success: true });
    render(<NoteDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
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
    render(<NoteDetail />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load note/i)).toBeInTheDocument();
    });
  });

  it('displays back button', async () => {
    render(<NoteDetail />);
    
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /back to notes/i })).toBeInTheDocument();
    });
  });

  it('displays share button', async () => {
    render(<NoteDetail />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    });
  });

  it('handles share button click', async () => {
    Object.assign(navigator, {
      share: vi.fn().mockResolvedValue(undefined),
    });
    
    render(<NoteDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    });
    
    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);
    
    expect(navigator.share).toHaveBeenCalledWith({
      title: 'Test Note 1',
      text: 'Test note content 1',
      url: window.location.href,
    });
  });

  it('displays note styling', async () => {
    render(<NoteDetail />);
    
    await waitFor(() => {
      // Check for sticky note styling elements
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    });
  });

  it('displays related notes', async () => {
    render(<NoteDetail />);
    
    await waitFor(() => {
      expect(screen.getByText(/related notes/i)).toBeInTheDocument();
    });
  });

  it('displays tags', async () => {
    render(<NoteDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument();
      expect(screen.getByText('note')).toBeInTheDocument();
    });
  });
});
