import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test-utils';
import { Skeleton } from '../skeleton';

describe('Skeleton Component', () => {
  it('renders basic skeleton', () => {
    render(<Skeleton />);
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders skeleton with custom className', () => {
    render(<Skeleton className="custom-skeleton" />);
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('custom-skeleton');
  });

  it('renders skeleton with different sizes', () => {
    const { rerender } = render(<Skeleton className="h-4 w-32" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('h-4 w-32');
    
    rerender(<Skeleton className="h-6 w-48" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('h-6 w-48');
    
    rerender(<Skeleton className="h-8 w-64" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('h-8 w-64');
  });

  it('renders skeleton with different shapes', () => {
    const { rerender } = render(<Skeleton className="rounded-full" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('rounded-full');
    
    rerender(<Skeleton className="rounded-lg" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('rounded-lg');
    
    rerender(<Skeleton className="rounded-none" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('rounded-none');
  });

  it('renders skeleton with different colors', () => {
    const { rerender } = render(<Skeleton className="bg-gray-200" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('bg-gray-200');
    
    rerender(<Skeleton className="bg-blue-200" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('bg-blue-200');
    
    rerender(<Skeleton className="bg-green-200" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('bg-green-200');
  });

  it('renders skeleton with different animations', () => {
    const { rerender } = render(<Skeleton className="animate-pulse" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse');
    
    rerender(<Skeleton className="animate-bounce" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('animate-bounce');
    
    rerender(<Skeleton className="animate-spin" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('animate-spin');
  });

  it('renders skeleton with different shadows', () => {
    const { rerender } = render(<Skeleton className="shadow-sm" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('shadow-sm');
    
    rerender(<Skeleton className="shadow-md" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('shadow-md');
    
    rerender(<Skeleton className="shadow-lg" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('shadow-lg');
  });

  it('renders skeleton with different borders', () => {
    const { rerender } = render(<Skeleton className="border" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('border');
    
    rerender(<Skeleton className="border-2" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('border-2');
    
    rerender(<Skeleton className="border-4" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('border-4');
  });

  it('renders skeleton with different opacity', () => {
    const { rerender } = render(<Skeleton className="opacity-50" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('opacity-50');
    
    rerender(<Skeleton className="opacity-75" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('opacity-75');
    
    rerender(<Skeleton className="opacity-100" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('opacity-100');
  });

  it('renders skeleton with different transforms', () => {
    const { rerender } = render(<Skeleton className="scale-105" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('scale-105');
    
    rerender(<Skeleton className="scale-110" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('scale-110');
    
    rerender(<Skeleton className="scale-95" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('scale-95');
  });

  it('renders skeleton with different positioning', () => {
    const { rerender } = render(<Skeleton className="relative" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('relative');
    
    rerender(<Skeleton className="absolute" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('absolute');
    
    rerender(<Skeleton className="fixed" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('fixed');
  });

  it('renders skeleton with different z-index', () => {
    const { rerender } = render(<Skeleton className="z-10" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('z-10');
    
    rerender(<Skeleton className="z-20" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('z-20');
    
    rerender(<Skeleton className="z-30" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('z-30');
  });

  it('renders skeleton with different margins', () => {
    const { rerender } = render(<Skeleton className="m-2" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('m-2');
    
    rerender(<Skeleton className="m-4" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('m-4');
    
    rerender(<Skeleton className="m-6" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('m-6');
  });

  it('renders skeleton with different padding', () => {
    const { rerender } = render(<Skeleton className="p-2" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('p-2');
    
    rerender(<Skeleton className="p-4" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('p-4');
    
    rerender(<Skeleton className="p-6" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('p-6');
  });

  it('renders skeleton with different widths', () => {
    const { rerender } = render(<Skeleton className="w-32" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('w-32');
    
    rerender(<Skeleton className="w-48" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('w-48');
    
    rerender(<Skeleton className="w-64" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('w-64');
  });

  it('renders skeleton with different heights', () => {
    const { rerender } = render(<Skeleton className="h-4" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('h-4');
    
    rerender(<Skeleton className="h-6" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('h-6');
    
    rerender(<Skeleton className="h-8" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('h-8');
  });

  it('renders skeleton with different flex properties', () => {
    const { rerender } = render(<Skeleton className="flex-1" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('flex-1');
    
    rerender(<Skeleton className="flex-grow" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('flex-grow');
    
    rerender(<Skeleton className="flex-shrink" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('flex-shrink');
  });

  it('renders skeleton with different grid properties', () => {
    const { rerender } = render(<Skeleton className="col-span-1" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('col-span-1');
    
    rerender(<Skeleton className="col-span-2" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('col-span-2');
    
    rerender(<Skeleton className="col-span-3" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('col-span-3');
  });

  it('renders skeleton with different display properties', () => {
    const { rerender } = render(<Skeleton className="block" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('block');
    
    rerender(<Skeleton className="inline-block" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('inline-block');
    
    rerender(<Skeleton className="flex" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('flex');
  });

  it('renders skeleton with different overflow properties', () => {
    const { rerender } = render(<Skeleton className="overflow-hidden" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('overflow-hidden');
    
    rerender(<Skeleton className="overflow-visible" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('overflow-visible');
    
    rerender(<Skeleton className="overflow-scroll" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('overflow-scroll');
  });

  it('renders skeleton with different text properties', () => {
    const { rerender } = render(<Skeleton className="text-center" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('text-center');
    
    rerender(<Skeleton className="text-left" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('text-left');
    
    rerender(<Skeleton className="text-right" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('text-right');
  });

  it('renders skeleton with different font properties', () => {
    const { rerender } = render(<Skeleton className="font-bold" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('font-bold');
    
    rerender(<Skeleton className="font-semibold" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('font-semibold');
    
    rerender(<Skeleton className="font-normal" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('font-normal');
  });

  it('renders skeleton with different line height properties', () => {
    const { rerender } = render(<Skeleton className="leading-tight" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('leading-tight');
    
    rerender(<Skeleton className="leading-normal" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('leading-normal');
    
    rerender(<Skeleton className="leading-loose" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('leading-loose');
  });

  it('renders skeleton with different letter spacing properties', () => {
    const { rerender } = render(<Skeleton className="tracking-tight" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('tracking-tight');
    
    rerender(<Skeleton className="tracking-normal" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('tracking-normal');
    
    rerender(<Skeleton className="tracking-wide" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('tracking-wide');
  });

  it('renders skeleton with different word spacing properties', () => {
    const { rerender } = render(<Skeleton className="word-spacing-tight" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('word-spacing-tight');
    
    rerender(<Skeleton className="word-spacing-normal" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('word-spacing-normal');
    
    rerender(<Skeleton className="word-spacing-wide" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('word-spacing-wide');
  });
});
