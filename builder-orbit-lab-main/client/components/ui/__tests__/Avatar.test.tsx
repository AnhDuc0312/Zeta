import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test-utils';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';

describe('Avatar Component', () => {
  it('renders avatar with image', () => {
    render(
      <Avatar>
        <AvatarImage src="/avatar.jpg" alt="User avatar" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    );
    
    const image = screen.getByRole('img', { name: /user avatar/i });
    expect(image).toHaveAttribute('src', '/avatar.jpg');
  });

  it('renders avatar with fallback when image fails to load', () => {
    render(
      <Avatar>
        <AvatarImage src="/broken-image.jpg" alt="User avatar" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('renders avatar with fallback only', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders different sizes', () => {
    const { rerender } = render(
      <Avatar className="h-8 w-8">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('S')).toHaveClass('h-8 w-8');
    
    rerender(
      <Avatar className="h-12 w-12">
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('M')).toHaveClass('h-12 w-12');
    
    rerender(
      <Avatar className="h-16 w-16">
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('L')).toHaveClass('h-16 w-16');
  });

  it('renders with custom className', () => {
    render(
      <Avatar className="custom-avatar">
        <AvatarFallback>Custom</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('Custom')).toHaveClass('custom-avatar');
  });

  it('renders with different fallback text', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('renders with single character fallback', () => {
    render(
      <Avatar>
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders with emoji fallback', () => {
    render(
      <Avatar>
        <AvatarFallback>😀</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('😀')).toBeInTheDocument();
  });

  it('renders with icon fallback', () => {
    render(
      <Avatar>
        <AvatarFallback>
          <span>👤</span>
        </AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('👤')).toBeInTheDocument();
  });

  it('handles image loading states', () => {
    render(
      <Avatar>
        <AvatarImage src="/avatar.jpg" alt="User avatar" />
        <AvatarFallback>Loading...</AvatarFallback>
      </Avatar>
    );
    
    // Initially shows fallback
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with different shapes', () => {
    const { rerender } = render(
      <Avatar className="rounded-full">
        <AvatarFallback>R</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('R')).toHaveClass('rounded-full');
    
    rerender(
      <Avatar className="rounded-lg">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('S')).toHaveClass('rounded-lg');
    
    rerender(
      <Avatar className="rounded-none">
        <AvatarFallback>Q</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('Q')).toHaveClass('rounded-none');
  });

  it('renders with custom colors', () => {
    render(
      <Avatar className="bg-blue-500 text-white">
        <AvatarFallback>B</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('B')).toHaveClass('bg-blue-500 text-white');
  });

  it('renders with custom borders', () => {
    render(
      <Avatar className="border-2 border-gray-300">
        <AvatarFallback>B</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('B')).toHaveClass('border-2 border-gray-300');
  });

  it('renders with custom shadows', () => {
    render(
      <Avatar className="shadow-lg">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('S')).toHaveClass('shadow-lg');
  });

  it('renders with custom positioning', () => {
    render(
      <Avatar className="relative">
        <AvatarFallback>P</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('P')).toHaveClass('relative');
  });

  it('renders with custom z-index', () => {
    render(
      <Avatar className="z-10">
        <AvatarFallback>Z</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('Z')).toHaveClass('z-10');
  });

  it('renders with custom opacity', () => {
    render(
      <Avatar className="opacity-50">
        <AvatarFallback>O</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('O')).toHaveClass('opacity-50');
  });

  it('renders with custom transforms', () => {
    render(
      <Avatar className="scale-110">
        <AvatarFallback>T</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('T')).toHaveClass('scale-110');
  });

  it('renders with custom animations', () => {
    render(
      <Avatar className="animate-pulse">
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('A')).toHaveClass('animate-pulse');
  });

  it('renders with custom hover effects', () => {
    render(
      <Avatar className="hover:scale-105 transition-transform">
        <AvatarFallback>H</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('H')).toHaveClass('hover:scale-105 transition-transform');
  });

  it('renders with custom focus effects', () => {
    render(
      <Avatar className="focus:ring-2 focus:ring-blue-500">
        <AvatarFallback>F</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('F')).toHaveClass('focus:ring-2 focus:ring-blue-500');
  });

  it('renders with custom active effects', () => {
    render(
      <Avatar className="active:scale-95">
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('A')).toHaveClass('active:scale-95');
  });

  it('renders with custom disabled effects', () => {
    render(
      <Avatar className="disabled:opacity-50">
        <AvatarFallback>D</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getByText('D')).toHaveClass('disabled:opacity-50');
  });
});
