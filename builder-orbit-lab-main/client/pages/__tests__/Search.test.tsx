import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../test-utils';
import { mockApiResponses, mockFetch } from '../../test-utils';
import Search from '../Search';

describe('Search Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search page with search input', () => {
    render(<Search />);
    
    expect(screen.getByPlaceholderText(/search everything/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('handles search input changes', () => {
    render(<Search />);
    
    const searchInput = screen.getByPlaceholderText(/search everything/i);
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(searchInput).toHaveValue('test search');
  });

  it('handles search submission', async () => {
    mockFetch({
      articles: mockApiResponses.articles,
      documents: mockApiResponses.documents,
      notes: mockApiResponses.notes,
    });
    
    render(<Search />);
    
    const searchInput = screen.getByPlaceholderText(/search everything/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=test%20search')
      );
    });
  });

  it('handles search on enter key press', async () => {
    mockFetch({
      articles: mockApiResponses.articles,
      documents: mockApiResponses.documents,
      notes: mockApiResponses.notes,
    });
    
    render(<Search />);
    
    const searchInput = screen.getByPlaceholderText(/search everything/i);
    
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=test%20search')
      );
    });
  });

  it('displays search results', async () => {
    mockFetch({
      articles: mockApiResponses.articles,
      documents: mockApiResponses.documents,
      notes: mockApiResponses.notes,
    });
    
    render(<Search />);
    
    const searchInput = screen.getByPlaceholderText(/search everything/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Articles')).toBeInTheDocument();
      expect(screen.getByText('Documents')).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();
    });
  });

  it('displays search results for each content type', async () => {
    mockFetch({
      articles: mockApiResponses.articles,
      documents: mockApiResponses.documents,
      notes: mockApiResponses.notes,
    });
    
    render(<Search />);
    
    const searchInput = screen.getByPlaceholderText(/search everything/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      expect(screen.getByText('Test Document 1')).toBeInTheDocument();
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    });
  });

  it('displays empty state when no results', async () => {
    mockFetch({
      articles: { data: [], total: 0 },
      documents: { data: [], total: 0 },
      notes: { data: [], total: 0 },
    });
    
    render(<Search />);
    
    const searchInput = screen.getByPlaceholderText(/search everything/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  it('handles search error', async () => {
    mockFetch({}, 500);
    
    render(<Search />);
    
    const searchInput = screen.getByPlaceholderText(/search everything/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText(/search failed/i)).toBeInTheDocument();
    });
  });

  it('displays loading state during search', async () => {
    mockFetch({}, 0); // Never resolves
    render(<Search />);
    
    const searchInput = screen.getByPlaceholderText(/search everything/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.click(searchButton);
    
    expect(screen.getByText(/searching/i)).toBeInTheDocument();
  });

  it('handles clear search', async () => {
    render(<Search />);
    
    const searchInput = screen.getByPlaceholderText(/search everything/i);
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);
    
    expect(searchInput).toHaveValue('');
  });

  it('displays search suggestions', async () => {
    mockFetch({
      suggestions: ['test article', 'test document', 'test note'],
    });
    
    render(<Search />);
    
    const searchInput = screen.getByPlaceholderText(/search everything/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.getByText('test article')).toBeInTheDocument();
      expect(screen.getByText('test document')).toBeInTheDocument();
      expect(screen.getByText('test note')).toBeInTheDocument();
    });
  });

  it('handles suggestion click', async () => {
    mockFetch({
      suggestions: ['test article'],
    });
    
    render(<Search />);
    
    const searchInput = screen.getByPlaceholderText(/search everything/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.getByText('test article')).toBeInTheDocument();
    });
    
    const suggestion = screen.getByText('test article');
    fireEvent.click(suggestion);
    
    expect(searchInput).toHaveValue('test article');
  });

  it('displays search filters', () => {
    render(<Search />);
    
    expect(screen.getByText(/filter by type/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /articles/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /documents/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /notes/i })).toBeInTheDocument();
  });

  it('handles filter changes', async () => {
    render(<Search />);
    
    const articlesCheckbox = screen.getByRole('checkbox', { name: /articles/i });
    fireEvent.click(articlesCheckbox);
    
    expect(articlesCheckbox).toBeChecked();
  });
});
