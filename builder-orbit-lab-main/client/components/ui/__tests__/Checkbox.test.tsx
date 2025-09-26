import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test-utils';
import { Checkbox } from '../checkbox';

describe('Checkbox Component', () => {
  it('renders checkbox with default state', () => {
    render(<Checkbox />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('renders checkbox with checked state', () => {
    render(<Checkbox checked />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('handles click events', () => {
    const handleCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={handleCheckedChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('handles controlled state', () => {
    const TestComponent = () => {
      const [checked, setChecked] = React.useState(false);
      
      return (
        <Checkbox 
          checked={checked} 
          onCheckedChange={setChecked}
        />
      );
    };
    
    render(<TestComponent />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('handles disabled state', () => {
    render(<Checkbox disabled />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('does not trigger onCheckedChange when disabled', () => {
    const handleCheckedChange = vi.fn();
    render(<Checkbox disabled onCheckedChange={handleCheckedChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });

  it('renders with custom className', () => {
    render(<Checkbox className="custom-checkbox" />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('custom-checkbox');
  });

  it('handles keyboard navigation', () => {
    const handleCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={handleCheckedChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    
    // Test space key
    fireEvent.keyDown(checkbox, { key: ' ' });
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
    
    // Test enter key
    fireEvent.keyDown(checkbox, { key: 'Enter' });
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });

  it('handles focus events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(<Checkbox onFocus={handleFocus} onBlur={handleBlur} />);
    
    const checkbox = screen.getByRole('checkbox');
    
    fireEvent.focus(checkbox);
    expect(handleFocus).toHaveBeenCalled();
    
    fireEvent.blur(checkbox);
    expect(handleBlur).toHaveBeenCalled();
  });

  it('handles mouse events', () => {
    const handleMouseDown = vi.fn();
    const handleMouseUp = vi.fn();
    
    render(<Checkbox onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} />);
    
    const checkbox = screen.getByRole('checkbox');
    
    fireEvent.mouseDown(checkbox);
    expect(handleMouseDown).toHaveBeenCalled();
    
    fireEvent.mouseUp(checkbox);
    expect(handleMouseUp).toHaveBeenCalled();
  });

  it('handles touch events', () => {
    const handleTouchStart = vi.fn();
    const handleTouchEnd = vi.fn();
    
    render(<Checkbox onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} />);
    
    const checkbox = screen.getByRole('checkbox');
    
    fireEvent.touchStart(checkbox);
    expect(handleTouchStart).toHaveBeenCalled();
    
    fireEvent.touchEnd(checkbox);
    expect(handleTouchEnd).toHaveBeenCalled();
  });

  it('handles different sizes', () => {
    const { rerender } = render(<Checkbox className="h-4 w-4" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-4 w-4');
    
    rerender(<Checkbox className="h-5 w-5" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-5 w-5');
    
    rerender(<Checkbox className="h-6 w-6" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-6 w-6');
  });

  it('handles different colors', () => {
    const { rerender } = render(<Checkbox className="text-blue-500" />);
    expect(screen.getByRole('checkbox')).toHaveClass('text-blue-500');
    
    rerender(<Checkbox className="text-green-500" />);
    expect(screen.getByRole('checkbox')).toHaveClass('text-green-500');
    
    rerender(<Checkbox className="text-red-500" />);
    expect(screen.getByRole('checkbox')).toHaveClass('text-red-500');
  });

  it('handles different shapes', () => {
    const { rerender } = render(<Checkbox className="rounded" />);
    expect(screen.getByRole('checkbox')).toHaveClass('rounded');
    
    rerender(<Checkbox className="rounded-lg" />);
    expect(screen.getByRole('checkbox')).toHaveClass('rounded-lg');
    
    rerender(<Checkbox className="rounded-none" />);
    expect(screen.getByRole('checkbox')).toHaveClass('rounded-none');
  });

  it('handles different animations', () => {
    const { rerender } = render(<Checkbox className="transition-all" />);
    expect(screen.getByRole('checkbox')).toHaveClass('transition-all');
    
    rerender(<Checkbox className="animate-pulse" />);
    expect(screen.getByRole('checkbox')).toHaveClass('animate-pulse');
    
    rerender(<Checkbox className="animate-bounce" />);
    expect(screen.getByRole('checkbox')).toHaveClass('animate-bounce');
  });

  it('handles different shadows', () => {
    const { rerender } = render(<Checkbox className="shadow-sm" />);
    expect(screen.getByRole('checkbox')).toHaveClass('shadow-sm');
    
    rerender(<Checkbox className="shadow-md" />);
    expect(screen.getByRole('checkbox')).toHaveClass('shadow-md');
    
    rerender(<Checkbox className="shadow-lg" />);
    expect(screen.getByRole('checkbox')).toHaveClass('shadow-lg');
  });

  it('handles different borders', () => {
    const { rerender } = render(<Checkbox className="border" />);
    expect(screen.getByRole('checkbox')).toHaveClass('border');
    
    rerender(<Checkbox className="border-2" />);
    expect(screen.getByRole('checkbox')).toHaveClass('border-2');
    
    rerender(<Checkbox className="border-4" />);
    expect(screen.getByRole('checkbox')).toHaveClass('border-4');
  });

  it('handles different opacity', () => {
    const { rerender } = render(<Checkbox className="opacity-50" />);
    expect(screen.getByRole('checkbox')).toHaveClass('opacity-50');
    
    rerender(<Checkbox className="opacity-75" />);
    expect(screen.getByRole('checkbox')).toHaveClass('opacity-75');
    
    rerender(<Checkbox className="opacity-100" />);
    expect(screen.getByRole('checkbox')).toHaveClass('opacity-100');
  });

  it('handles different transforms', () => {
    const { rerender } = render(<Checkbox className="scale-105" />);
    expect(screen.getByRole('checkbox')).toHaveClass('scale-105');
    
    rerender(<Checkbox className="scale-110" />);
    expect(screen.getByRole('checkbox')).toHaveClass('scale-110');
    
    rerender(<Checkbox className="scale-95" />);
    expect(screen.getByRole('checkbox')).toHaveClass('scale-95');
  });

  it('handles different positioning', () => {
    const { rerender } = render(<Checkbox className="relative" />);
    expect(screen.getByRole('checkbox')).toHaveClass('relative');
    
    rerender(<Checkbox className="absolute" />);
    expect(screen.getByRole('checkbox')).toHaveClass('absolute');
    
    rerender(<Checkbox className="fixed" />);
    expect(screen.getByRole('checkbox')).toHaveClass('fixed');
  });

  it('handles different z-index', () => {
    const { rerender } = render(<Checkbox className="z-10" />);
    expect(screen.getByRole('checkbox')).toHaveClass('z-10');
    
    rerender(<Checkbox className="z-20" />);
    expect(screen.getByRole('checkbox')).toHaveClass('z-20');
    
    rerender(<Checkbox className="z-30" />);
    expect(screen.getByRole('checkbox')).toHaveClass('z-30');
  });

  it('handles different margins', () => {
    const { rerender } = render(<Checkbox className="m-2" />);
    expect(screen.getByRole('checkbox')).toHaveClass('m-2');
    
    rerender(<Checkbox className="m-4" />);
    expect(screen.getByRole('checkbox')).toHaveClass('m-4');
    
    rerender(<Checkbox className="m-6" />);
    expect(screen.getByRole('checkbox')).toHaveClass('m-6');
  });

  it('handles different padding', () => {
    const { rerender } = render(<Checkbox className="p-2" />);
    expect(screen.getByRole('checkbox')).toHaveClass('p-2');
    
    rerender(<Checkbox className="p-4" />);
    expect(screen.getByRole('checkbox')).toHaveClass('p-4');
    
    rerender(<Checkbox className="p-6" />);
    expect(screen.getByRole('checkbox')).toHaveClass('p-6');
  });

  it('handles different widths', () => {
    const { rerender } = render(<Checkbox className="w-4" />);
    expect(screen.getByRole('checkbox')).toHaveClass('w-4');
    
    rerender(<Checkbox className="w-5" />);
    expect(screen.getByRole('checkbox')).toHaveClass('w-5');
    
    rerender(<Checkbox className="w-6" />);
    expect(screen.getByRole('checkbox')).toHaveClass('w-6');
  });

  it('handles different heights', () => {
    const { rerender } = render(<Checkbox className="h-4" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-4');
    
    rerender(<Checkbox className="h-5" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-5');
    
    rerender(<Checkbox className="h-6" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-6');
  });

  it('handles different flex properties', () => {
    const { rerender } = render(<Checkbox className="flex-1" />);
    expect(screen.getByRole('checkbox')).toHaveClass('flex-1');
    
    rerender(<Checkbox className="flex-grow" />);
    expect(screen.getByRole('checkbox')).toHaveClass('flex-grow');
    
    rerender(<Checkbox className="flex-shrink" />);
    expect(screen.getByRole('checkbox')).toHaveClass('flex-shrink');
  });

  it('handles different grid properties', () => {
    const { rerender } = render(<Checkbox className="col-span-1" />);
    expect(screen.getByRole('checkbox')).toHaveClass('col-span-1');
    
    rerender(<Checkbox className="col-span-2" />);
    expect(screen.getByRole('checkbox')).toHaveClass('col-span-2');
    
    rerender(<Checkbox className="col-span-3" />);
    expect(screen.getByRole('checkbox')).toHaveClass('col-span-3');
  });

  it('handles different display properties', () => {
    const { rerender } = render(<Checkbox className="block" />);
    expect(screen.getByRole('checkbox')).toHaveClass('block');
    
    rerender(<Checkbox className="inline-block" />);
    expect(screen.getByRole('checkbox')).toHaveClass('inline-block');
    
    rerender(<Checkbox className="flex" />);
    expect(screen.getByRole('checkbox')).toHaveClass('flex');
  });

  it('handles different overflow properties', () => {
    const { rerender } = render(<Checkbox className="overflow-hidden" />);
    expect(screen.getByRole('checkbox')).toHaveClass('overflow-hidden');
    
    rerender(<Checkbox className="overflow-visible" />);
    expect(screen.getByRole('checkbox')).toHaveClass('overflow-visible');
    
    rerender(<Checkbox className="overflow-scroll" />);
    expect(screen.getByRole('checkbox')).toHaveClass('overflow-scroll');
  });

  it('handles different text properties', () => {
    const { rerender } = render(<Checkbox className="text-center" />);
    expect(screen.getByRole('checkbox')).toHaveClass('text-center');
    
    rerender(<Checkbox className="text-left" />);
    expect(screen.getByRole('checkbox')).toHaveClass('text-left');
    
    rerender(<Checkbox className="text-right" />);
    expect(screen.getByRole('checkbox')).toHaveClass('text-right');
  });

  it('handles different font properties', () => {
    const { rerender } = render(<Checkbox className="font-bold" />);
    expect(screen.getByRole('checkbox')).toHaveClass('font-bold');
    
    rerender(<Checkbox className="font-semibold" />);
    expect(screen.getByRole('checkbox')).toHaveClass('font-semibold');
    
    rerender(<Checkbox className="font-normal" />);
    expect(screen.getByRole('checkbox')).toHaveClass('font-normal');
  });

  it('handles different line height properties', () => {
    const { rerender } = render(<Checkbox className="leading-tight" />);
    expect(screen.getByRole('checkbox')).toHaveClass('leading-tight');
    
    rerender(<Checkbox className="leading-normal" />);
    expect(screen.getByRole('checkbox')).toHaveClass('leading-normal');
    
    rerender(<Checkbox className="leading-loose" />);
    expect(screen.getByRole('checkbox')).toHaveClass('leading-loose');
  });

  it('handles different letter spacing properties', () => {
    const { rerender } = render(<Checkbox className="tracking-tight" />);
    expect(screen.getByRole('checkbox')).toHaveClass('tracking-tight');
    
    rerender(<Checkbox className="tracking-normal" />);
    expect(screen.getByRole('checkbox')).toHaveClass('tracking-normal');
    
    rerender(<Checkbox className="tracking-wide" />);
    expect(screen.getByRole('checkbox')).toHaveClass('tracking-wide');
  });

  it('handles different word spacing properties', () => {
    const { rerender } = render(<Checkbox className="word-spacing-tight" />);
    expect(screen.getByRole('checkbox')).toHaveClass('word-spacing-tight');
    
    rerender(<Checkbox className="word-spacing-normal" />);
    expect(screen.getByRole('checkbox')).toHaveClass('word-spacing-normal');
    
    rerender(<Checkbox className="word-spacing-wide" />);
    expect(screen.getByRole('checkbox')).toHaveClass('word-spacing-wide');
  });
});
