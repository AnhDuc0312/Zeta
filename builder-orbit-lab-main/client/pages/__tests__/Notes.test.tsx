import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../test-utils';
import { mockApiResponses, mockFetch } from '../../test-utils';
import Notes from '../Notes';

describe('Notes Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch(mockApiResponses.notes);
  });

  it('renders notes page with title and filters', () => {
    render(<Notes />);
    
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search notes/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /color/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /sort by/i })).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(<Notes />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays notes after loading', async () => {
    render(<Notes />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    render(<Notes />);
    
    const searchInput = screen.getByPlaceholderText(/search notes/i);
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=test%20search')
      );
    });
  });

  it('handles category filter', async () => {
    render(<Notes />);
    
    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    fireEvent.change(categorySelect, { target: { value: 'Personal' } });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('category=Personal')
      );
    });
  });

  it('handles color filter', async () => {
    render(<Notes />);
    
    const colorSelect = screen.getByRole('combobox', { name: /color/i });
    fireEvent.change(colorSelect, { target: { value: 'yellow' } });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('color=yellow')
      );
    });
  });

  it('handles sort functionality', async () => {
    render(<Notes />);
    
    const sortSelect = screen.getByRole('combobox', { name: /sort by/i });
    fireEvent.change(sortSelect, { target: { value: 'alphabetical' } });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('sort=alphabetical')
      );
    });
  });

  it('displays note metadata correctly', async () => {
    render(<Notes />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Personal')).toBeInTheDocument();
      expect(screen.getByText('50 words')).toBeInTheDocument();
    });
  });

  it('navigates to note detail when clicked', async () => {
    render(<Notes />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    });
    
    const noteLink = screen.getByRole('link', { name: /test note 1/i });
    expect(noteLink).toHaveAttribute('href', '/notes/1');
  });

  it('displays empty state when no notes', async () => {
    mockFetch({ data: [], total: 0, page: 1, limit: 12 });
    render(<Notes />);
    
    await waitFor(() => {
      expect(screen.getByText(/no notes found/i)).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    mockFetch({}, 500);
    render(<Notes />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch notes/i)).toBeInTheDocument();
    });
  });

  it('handles pagination', async () => {
    render(<Notes />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
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

  it('displays note content preview', async () => {
    render(<Notes />);
    
    await waitFor(() => {
      expect(screen.getByText('Test note content 1')).toBeInTheDocument();
    });
  });
});
