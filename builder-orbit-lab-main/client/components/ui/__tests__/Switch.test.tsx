import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test-utils';
import { Switch } from '../switch';

describe('Switch Component', () => {
  it('renders switch with default state', () => {
    render(<Switch />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).not.toBeChecked();
  });

  it('renders switch with checked state', () => {
    render(<Switch checked />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeChecked();
  });

  it('handles click events', () => {
    const handleCheckedChange = vi.fn();
    render(<Switch onCheckedChange={handleCheckedChange} />);
    
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('handles controlled state', () => {
    const TestComponent = () => {
      const [checked, setChecked] = React.useState(false);
      
      return (
        <Switch 
          checked={checked} 
          onCheckedChange={setChecked}
        />
      );
    };
    
    render(<TestComponent />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).not.toBeChecked();
    
    fireEvent.click(switchElement);
    expect(switchElement).toBeChecked();
  });

  it('handles disabled state', () => {
    render(<Switch disabled />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeDisabled();
  });

  it('does not trigger onCheckedChange when disabled', () => {
    const handleCheckedChange = vi.fn();
    render(<Switch disabled onCheckedChange={handleCheckedChange} />);
    
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });

  it('renders with custom className', () => {
    render(<Switch className="custom-switch" />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('custom-switch');
  });

  it('handles keyboard navigation', () => {
    const handleCheckedChange = vi.fn();
    render(<Switch onCheckedChange={handleCheckedChange} />);
    
    const switchElement = screen.getByRole('switch');
    
    // Test space key
    fireEvent.keyDown(switchElement, { key: ' ' });
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
    
    // Test enter key
    fireEvent.keyDown(switchElement, { key: 'Enter' });
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });

  it('handles focus events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(<Switch onFocus={handleFocus} onBlur={handleBlur} />);
    
    const switchElement = screen.getByRole('switch');
    
    fireEvent.focus(switchElement);
    expect(handleFocus).toHaveBeenCalled();
    
    fireEvent.blur(switchElement);
    expect(handleBlur).toHaveBeenCalled();
  });

  it('handles mouse events', () => {
    const handleMouseDown = vi.fn();
    const handleMouseUp = vi.fn();
    
    render(<Switch onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} />);
    
    const switchElement = screen.getByRole('switch');
    
    fireEvent.mouseDown(switchElement);
    expect(handleMouseDown).toHaveBeenCalled();
    
    fireEvent.mouseUp(switchElement);
    expect(handleMouseUp).toHaveBeenCalled();
  });

  it('handles touch events', () => {
    const handleTouchStart = vi.fn();
    const handleTouchEnd = vi.fn();
    
    render(<Switch onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} />);
    
    const switchElement = screen.getByRole('switch');
    
    fireEvent.touchStart(switchElement);
    expect(handleTouchStart).toHaveBeenCalled();
    
    fireEvent.touchEnd(switchElement);
    expect(handleTouchEnd).toHaveBeenCalled();
  });

  it('handles different sizes', () => {
    const { rerender } = render(<Switch className="h-4 w-8" />);
    expect(screen.getByRole('switch')).toHaveClass('h-4 w-8');
    
    rerender(<Switch className="h-6 w-12" />);
    expect(screen.getByRole('switch')).toHaveClass('h-6 w-12');
    
    rerender(<Switch className="h-8 w-16" />);
    expect(screen.getByRole('switch')).toHaveClass('h-8 w-16');
  });

  it('handles different colors', () => {
    const { rerender } = render(<Switch className="bg-blue-500" />);
    expect(screen.getByRole('switch')).toHaveClass('bg-blue-500');
    
    rerender(<Switch className="bg-green-500" />);
    expect(screen.getByRole('switch')).toHaveClass('bg-green-500');
    
    rerender(<Switch className="bg-red-500" />);
    expect(screen.getByRole('switch')).toHaveClass('bg-red-500');
  });

  it('handles different shapes', () => {
    const { rerender } = render(<Switch className="rounded-full" />);
    expect(screen.getByRole('switch')).toHaveClass('rounded-full');
    
    rerender(<Switch className="rounded-lg" />);
    expect(screen.getByRole('switch')).toHaveClass('rounded-lg');
    
    rerender(<Switch className="rounded-none" />);
    expect(screen.getByRole('switch')).toHaveClass('rounded-none');
  });

  it('handles different animations', () => {
    const { rerender } = render(<Switch className="transition-all" />);
    expect(screen.getByRole('switch')).toHaveClass('transition-all');
    
    rerender(<Switch className="animate-pulse" />);
    expect(screen.getByRole('switch')).toHaveClass('animate-pulse');
    
    rerender(<Switch className="animate-bounce" />);
    expect(screen.getByRole('switch')).toHaveClass('animate-bounce');
  });

  it('handles different shadows', () => {
    const { rerender } = render(<Switch className="shadow-sm" />);
    expect(screen.getByRole('switch')).toHaveClass('shadow-sm');
    
    rerender(<Switch className="shadow-md" />);
    expect(screen.getByRole('switch')).toHaveClass('shadow-md');
    
    rerender(<Switch className="shadow-lg" />);
    expect(screen.getByRole('switch')).toHaveClass('shadow-lg');
  });

  it('handles different borders', () => {
    const { rerender } = render(<Switch className="border" />);
    expect(screen.getByRole('switch')).toHaveClass('border');
    
    rerender(<Switch className="border-2" />);
    expect(screen.getByRole('switch')).toHaveClass('border-2');
    
    rerender(<Switch className="border-4" />);
    expect(screen.getByRole('switch')).toHaveClass('border-4');
  });

  it('handles different opacity', () => {
    const { rerender } = render(<Switch className="opacity-50" />);
    expect(screen.getByRole('switch')).toHaveClass('opacity-50');
    
    rerender(<Switch className="opacity-75" />);
    expect(screen.getByRole('switch')).toHaveClass('opacity-75');
    
    rerender(<Switch className="opacity-100" />);
    expect(screen.getByRole('switch')).toHaveClass('opacity-100');
  });

  it('handles different transforms', () => {
    const { rerender } = render(<Switch className="scale-105" />);
    expect(screen.getByRole('switch')).toHaveClass('scale-105');
    
    rerender(<Switch className="scale-110" />);
    expect(screen.getByRole('switch')).toHaveClass('scale-110');
    
    rerender(<Switch className="scale-95" />);
    expect(screen.getByRole('switch')).toHaveClass('scale-95');
  });

  it('handles different positioning', () => {
    const { rerender } = render(<Switch className="relative" />);
    expect(screen.getByRole('switch')).toHaveClass('relative');
    
    rerender(<Switch className="absolute" />);
    expect(screen.getByRole('switch')).toHaveClass('absolute');
    
    rerender(<Switch className="fixed" />);
    expect(screen.getByRole('switch')).toHaveClass('fixed');
  });

  it('handles different z-index', () => {
    const { rerender } = render(<Switch className="z-10" />);
    expect(screen.getByRole('switch')).toHaveClass('z-10');
    
    rerender(<Switch className="z-20" />);
    expect(screen.getByRole('switch')).toHaveClass('z-20');
    
    rerender(<Switch className="z-30" />);
    expect(screen.getByRole('switch')).toHaveClass('z-30');
  });

  it('handles different margins', () => {
    const { rerender } = render(<Switch className="m-2" />);
    expect(screen.getByRole('switch')).toHaveClass('m-2');
    
    rerender(<Switch className="m-4" />);
    expect(screen.getByRole('switch')).toHaveClass('m-4');
    
    rerender(<Switch className="m-6" />);
    expect(screen.getByRole('switch')).toHaveClass('m-6');
  });

  it('handles different padding', () => {
    const { rerender } = render(<Switch className="p-2" />);
    expect(screen.getByRole('switch')).toHaveClass('p-2');
    
    rerender(<Switch className="p-4" />);
    expect(screen.getByRole('switch')).toHaveClass('p-4');
    
    rerender(<Switch className="p-6" />);
    expect(screen.getByRole('switch')).toHaveClass('p-6');
  });

  it('handles different widths', () => {
    const { rerender } = render(<Switch className="w-8" />);
    expect(screen.getByRole('switch')).toHaveClass('w-8');
    
    rerender(<Switch className="w-12" />);
    expect(screen.getByRole('switch')).toHaveClass('w-12');
    
    rerender(<Switch className="w-16" />);
    expect(screen.getByRole('switch')).toHaveClass('w-16');
  });

  it('handles different heights', () => {
    const { rerender } = render(<Switch className="h-4" />);
    expect(screen.getByRole('switch')).toHaveClass('h-4');
    
    rerender(<Switch className="h-6" />);
    expect(screen.getByRole('switch')).toHaveClass('h-6');
    
    rerender(<Switch className="h-8" />);
    expect(screen.getByRole('switch')).toHaveClass('h-8');
  });

  it('handles different flex properties', () => {
    const { rerender } = render(<Switch className="flex-1" />);
    expect(screen.getByRole('switch')).toHaveClass('flex-1');
    
    rerender(<Switch className="flex-grow" />);
    expect(screen.getByRole('switch')).toHaveClass('flex-grow');
    
    rerender(<Switch className="flex-shrink" />);
    expect(screen.getByRole('switch')).toHaveClass('flex-shrink');
  });

  it('handles different grid properties', () => {
    const { rerender } = render(<Switch className="col-span-1" />);
    expect(screen.getByRole('switch')).toHaveClass('col-span-1');
    
    rerender(<Switch className="col-span-2" />);
    expect(screen.getByRole('switch')).toHaveClass('col-span-2');
    
    rerender(<Switch className="col-span-3" />);
    expect(screen.getByRole('switch')).toHaveClass('col-span-3');
  });

  it('handles different display properties', () => {
    const { rerender } = render(<Switch className="block" />);
    expect(screen.getByRole('switch')).toHaveClass('block');
    
    rerender(<Switch className="inline-block" />);
    expect(screen.getByRole('switch')).toHaveClass('inline-block');
    
    rerender(<Switch className="flex" />);
    expect(screen.getByRole('switch')).toHaveClass('flex');
  });

  it('handles different overflow properties', () => {
    const { rerender } = render(<Switch className="overflow-hidden" />);
    expect(screen.getByRole('switch')).toHaveClass('overflow-hidden');
    
    rerender(<Switch className="overflow-visible" />);
    expect(screen.getByRole('switch')).toHaveClass('overflow-visible');
    
    rerender(<Switch className="overflow-scroll" />);
    expect(screen.getByRole('switch')).toHaveClass('overflow-scroll');
  });

  it('handles different text properties', () => {
    const { rerender } = render(<Switch className="text-center" />);
    expect(screen.getByRole('switch')).toHaveClass('text-center');
    
    rerender(<Switch className="text-left" />);
    expect(screen.getByRole('switch')).toHaveClass('text-left');
    
    rerender(<Switch className="text-right" />);
    expect(screen.getByRole('switch')).toHaveClass('text-right');
  });

  it('handles different font properties', () => {
    const { rerender } = render(<Switch className="font-bold" />);
    expect(screen.getByRole('switch')).toHaveClass('font-bold');
    
    rerender(<Switch className="font-semibold" />);
    expect(screen.getByRole('switch')).toHaveClass('font-semibold');
    
    rerender(<Switch className="font-normal" />);
    expect(screen.getByRole('switch')).toHaveClass('font-normal');
  });

  it('handles different line height properties', () => {
    const { rerender } = render(<Switch className="leading-tight" />);
    expect(screen.getByRole('switch')).toHaveClass('leading-tight');
    
    rerender(<Switch className="leading-normal" />);
    expect(screen.getByRole('switch')).toHaveClass('leading-normal');
    
    rerender(<Switch className="leading-loose" />);
    expect(screen.getByRole('switch')).toHaveClass('leading-loose');
  });

  it('handles different letter spacing properties', () => {
    const { rerender } = render(<Switch className="tracking-tight" />);
    expect(screen.getByRole('switch')).toHaveClass('tracking-tight');
    
    rerender(<Switch className="tracking-normal" />);
    expect(screen.getByRole('switch')).toHaveClass('tracking-normal');
    
    rerender(<Switch className="tracking-wide" />);
    expect(screen.getByRole('switch')).toHaveClass('tracking-wide');
  });

  it('handles different word spacing properties', () => {
    const { rerender } = render(<Switch className="word-spacing-tight" />);
    expect(screen.getByRole('switch')).toHaveClass('word-spacing-tight');
    
    rerender(<Switch className="word-spacing-normal" />);
    expect(screen.getByRole('switch')).toHaveClass('word-spacing-normal');
    
    rerender(<Switch className="word-spacing-wide" />);
    expect(screen.getByRole('switch')).toHaveClass('word-spacing-wide');
  });
});
