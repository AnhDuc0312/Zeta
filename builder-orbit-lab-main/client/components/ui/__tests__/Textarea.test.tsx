import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test-utils';
import { Textarea } from '../textarea';

describe('Textarea Component', () => {
  it('renders textarea with placeholder', () => {
    render(<Textarea placeholder="Enter text" />);
    
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test input' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(textarea).toHaveValue('test input');
  });

  it('handles disabled state', () => {
    render(<Textarea disabled />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('handles required state', () => {
    render(<Textarea required />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeRequired();
  });

  it('handles value prop', () => {
    render(<Textarea value="test value" readOnly />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('test value');
  });

  it('handles defaultValue prop', () => {
    render(<Textarea defaultValue="default value" />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('default value');
  });

  it('handles focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(<Textarea onFocus={handleFocus} onBlur={handleBlur} />);
    
    const textarea = screen.getByRole('textbox');
    
    fireEvent.focus(textarea);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(textarea);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('handles key events', () => {
    const handleKeyDown = vi.fn();
    const handleKeyUp = vi.fn();
    
    render(<Textarea onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />);
    
    const textarea = screen.getByRole('textbox');
    
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
    
    fireEvent.keyUp(textarea, { key: 'Enter' });
    expect(handleKeyUp).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Textarea className="custom-textarea" />);
    
    expect(screen.getByRole('textbox')).toHaveClass('custom-textarea');
  });

  it('handles different sizes', () => {
    const { rerender } = render(<Textarea size="sm" />);
    expect(screen.getByRole('textbox')).toHaveClass('h-20');
    
    rerender(<Textarea size="md" />);
    expect(screen.getByRole('textbox')).toHaveClass('h-24');
    
    rerender(<Textarea size="lg" />);
    expect(screen.getByRole('textbox')).toHaveClass('h-32');
  });

  it('handles error state', () => {
    render(<Textarea className="border-red-500" />);
    
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  it('handles autoComplete attribute', () => {
    render(<Textarea autoComplete="off" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'off');
  });

  it('handles autoFocus attribute', () => {
    render(<Textarea autoFocus />);
    
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('handles maxLength attribute', () => {
    render(<Textarea maxLength={100} />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '100');
  });

  it('handles minLength attribute', () => {
    render(<Textarea minLength={10} />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('minlength', '10');
  });

  it('handles rows attribute', () => {
    render(<Textarea rows={5} />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });

  it('handles cols attribute', () => {
    render(<Textarea cols={50} />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('cols', '50');
  });

  it('handles wrap attribute', () => {
    render(<Textarea wrap="soft" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('wrap', 'soft');
  });

  it('handles resize attribute', () => {
    render(<Textarea className="resize-none" />);
    
    expect(screen.getByRole('textbox')).toHaveClass('resize-none');
  });

  it('handles spellCheck attribute', () => {
    render(<Textarea spellCheck={false} />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('spellcheck', 'false');
  });

  it('handles readOnly attribute', () => {
    render(<Textarea readOnly />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('readonly');
  });

  it('handles form attribute', () => {
    render(<Textarea form="test-form" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('form', 'test-form');
  });

  it('handles name attribute', () => {
    render(<Textarea name="test-name" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'test-name');
  });

  it('handles id attribute', () => {
    render(<Textarea id="test-id" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test-id');
  });

  it('handles title attribute', () => {
    render(<Textarea title="Test title" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('title', 'Test title');
  });

  it('handles aria-label attribute', () => {
    render(<Textarea aria-label="Test label" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Test label');
  });

  it('handles aria-describedby attribute', () => {
    render(<Textarea aria-describedby="test-description" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'test-description');
  });

  it('handles aria-invalid attribute', () => {
    render(<Textarea aria-invalid="true" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles aria-required attribute', () => {
    render(<Textarea aria-required="true" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
  });

  it('handles aria-disabled attribute', () => {
    render(<Textarea aria-disabled="true" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-disabled', 'true');
  });

  it('handles aria-readonly attribute', () => {
    render(<Textarea aria-readonly="true" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-readonly', 'true');
  });

  it('handles aria-placeholder attribute', () => {
    render(<Textarea aria-placeholder="Test placeholder" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-placeholder', 'Test placeholder');
  });

  it('handles aria-valuemin attribute', () => {
    render(<Textarea aria-valuemin="0" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-valuemin', '0');
  });

  it('handles aria-valuemax attribute', () => {
    render(<Textarea aria-valuemax="100" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-valuemax', '100');
  });

  it('handles aria-valuenow attribute', () => {
    render(<Textarea aria-valuenow="50" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-valuenow', '50');
  });

  it('handles aria-valuetext attribute', () => {
    render(<Textarea aria-valuetext="50 percent" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-valuetext', '50 percent');
  });

  it('handles aria-orientation attribute', () => {
    render(<Textarea aria-orientation="vertical" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('handles aria-autocomplete attribute', () => {
    render(<Textarea aria-autocomplete="inline" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-autocomplete', 'inline');
  });

  it('handles aria-multiline attribute', () => {
    render(<Textarea aria-multiline="true" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-multiline', 'true');
  });

  it('handles aria-expanded attribute', () => {
    render(<Textarea aria-expanded="true" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-expanded', 'true');
  });

  it('handles aria-haspopup attribute', () => {
    render(<Textarea aria-haspopup="true" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-haspopup', 'true');
  });

  it('handles aria-controls attribute', () => {
    render(<Textarea aria-controls="test-controls" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-controls', 'test-controls');
  });

  it('handles aria-activedescendant attribute', () => {
    render(<Textarea aria-activedescendant="test-active" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-activedescendant', 'test-active');
  });

  it('handles aria-owns attribute', () => {
    render(<Textarea aria-owns="test-owns" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-owns', 'test-owns');
  });

  it('handles aria-labelledby attribute', () => {
    render(<Textarea aria-labelledby="test-labelledby" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-labelledby', 'test-labelledby');
  });

  it('handles aria-describedby attribute', () => {
    render(<Textarea aria-describedby="test-describedby" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'test-describedby');
  });

  it('handles aria-errormessage attribute', () => {
    render(<Textarea aria-errormessage="test-error" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-errormessage', 'test-error');
  });

  it('handles aria-invalid attribute', () => {
    render(<Textarea aria-invalid="true" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles aria-required attribute', () => {
    render(<Textarea aria-required="true" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
  });

  it('handles aria-disabled attribute', () => {
    render(<Textarea aria-disabled="true" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-disabled', 'true');
  });

  it('handles aria-readonly attribute', () => {
    render(<Textarea aria-readonly="true" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-readonly', 'true');
  });

  it('handles aria-placeholder attribute', () => {
    render(<Textarea aria-placeholder="Test placeholder" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-placeholder', 'Test placeholder');
  });

  it('handles aria-valuemin attribute', () => {
    render(<Textarea aria-valuemin="0" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-valuemin', '0');
  });

  it('handles aria-valuemax attribute', () => {
    render(<Textarea aria-valuemax="100" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-valuemax', '100');
  });

  it('handles aria-valuenow attribute', () => {
    render(<Textarea aria-valuenow="50" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-valuenow', '50');
  });

  it('handles aria-valuetext attribute', () => {
    render(<Textarea aria-valuetext="50 percent" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-valuetext', '50 percent');
  });

  it('handles aria-orientation attribute', () => {
    render(<Textarea aria-orientation="vertical" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('handles aria-autocomplete attribute', () => {
    render(<Textarea aria-autocomplete="inline" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-autocomplete', 'inline');
  });

  it('handles aria-multiline attribute', () => {
    render(<Textarea aria-multiline="true" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-multiline', 'true');
  });

  it('handles aria-expanded attribute', () => {
    render(<Textarea aria-expanded="true" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-expanded', 'true');
  });

  it('handles aria-haspopup attribute', () => {
    render(<Textarea aria-haspopup="true" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-haspopup', 'true');
  });

  it('handles aria-controls attribute', () => {
    render(<Textarea aria-controls="test-controls" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-controls', 'test-controls');
  });

  it('handles aria-activedescendant attribute', () => {
    render(<Textarea aria-activedescendant="test-active" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-activedescendant', 'test-active');
  });

  it('handles aria-owns attribute', () => {
    render(<Textarea aria-owns="test-owns" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-owns', 'test-owns');
  });

  it('handles aria-labelledby attribute', () => {
    render(<Textarea aria-labelledby="test-labelledby" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-labelledby', 'test-labelledby');
  });

  it('handles aria-describedby attribute', () => {
    render(<Textarea aria-describedby="test-describedby" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'test-describedby');
  });

  it('handles aria-errormessage attribute', () => {
    render(<Textarea aria-errormessage="test-error" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-errormessage', 'test-error');
  });
});
