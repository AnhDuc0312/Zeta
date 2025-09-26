import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';

describe('Select Component', () => {
  it('renders select with placeholder', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );
    
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('opens select content when clicked', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  it('selects an option when clicked', async () => {
    const handleValueChange = vi.fn();
    
    render(
      <Select onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
    
    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);
    
    expect(handleValueChange).toHaveBeenCalledWith('option1');
  });

  it('handles disabled state', () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('data-disabled', 'true');
  });

  it('handles default value', () => {
    render(
      <Select defaultValue="option1">
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('handles controlled value', () => {
    render(
      <Select value="option2">
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );
    
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    );
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
    
    // Test arrow down navigation
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    
    // Test enter to select
    fireEvent.keyDown(trigger, { key: 'Enter' });
  });

  it('handles escape key to close', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
    
    fireEvent.keyDown(trigger, { key: 'Escape' });
  });

  it('handles click outside to close', async () => {
    render(
      <div>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
        <div data-testid="outside">Outside</div>
      </div>
    );
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
    
    const outside = screen.getByTestId('outside');
    fireEvent.click(outside);
  });

  it('renders with custom className', () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="custom-content">
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    
    expect(screen.getByRole('combobox')).toHaveClass('custom-trigger');
  });

  it('handles multiple options', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
          <SelectItem value="option4">Option 4</SelectItem>
        </SelectContent>
      </Select>
    );
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
      expect(screen.getByText('Option 4')).toBeInTheDocument();
    });
  });

  it('handles empty state', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {/* No options */}
        </SelectContent>
      </Select>
    );
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    // Should not crash with empty content
    expect(trigger).toBeInTheDocument();
  });
});
