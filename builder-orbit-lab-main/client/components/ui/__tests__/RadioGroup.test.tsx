import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test-utils';
import { RadioGroup, RadioGroupItem } from '../radio-group';

describe('RadioGroup Component', () => {
  it('renders radio group with items', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" />
        <RadioGroupItem value="option2" id="option2" />
        <RadioGroupItem value="option3" id="option3" />
      </RadioGroup>
    );
    
    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toBeInTheDocument();
    
    const radioItems = screen.getAllByRole('radio');
    expect(radioItems).toHaveLength(3);
  });

  it('handles value changes', () => {
    const handleValueChange = vi.fn();
    render(
      <RadioGroup onValueChange={handleValueChange}>
        <RadioGroupItem value="option1" id="option1" />
        <RadioGroupItem value="option2" id="option2" />
        <RadioGroupItem value="option3" id="option3" />
      </RadioGroup>
    );
    
    const radioItems = screen.getAllByRole('radio');
    fireEvent.click(radioItems[1]);
    
    expect(handleValueChange).toHaveBeenCalledWith('option2');
  });

  it('handles controlled state', () => {
    const TestComponent = () => {
      const [value, setValue] = React.useState('option1');
      
      return (
        <RadioGroup value={value} onValueChange={setValue}>
          <RadioGroupItem value="option1" id="option1" />
          <RadioGroupItem value="option2" id="option2" />
          <RadioGroupItem value="option3" id="option3" />
        </RadioGroup>
      );
    };
    
    render(<TestComponent />);
    
    const radioItems = screen.getAllByRole('radio');
    expect(radioItems[0]).toBeChecked();
    expect(radioItems[1]).not.toBeChecked();
    expect(radioItems[2]).not.toBeChecked();
    
    fireEvent.click(radioItems[1]);
    expect(radioItems[1]).toBeChecked();
    expect(radioItems[0]).not.toBeChecked();
    expect(radioItems[2]).not.toBeChecked();
  });

  it('handles disabled state', () => {
    render(
      <RadioGroup disabled>
        <RadioGroupItem value="option1" id="option1" />
        <RadioGroupItem value="option2" id="option2" />
        <RadioGroupItem value="option3" id="option3" />
      </RadioGroup>
    );
    
    const radioItems = screen.getAllByRole('radio');
    radioItems.forEach(item => {
      expect(item).toBeDisabled();
    });
  });

  it('handles individual disabled items', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" />
        <RadioGroupItem value="option2" id="option2" disabled />
        <RadioGroupItem value="option3" id="option3" />
      </RadioGroup>
    );
    
    const radioItems = screen.getAllByRole('radio');
    expect(radioItems[0]).not.toBeDisabled();
    expect(radioItems[1]).toBeDisabled();
    expect(radioItems[2]).not.toBeDisabled();
  });

  it('renders with custom className', () => {
    render(
      <RadioGroup className="custom-radio-group">
        <RadioGroupItem value="option1" id="option1" className="custom-radio-item" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    
    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toHaveClass('custom-radio-group');
    
    const radioItems = screen.getAllByRole('radio');
    expect(radioItems[0]).toHaveClass('custom-radio-item');
  });

  it('handles keyboard navigation', () => {
    const handleValueChange = vi.fn();
    render(
      <RadioGroup onValueChange={handleValueChange}>
        <RadioGroupItem value="option1" id="option1" />
        <RadioGroupItem value="option2" id="option2" />
        <RadioGroupItem value="option3" id="option3" />
      </RadioGroup>
    );
    
    const radioItems = screen.getAllByRole('radio');
    
    // Test arrow key navigation
    fireEvent.keyDown(radioItems[0], { key: 'ArrowDown' });
    expect(radioItems[1]).toHaveFocus();
    
    fireEvent.keyDown(radioItems[1], { key: 'ArrowDown' });
    expect(radioItems[2]).toHaveFocus();
    
    fireEvent.keyDown(radioItems[2], { key: 'ArrowUp' });
    expect(radioItems[1]).toHaveFocus();
  });

  it('handles focus events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(
      <RadioGroup onFocus={handleFocus} onBlur={handleBlur}>
        <RadioGroupItem value="option1" id="option1" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    
    const radioItems = screen.getAllByRole('radio');
    
    fireEvent.focus(radioItems[0]);
    expect(handleFocus).toHaveBeenCalled();
    
    fireEvent.blur(radioItems[0]);
    expect(handleBlur).toHaveBeenCalled();
  });

  it('handles mouse events', () => {
    const handleMouseDown = vi.fn();
    const handleMouseUp = vi.fn();
    
    render(
      <RadioGroup onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <RadioGroupItem value="option1" id="option1" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    
    const radioItems = screen.getAllByRole('radio');
    
    fireEvent.mouseDown(radioItems[0]);
    expect(handleMouseDown).toHaveBeenCalled();
    
    fireEvent.mouseUp(radioItems[0]);
    expect(handleMouseUp).toHaveBeenCalled();
  });

  it('handles touch events', () => {
    const handleTouchStart = vi.fn();
    const handleTouchEnd = vi.fn();
    
    render(
      <RadioGroup onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <RadioGroupItem value="option1" id="option1" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    
    const radioItems = screen.getAllByRole('radio');
    
    fireEvent.touchStart(radioItems[0]);
    expect(handleTouchStart).toHaveBeenCalled();
    
    fireEvent.touchEnd(radioItems[0]);
    expect(handleTouchEnd).toHaveBeenCalled();
  });

  it('handles different sizes', () => {
    const { rerender } = render(
      <RadioGroup className="space-y-2">
        <RadioGroupItem value="option1" id="option1" className="h-4 w-4" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('h-4 w-4');
    
    rerender(
      <RadioGroup className="space-y-2">
        <RadioGroupItem value="option1" id="option1" className="h-5 w-5" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('h-5 w-5');
    
    rerender(
      <RadioGroup className="space-y-2">
        <RadioGroupItem value="option1" id="option1" className="h-6 w-6" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('h-6 w-6');
  });

  it('handles different colors', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="text-blue-500" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('text-blue-500');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="text-green-500" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('text-green-500');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="text-red-500" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('text-red-500');
  });

  it('handles different shapes', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="rounded-full" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('rounded-full');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="rounded-lg" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('rounded-lg');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="rounded-none" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('rounded-none');
  });

  it('handles different animations', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="transition-all" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('transition-all');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="animate-pulse" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('animate-pulse');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="animate-bounce" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('animate-bounce');
  });

  it('handles different shadows', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="shadow-sm" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('shadow-sm');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="shadow-md" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('shadow-md');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="shadow-lg" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('shadow-lg');
  });

  it('handles different borders', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="border" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('border');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="border-2" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('border-2');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="border-4" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('border-4');
  });

  it('handles different opacity', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="opacity-50" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('opacity-50');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="opacity-75" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('opacity-75');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="opacity-100" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('opacity-100');
  });

  it('handles different transforms', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="scale-105" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('scale-105');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="scale-110" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('scale-110');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="scale-95" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('scale-95');
  });

  it('handles different positioning', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="relative" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('relative');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="absolute" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('absolute');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="fixed" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('fixed');
  });

  it('handles different z-index', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="z-10" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('z-10');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="z-20" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('z-20');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="z-30" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('z-30');
  });

  it('handles different margins', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="m-2" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('m-2');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="m-4" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('m-4');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="m-6" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('m-6');
  });

  it('handles different padding', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="p-2" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('p-2');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="p-4" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('p-4');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="p-6" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('p-6');
  });

  it('handles different widths', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="w-4" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('w-4');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="w-5" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('w-5');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="w-6" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('w-6');
  });

  it('handles different heights', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="h-4" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('h-4');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="h-5" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('h-5');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="h-6" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('h-6');
  });

  it('handles different flex properties', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="flex-1" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('flex-1');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="flex-grow" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('flex-grow');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="flex-shrink" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('flex-shrink');
  });

  it('handles different grid properties', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="col-span-1" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('col-span-1');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="col-span-2" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('col-span-2');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="col-span-3" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('col-span-3');
  });

  it('handles different display properties', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="block" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('block');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="inline-block" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('inline-block');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="flex" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('flex');
  });

  it('handles different overflow properties', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="overflow-hidden" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('overflow-hidden');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="overflow-visible" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('overflow-visible');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="overflow-scroll" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('overflow-scroll');
  });

  it('handles different text properties', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="text-center" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('text-center');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="text-left" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('text-left');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="text-right" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('text-right');
  });

  it('handles different font properties', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="font-bold" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('font-bold');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="font-semibold" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('font-semibold');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="font-normal" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('font-normal');
  });

  it('handles different line height properties', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="leading-tight" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('leading-tight');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="leading-normal" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('leading-normal');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="leading-loose" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('leading-loose');
  });

  it('handles different letter spacing properties', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="tracking-tight" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('tracking-tight');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="tracking-normal" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('tracking-normal');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="tracking-wide" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('tracking-wide');
  });

  it('handles different word spacing properties', () => {
    const { rerender } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="word-spacing-tight" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('word-spacing-tight');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="word-spacing-normal" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('word-spacing-normal');
    
    rerender(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" className="word-spacing-wide" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('word-spacing-wide');
  });
});
