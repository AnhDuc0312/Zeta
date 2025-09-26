import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../test-utils';
import { mockApiResponses, mockFetch } from '../../test-utils';
import Documents from '../Documents';

describe('Documents Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch(mockApiResponses.documents);
  });

  it('renders documents page with title and filters', () => {
    render(<Documents />);
    
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search documents/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /file type/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /sort by/i })).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(<Documents />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays documents after loading', async () => {
    render(<Documents />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Document 1')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    render(<Documents />);
    
    const searchInput = screen.getByPlaceholderText(/search documents/i);
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=test%20search')
      );
    });
  });

  it('handles category filter', async () => {
    render(<Documents />);
    
    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    fireEvent.change(categorySelect, { target: { value: 'Technology' } });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('category=Technology')
      );
    });
  });

  it('handles file type filter', async () => {
    render(<Documents />);
    
    const fileTypeSelect = screen.getByRole('combobox', { name: /file type/i });
    fireEvent.change(fileTypeSelect, { target: { value: 'PDF' } });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('file_type=PDF')
      );
    });
  });

  it('handles sort functionality', async () => {
    render(<Documents />);
    
    const sortSelect = screen.getByRole('combobox', { name: /sort by/i });
    fireEvent.change(sortSelect, { target: { value: 'newest' } });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('sort=newest')
      );
    });
  });

  it('displays document metadata correctly', async () => {
    render(<Documents />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Document 1')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('1.0 MB')).toBeInTheDocument();
      expect(screen.getByText('PDF')).toBeInTheDocument();
    });
  });

  it('navigates to document detail when clicked', async () => {
    render(<Documents />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Document 1')).toBeInTheDocument();
    });
    
    const documentLink = screen.getByRole('link', { name: /test document 1/i });
    expect(documentLink).toHaveAttribute('href', '/documents/1');
  });

  it('displays download button', async () => {
    render(<Documents />);
    
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /download/i })).toBeInTheDocument();
    });
  });

  it('displays empty state when no documents', async () => {
    mockFetch({ data: [], total: 0, page: 1, limit: 12 });
    render(<Documents />);
    
    await waitFor(() => {
      expect(screen.getByText(/no documents found/i)).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    mockFetch({}, 500);
    render(<Documents />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch documents/i)).toBeInTheDocument();
    });
  });

  it('handles pagination', async () => {
    render(<Documents />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Document 1')).toBeInTheDocument();
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
});
