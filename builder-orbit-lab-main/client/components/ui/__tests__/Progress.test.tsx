import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test-utils';
import { Progress } from '../progress';

describe('Progress Component', () => {
  it('renders progress bar with default value', () => {
    render(<Progress value={50} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
  });

  it('renders progress bar with different values', () => {
    const { rerender } = render(<Progress value={0} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    
    rerender(<Progress value={25} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
    
    rerender(<Progress value={75} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
    
    rerender(<Progress value={100} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('renders progress bar with custom className', () => {
    render(<Progress value={50} className="custom-progress" />);
    
    expect(screen.getByRole('progressbar')).toHaveClass('custom-progress');
  });

  it('renders progress bar with different sizes', () => {
    const { rerender } = render(<Progress value={50} className="h-2" />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-2');
    
    rerender(<Progress value={50} className="h-4" />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-4');
    
    rerender(<Progress value={50} className="h-6" />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-6');
  });

  it('renders progress bar with different colors', () => {
    const { rerender } = render(<Progress value={50} className="bg-blue-500" />);
    expect(screen.getByRole('progressbar')).toHaveClass('bg-blue-500');
    
    rerender(<Progress value={50} className="bg-green-500" />);
    expect(screen.getByRole('progressbar')).toHaveClass('bg-green-500');
    
    rerender(<Progress value={50} className="bg-red-500" />);
    expect(screen.getByRole('progressbar')).toHaveClass('bg-red-500');
  });

  it('renders progress bar with different shapes', () => {
    const { rerender } = render(<Progress value={50} className="rounded-full" />);
    expect(screen.getByRole('progressbar')).toHaveClass('rounded-full');
    
    rerender(<Progress value={50} className="rounded-lg" />);
    expect(screen.getByRole('progressbar')).toHaveClass('rounded-lg');
    
    rerender(<Progress value={50} className="rounded-none" />);
    expect(screen.getByRole('progressbar')).toHaveClass('rounded-none');
  });

  it('renders progress bar with different animations', () => {
    const { rerender } = render(<Progress value={50} className="animate-pulse" />);
    expect(screen.getByRole('progressbar')).toHaveClass('animate-pulse');
    
    rerender(<Progress value={50} className="animate-bounce" />);
    expect(screen.getByRole('progressbar')).toHaveClass('animate-bounce');
    
    rerender(<Progress value={50} className="animate-spin" />);
    expect(screen.getByRole('progressbar')).toHaveClass('animate-spin');
  });

  it('renders progress bar with different shadows', () => {
    const { rerender } = render(<Progress value={50} className="shadow-sm" />);
    expect(screen.getByRole('progressbar')).toHaveClass('shadow-sm');
    
    rerender(<Progress value={50} className="shadow-md" />);
    expect(screen.getByRole('progressbar')).toHaveClass('shadow-md');
    
    rerender(<Progress value={50} className="shadow-lg" />);
    expect(screen.getByRole('progressbar')).toHaveClass('shadow-lg');
  });

  it('renders progress bar with different borders', () => {
    const { rerender } = render(<Progress value={50} className="border" />);
    expect(screen.getByRole('progressbar')).toHaveClass('border');
    
    rerender(<Progress value={50} className="border-2" />);
    expect(screen.getByRole('progressbar')).toHaveClass('border-2');
    
    rerender(<Progress value={50} className="border-4" />);
    expect(screen.getByRole('progressbar')).toHaveClass('border-4');
  });

  it('renders progress bar with different opacity', () => {
    const { rerender } = render(<Progress value={50} className="opacity-50" />);
    expect(screen.getByRole('progressbar')).toHaveClass('opacity-50');
    
    rerender(<Progress value={50} className="opacity-75" />);
    expect(screen.getByRole('progressbar')).toHaveClass('opacity-75');
    
    rerender(<Progress value={50} className="opacity-100" />);
    expect(screen.getByRole('progressbar')).toHaveClass('opacity-100');
  });

  it('renders progress bar with different transforms', () => {
    const { rerender } = render(<Progress value={50} className="scale-105" />);
    expect(screen.getByRole('progressbar')).toHaveClass('scale-105');
    
    rerender(<Progress value={50} className="scale-110" />);
    expect(screen.getByRole('progressbar')).toHaveClass('scale-110');
    
    rerender(<Progress value={50} className="scale-95" />);
    expect(screen.getByRole('progressbar')).toHaveClass('scale-95');
  });

  it('renders progress bar with different positioning', () => {
    const { rerender } = render(<Progress value={50} className="relative" />);
    expect(screen.getByRole('progressbar')).toHaveClass('relative');
    
    rerender(<Progress value={50} className="absolute" />);
    expect(screen.getByRole('progressbar')).toHaveClass('absolute');
    
    rerender(<Progress value={50} className="fixed" />);
    expect(screen.getByRole('progressbar')).toHaveClass('fixed');
  });

  it('renders progress bar with different z-index', () => {
    const { rerender } = render(<Progress value={50} className="z-10" />);
    expect(screen.getByRole('progressbar')).toHaveClass('z-10');
    
    rerender(<Progress value={50} className="z-20" />);
    expect(screen.getByRole('progressbar')).toHaveClass('z-20');
    
    rerender(<Progress value={50} className="z-30" />);
    expect(screen.getByRole('progressbar')).toHaveClass('z-30');
  });

  it('renders progress bar with different margins', () => {
    const { rerender } = render(<Progress value={50} className="m-2" />);
    expect(screen.getByRole('progressbar')).toHaveClass('m-2');
    
    rerender(<Progress value={50} className="m-4" />);
    expect(screen.getByRole('progressbar')).toHaveClass('m-4');
    
    rerender(<Progress value={50} className="m-6" />);
    expect(screen.getByRole('progressbar')).toHaveClass('m-6');
  });

  it('renders progress bar with different padding', () => {
    const { rerender } = render(<Progress value={50} className="p-2" />);
    expect(screen.getByRole('progressbar')).toHaveClass('p-2');
    
    rerender(<Progress value={50} className="p-4" />);
    expect(screen.getByRole('progressbar')).toHaveClass('p-4');
    
    rerender(<Progress value={50} className="p-6" />);
    expect(screen.getByRole('progressbar')).toHaveClass('p-6');
  });

  it('renders progress bar with different widths', () => {
    const { rerender } = render(<Progress value={50} className="w-32" />);
    expect(screen.getByRole('progressbar')).toHaveClass('w-32');
    
    rerender(<Progress value={50} className="w-48" />);
    expect(screen.getByRole('progressbar')).toHaveClass('w-48');
    
    rerender(<Progress value={50} className="w-64" />);
    expect(screen.getByRole('progressbar')).toHaveClass('w-64');
  });

  it('renders progress bar with different heights', () => {
    const { rerender } = render(<Progress value={50} className="h-2" />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-2');
    
    rerender(<Progress value={50} className="h-4" />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-4');
    
    rerender(<Progress value={50} className="h-6" />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-6');
  });

  it('renders progress bar with different flex properties', () => {
    const { rerender } = render(<Progress value={50} className="flex-1" />);
    expect(screen.getByRole('progressbar')).toHaveClass('flex-1');
    
    rerender(<Progress value={50} className="flex-grow" />);
    expect(screen.getByRole('progressbar')).toHaveClass('flex-grow');
    
    rerender(<Progress value={50} className="flex-shrink" />);
    expect(screen.getByRole('progressbar')).toHaveClass('flex-shrink');
  });

  it('renders progress bar with different grid properties', () => {
    const { rerender } = render(<Progress value={50} className="col-span-1" />);
    expect(screen.getByRole('progressbar')).toHaveClass('col-span-1');
    
    rerender(<Progress value={50} className="col-span-2" />);
    expect(screen.getByRole('progressbar')).toHaveClass('col-span-2');
    
    rerender(<Progress value={50} className="col-span-3" />);
    expect(screen.getByRole('progressbar')).toHaveClass('col-span-3');
  });

  it('renders progress bar with different display properties', () => {
    const { rerender } = render(<Progress value={50} className="block" />);
    expect(screen.getByRole('progressbar')).toHaveClass('block');
    
    rerender(<Progress value={50} className="inline-block" />);
    expect(screen.getByRole('progressbar')).toHaveClass('inline-block');
    
    rerender(<Progress value={50} className="flex" />);
    expect(screen.getByRole('progressbar')).toHaveClass('flex');
  });

  it('renders progress bar with different overflow properties', () => {
    const { rerender } = render(<Progress value={50} className="overflow-hidden" />);
    expect(screen.getByRole('progressbar')).toHaveClass('overflow-hidden');
    
    rerender(<Progress value={50} className="overflow-visible" />);
    expect(screen.getByRole('progressbar')).toHaveClass('overflow-visible');
    
    rerender(<Progress value={50} className="overflow-scroll" />);
    expect(screen.getByRole('progressbar')).toHaveClass('overflow-scroll');
  });

  it('renders progress bar with different text properties', () => {
    const { rerender } = render(<Progress value={50} className="text-center" />);
    expect(screen.getByRole('progressbar')).toHaveClass('text-center');
    
    rerender(<Progress value={50} className="text-left" />);
    expect(screen.getByRole('progressbar')).toHaveClass('text-left');
    
    rerender(<Progress value={50} className="text-right" />);
    expect(screen.getByRole('progressbar')).toHaveClass('text-right');
  });

  it('renders progress bar with different font properties', () => {
    const { rerender } = render(<Progress value={50} className="font-bold" />);
    expect(screen.getByRole('progressbar')).toHaveClass('font-bold');
    
    rerender(<Progress value={50} className="font-semibold" />);
    expect(screen.getByRole('progressbar')).toHaveClass('font-semibold');
    
    rerender(<Progress value={50} className="font-normal" />);
    expect(screen.getByRole('progressbar')).toHaveClass('font-normal');
  });

  it('renders progress bar with different line height properties', () => {
    const { rerender } = render(<Progress value={50} className="leading-tight" />);
    expect(screen.getByRole('progressbar')).toHaveClass('leading-tight');
    
    rerender(<Progress value={50} className="leading-normal" />);
    expect(screen.getByRole('progressbar')).toHaveClass('leading-normal');
    
    rerender(<Progress value={50} className="leading-loose" />);
    expect(screen.getByRole('progressbar')).toHaveClass('leading-loose');
  });

  it('renders progress bar with different letter spacing properties', () => {
    const { rerender } = render(<Progress value={50} className="tracking-tight" />);
    expect(screen.getByRole('progressbar')).toHaveClass('tracking-tight');
    
    rerender(<Progress value={50} className="tracking-normal" />);
    expect(screen.getByRole('progressbar')).toHaveClass('tracking-normal');
    
    rerender(<Progress value={50} className="tracking-wide" />);
    expect(screen.getByRole('progressbar')).toHaveClass('tracking-wide');
  });

  it('renders progress bar with different word spacing properties', () => {
    const { rerender } = render(<Progress value={50} className="word-spacing-tight" />);
    expect(screen.getByRole('progressbar')).toHaveClass('word-spacing-tight');
    
    rerender(<Progress value={50} className="word-spacing-normal" />);
    expect(screen.getByRole('progressbar')).toHaveClass('word-spacing-normal');
    
    rerender(<Progress value={50} className="word-spacing-wide" />);
    expect(screen.getByRole('progressbar')).toHaveClass('word-spacing-wide');
  });
});
