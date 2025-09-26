import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test-utils';
import { Slider } from '../slider';

describe('Slider Component', () => {
  it('renders slider with default value', () => {
    render(<Slider defaultValue={[50]} />);
    
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-valuenow', '50');
  });

  it('renders slider with different values', () => {
    const { rerender } = render(<Slider defaultValue={[0]} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0');
    
    rerender(<Slider defaultValue={[25]} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '25');
    
    rerender(<Slider defaultValue={[75]} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '75');
    
    rerender(<Slider defaultValue={[100]} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '100');
  });

  it('handles value changes', () => {
    const handleValueChange = vi.fn();
    render(<Slider defaultValue={[50]} onValueChange={handleValueChange} />);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '75' } });
    
    expect(handleValueChange).toHaveBeenCalledWith([75]);
  });

  it('handles controlled state', () => {
    const TestComponent = () => {
      const [value, setValue] = React.useState([50]);
      
      return (
        <Slider 
          value={value} 
          onValueChange={setValue}
        />
      );
    };
    
    render(<TestComponent />);
    
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
    
    fireEvent.change(slider, { target: { value: '75' } });
    expect(slider).toHaveAttribute('aria-valuenow', '75');
  });

  it('handles disabled state', () => {
    render(<Slider defaultValue={[50]} disabled />);
    
    const slider = screen.getByRole('slider');
    expect(slider).toBeDisabled();
  });

  it('does not trigger onValueChange when disabled', () => {
    const handleValueChange = vi.fn();
    render(<Slider defaultValue={[50]} disabled onValueChange={handleValueChange} />);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '75' } });
    
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it('renders with custom className', () => {
    render(<Slider defaultValue={[50]} className="custom-slider" />);
    
    const slider = screen.getByRole('slider');
    expect(slider).toHaveClass('custom-slider');
  });

  it('handles keyboard navigation', () => {
    const handleValueChange = vi.fn();
    render(<Slider defaultValue={[50]} onValueChange={handleValueChange} />);
    
    const slider = screen.getByRole('slider');
    
    // Test arrow key navigation
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(handleValueChange).toHaveBeenCalledWith([51]);
    
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(handleValueChange).toHaveBeenCalledWith([50]);
  });

  it('handles focus events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(<Slider defaultValue={[50]} onFocus={handleFocus} onBlur={handleBlur} />);
    
    const slider = screen.getByRole('slider');
    
    fireEvent.focus(slider);
    expect(handleFocus).toHaveBeenCalled();
    
    fireEvent.blur(slider);
    expect(handleBlur).toHaveBeenCalled();
  });

  it('handles mouse events', () => {
    const handleMouseDown = vi.fn();
    const handleMouseUp = vi.fn();
    
    render(<Slider defaultValue={[50]} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} />);
    
    const slider = screen.getByRole('slider');
    
    fireEvent.mouseDown(slider);
    expect(handleMouseDown).toHaveBeenCalled();
    
    fireEvent.mouseUp(slider);
    expect(handleMouseUp).toHaveBeenCalled();
  });

  it('handles touch events', () => {
    const handleTouchStart = vi.fn();
    const handleTouchEnd = vi.fn();
    
    render(<Slider defaultValue={[50]} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} />);
    
    const slider = screen.getByRole('slider');
    
    fireEvent.touchStart(slider);
    expect(handleTouchStart).toHaveBeenCalled();
    
    fireEvent.touchEnd(slider);
    expect(handleTouchEnd).toHaveBeenCalled();
  });

  it('handles different sizes', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="h-2" />);
    expect(screen.getByRole('slider')).toHaveClass('h-2');
    
    rerender(<Slider defaultValue={[50]} className="h-4" />);
    expect(screen.getByRole('slider')).toHaveClass('h-4');
    
    rerender(<Slider defaultValue={[50]} className="h-6" />);
    expect(screen.getByRole('slider')).toHaveClass('h-6');
  });

  it('handles different colors', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="bg-blue-500" />);
    expect(screen.getByRole('slider')).toHaveClass('bg-blue-500');
    
    rerender(<Slider defaultValue={[50]} className="bg-green-500" />);
    expect(screen.getByRole('slider')).toHaveClass('bg-green-500');
    
    rerender(<Slider defaultValue={[50]} className="bg-red-500" />);
    expect(screen.getByRole('slider')).toHaveClass('bg-red-500');
  });

  it('handles different shapes', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="rounded-full" />);
    expect(screen.getByRole('slider')).toHaveClass('rounded-full');
    
    rerender(<Slider defaultValue={[50]} className="rounded-lg" />);
    expect(screen.getByRole('slider')).toHaveClass('rounded-lg');
    
    rerender(<Slider defaultValue={[50]} className="rounded-none" />);
    expect(screen.getByRole('slider')).toHaveClass('rounded-none');
  });

  it('handles different animations', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="transition-all" />);
    expect(screen.getByRole('slider')).toHaveClass('transition-all');
    
    rerender(<Slider defaultValue={[50]} className="animate-pulse" />);
    expect(screen.getByRole('slider')).toHaveClass('animate-pulse');
    
    rerender(<Slider defaultValue={[50]} className="animate-bounce" />);
    expect(screen.getByRole('slider')).toHaveClass('animate-bounce');
  });

  it('handles different shadows', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="shadow-sm" />);
    expect(screen.getByRole('slider')).toHaveClass('shadow-sm');
    
    rerender(<Slider defaultValue={[50]} className="shadow-md" />);
    expect(screen.getByRole('slider')).toHaveClass('shadow-md');
    
    rerender(<Slider defaultValue={[50]} className="shadow-lg" />);
    expect(screen.getByRole('slider')).toHaveClass('shadow-lg');
  });

  it('handles different borders', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="border" />);
    expect(screen.getByRole('slider')).toHaveClass('border');
    
    rerender(<Slider defaultValue={[50]} className="border-2" />);
    expect(screen.getByRole('slider')).toHaveClass('border-2');
    
    rerender(<Slider defaultValue={[50]} className="border-4" />);
    expect(screen.getByRole('slider')).toHaveClass('border-4');
  });

  it('handles different opacity', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="opacity-50" />);
    expect(screen.getByRole('slider')).toHaveClass('opacity-50');
    
    rerender(<Slider defaultValue={[50]} className="opacity-75" />);
    expect(screen.getByRole('slider')).toHaveClass('opacity-75');
    
    rerender(<Slider defaultValue={[50]} className="opacity-100" />);
    expect(screen.getByRole('slider')).toHaveClass('opacity-100');
  });

  it('handles different transforms', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="scale-105" />);
    expect(screen.getByRole('slider')).toHaveClass('scale-105');
    
    rerender(<Slider defaultValue={[50]} className="scale-110" />);
    expect(screen.getByRole('slider')).toHaveClass('scale-110');
    
    rerender(<Slider defaultValue={[50]} className="scale-95" />);
    expect(screen.getByRole('slider')).toHaveClass('scale-95');
  });

  it('handles different positioning', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="relative" />);
    expect(screen.getByRole('slider')).toHaveClass('relative');
    
    rerender(<Slider defaultValue={[50]} className="absolute" />);
    expect(screen.getByRole('slider')).toHaveClass('absolute');
    
    rerender(<Slider defaultValue={[50]} className="fixed" />);
    expect(screen.getByRole('slider')).toHaveClass('fixed');
  });

  it('handles different z-index', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="z-10" />);
    expect(screen.getByRole('slider')).toHaveClass('z-10');
    
    rerender(<Slider defaultValue={[50]} className="z-20" />);
    expect(screen.getByRole('slider')).toHaveClass('z-20');
    
    rerender(<Slider defaultValue={[50]} className="z-30" />);
    expect(screen.getByRole('slider')).toHaveClass('z-30');
  });

  it('handles different margins', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="m-2" />);
    expect(screen.getByRole('slider')).toHaveClass('m-2');
    
    rerender(<Slider defaultValue={[50]} className="m-4" />);
    expect(screen.getByRole('slider')).toHaveClass('m-4');
    
    rerender(<Slider defaultValue={[50]} className="m-6" />);
    expect(screen.getByRole('slider')).toHaveClass('m-6');
  });

  it('handles different padding', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="p-2" />);
    expect(screen.getByRole('slider')).toHaveClass('p-2');
    
    rerender(<Slider defaultValue={[50]} className="p-4" />);
    expect(screen.getByRole('slider')).toHaveClass('p-4');
    
    rerender(<Slider defaultValue={[50]} className="p-6" />);
    expect(screen.getByRole('slider')).toHaveClass('p-6');
  });

  it('handles different widths', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="w-32" />);
    expect(screen.getByRole('slider')).toHaveClass('w-32');
    
    rerender(<Slider defaultValue={[50]} className="w-48" />);
    expect(screen.getByRole('slider')).toHaveClass('w-48');
    
    rerender(<Slider defaultValue={[50]} className="w-64" />);
    expect(screen.getByRole('slider')).toHaveClass('w-64');
  });

  it('handles different heights', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="h-2" />);
    expect(screen.getByRole('slider')).toHaveClass('h-2');
    
    rerender(<Slider defaultValue={[50]} className="h-4" />);
    expect(screen.getByRole('slider')).toHaveClass('h-4');
    
    rerender(<Slider defaultValue={[50]} className="h-6" />);
    expect(screen.getByRole('slider')).toHaveClass('h-6');
  });

  it('handles different flex properties', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="flex-1" />);
    expect(screen.getByRole('slider')).toHaveClass('flex-1');
    
    rerender(<Slider defaultValue={[50]} className="flex-grow" />);
    expect(screen.getByRole('slider')).toHaveClass('flex-grow');
    
    rerender(<Slider defaultValue={[50]} className="flex-shrink" />);
    expect(screen.getByRole('slider')).toHaveClass('flex-shrink');
  });

  it('handles different grid properties', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="col-span-1" />);
    expect(screen.getByRole('slider')).toHaveClass('col-span-1');
    
    rerender(<Slider defaultValue={[50]} className="col-span-2" />);
    expect(screen.getByRole('slider')).toHaveClass('col-span-2');
    
    rerender(<Slider defaultValue={[50]} className="col-span-3" />);
    expect(screen.getByRole('slider')).toHaveClass('col-span-3');
  });

  it('handles different display properties', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="block" />);
    expect(screen.getByRole('slider')).toHaveClass('block');
    
    rerender(<Slider defaultValue={[50]} className="inline-block" />);
    expect(screen.getByRole('slider')).toHaveClass('inline-block');
    
    rerender(<Slider defaultValue={[50]} className="flex" />);
    expect(screen.getByRole('slider')).toHaveClass('flex');
  });

  it('handles different overflow properties', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="overflow-hidden" />);
    expect(screen.getByRole('slider')).toHaveClass('overflow-hidden');
    
    rerender(<Slider defaultValue={[50]} className="overflow-visible" />);
    expect(screen.getByRole('slider')).toHaveClass('overflow-visible');
    
    rerender(<Slider defaultValue={[50]} className="overflow-scroll" />);
    expect(screen.getByRole('slider')).toHaveClass('overflow-scroll');
  });

  it('handles different text properties', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="text-center" />);
    expect(screen.getByRole('slider')).toHaveClass('text-center');
    
    rerender(<Slider defaultValue={[50]} className="text-left" />);
    expect(screen.getByRole('slider')).toHaveClass('text-left');
    
    rerender(<Slider defaultValue={[50]} className="text-right" />);
    expect(screen.getByRole('slider')).toHaveClass('text-right');
  });

  it('handles different font properties', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="font-bold" />);
    expect(screen.getByRole('slider')).toHaveClass('font-bold');
    
    rerender(<Slider defaultValue={[50]} className="font-semibold" />);
    expect(screen.getByRole('slider')).toHaveClass('font-semibold');
    
    rerender(<Slider defaultValue={[50]} className="font-normal" />);
    expect(screen.getByRole('slider')).toHaveClass('font-normal');
  });

  it('handles different line height properties', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="leading-tight" />);
    expect(screen.getByRole('slider')).toHaveClass('leading-tight');
    
    rerender(<Slider defaultValue={[50]} className="leading-normal" />);
    expect(screen.getByRole('slider')).toHaveClass('leading-normal');
    
    rerender(<Slider defaultValue={[50]} className="leading-loose" />);
    expect(screen.getByRole('slider')).toHaveClass('leading-loose');
  });

  it('handles different letter spacing properties', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="tracking-tight" />);
    expect(screen.getByRole('slider')).toHaveClass('tracking-tight');
    
    rerender(<Slider defaultValue={[50]} className="tracking-normal" />);
    expect(screen.getByRole('slider')).toHaveClass('tracking-normal');
    
    rerender(<Slider defaultValue={[50]} className="tracking-wide" />);
    expect(screen.getByRole('slider')).toHaveClass('tracking-wide');
  });

  it('handles different word spacing properties', () => {
    const { rerender } = render(<Slider defaultValue={[50]} className="word-spacing-tight" />);
    expect(screen.getByRole('slider')).toHaveClass('word-spacing-tight');
    
    rerender(<Slider defaultValue={[50]} className="word-spacing-normal" />);
    expect(screen.getByRole('slider')).toHaveClass('word-spacing-normal');
    
    rerender(<Slider defaultValue={[50]} className="word-spacing-wide" />);
    expect(screen.getByRole('slider')).toHaveClass('word-spacing-wide');
  });
});
