import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test-utils';
import { Input } from '../input';

describe('Input Component', () => {
  it('renders input with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test input' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('test input');
  });

  it('handles different input types', () => {
    const { rerender } = render(<Input type="text" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    
    rerender(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    
    rerender(<Input type="password" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'password');
    
    rerender(<Input type="number" />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
  });

  it('handles disabled state', () => {
    render(<Input disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed');
  });

  it('handles required state', () => {
    render(<Input required />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('handles value prop', () => {
    render(<Input value="test value" readOnly />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test value');
  });

  it('handles defaultValue prop', () => {
    render(<Input defaultValue="default value" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('default value');
  });

  it('handles focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
    
    const input = screen.getByRole('textbox');
    
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('handles key events', () => {
    const handleKeyDown = vi.fn();
    const handleKeyUp = vi.fn();
    
    render(<Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />);
    
    const input = screen.getByRole('textbox');
    
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
    
    fireEvent.keyUp(input, { key: 'Enter' });
    expect(handleKeyUp).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" />);
    
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('handles different sizes', () => {
    const { rerender } = render(<Input size="sm" />);
    expect(screen.getByRole('textbox')).toHaveClass('h-9');
    
    rerender(<Input size="lg" />);
    expect(screen.getByRole('textbox')).toHaveClass('h-11');
  });

  it('handles error state', () => {
    render(<Input className="border-red-500" />);
    
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  it('handles autoComplete attribute', () => {
    render(<Input autoComplete="email" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'email');
  });

  it('handles autoFocus attribute', () => {
    render(<Input autoFocus />);
    
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('handles maxLength attribute', () => {
    render(<Input maxLength={10} />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '10');
  });

  it('handles minLength attribute', () => {
    render(<Input minLength={5} />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('minlength', '5');
  });
});
