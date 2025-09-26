import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test-utils';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../pagination';

describe('Pagination Component', () => {
  it('renders pagination with page numbers', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders previous and next buttons', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    
    expect(screen.getByRole('link', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /next/i })).toBeInTheDocument();
  });

  it('handles page number clicks', () => {
    const handlePageChange = vi.fn();
    
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" onClick={() => handlePageChange(1)}>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" onClick={() => handlePageChange(2)}>2</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    
    const page2 = screen.getByText('2');
    fireEvent.click(page2);
    
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('handles previous button click', () => {
    const handlePrevious = vi.fn();
    
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={handlePrevious} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    
    const previousButton = screen.getByRole('link', { name: /previous/i });
    fireEvent.click(previousButton);
    
    expect(handlePrevious).toHaveBeenCalled();
  });

  it('handles next button click', () => {
    const handleNext = vi.fn();
    
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext href="#" onClick={handleNext} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    
    const nextButton = screen.getByRole('link', { name: /next/i });
    fireEvent.click(nextButton);
    
    expect(handleNext).toHaveBeenCalled();
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" className="pointer-events-none opacity-50" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    
    const previousButton = screen.getByRole('link', { name: /previous/i });
    expect(previousButton).toHaveClass('pointer-events-none opacity-50');
  });

  it('disables next button on last page', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext href="#" className="pointer-events-none opacity-50" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    
    const nextButton = screen.getByRole('link', { name: /next/i });
    expect(nextButton).toHaveClass('pointer-events-none opacity-50');
  });

  it('highlights current page', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" className="bg-primary text-primary-foreground">2</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    
    const currentPage = screen.getByText('2');
    expect(currentPage).toHaveClass('bg-primary text-primary-foreground');
  });

  it('renders with custom className', () => {
    render(
      <Pagination className="custom-pagination">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    
    expect(screen.getByRole('navigation')).toHaveClass('custom-pagination');
  });

  it('handles ellipsis for large page counts', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <span>...</span>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">10</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" tabIndex={0}>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" tabIndex={0}>2</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    
    const page1 = screen.getByText('1');
    const page2 = screen.getByText('2');
    
    expect(page1).toHaveAttribute('tabIndex', '0');
    expect(page2).toHaveAttribute('tabIndex', '0');
  });

  it('handles aria labels', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" aria-label="Go to previous page" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" aria-label="Go to page 1">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" aria-label="Go to next page" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
  });

  it('handles page size selector', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <select>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('10 per page')).toBeInTheDocument();
  });

  it('handles total count display', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <span>Showing 1-10 of 100 results</span>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    
    expect(screen.getByText('Showing 1-10 of 100 results')).toBeInTheDocument();
  });
});
