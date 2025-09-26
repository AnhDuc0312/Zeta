import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test-utils';
import { Badge } from '../badge';

describe('Badge Component', () => {
  it('renders badge with text', () => {
    render(<Badge>Badge Text</Badge>);
    
    expect(screen.getByText('Badge Text')).toBeInTheDocument();
  });

  it('renders different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('bg-primary');
    
    rerender(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary');
    
    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText('Destructive')).toHaveClass('bg-destructive');
    
    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline')).toHaveClass('border');
  });

  it('renders different sizes', () => {
    const { rerender } = render(<Badge size="default">Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('h-6');
    
    rerender(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toHaveClass('h-5');
    
    rerender(<Badge size="lg">Large</Badge>);
    expect(screen.getByText('Large')).toHaveClass('h-7');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>);
    
    expect(screen.getByText('Custom')).toHaveClass('custom-badge');
  });

  it('renders with icons', () => {
    render(
      <Badge>
        <span>⭐</span>
        Star
      </Badge>
    );
    
    expect(screen.getByText('⭐')).toBeInTheDocument();
    expect(screen.getByText('Star')).toBeInTheDocument();
  });

  it('renders with numbers', () => {
    render(<Badge>42</Badge>);
    
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders with status indicators', () => {
    render(<Badge variant="destructive">Error</Badge>);
    
    expect(screen.getByText('Error')).toHaveClass('bg-destructive');
  });

  it('renders with success indicators', () => {
    render(<Badge variant="default">Success</Badge>);
    
    expect(screen.getByText('Success')).toHaveClass('bg-primary');
  });

  it('renders with warning indicators', () => {
    render(<Badge variant="secondary">Warning</Badge>);
    
    expect(screen.getByText('Warning')).toHaveClass('bg-secondary');
  });

  it('renders with info indicators', () => {
    render(<Badge variant="outline">Info</Badge>);
    
    expect(screen.getByText('Info')).toHaveClass('border');
  });

  it('renders with custom colors', () => {
    render(<Badge className="bg-blue-500 text-white">Blue</Badge>);
    
    expect(screen.getByText('Blue')).toHaveClass('bg-blue-500 text-white');
  });

  it('renders with custom styling', () => {
    render(<Badge className="rounded-full px-3 py-1">Rounded</Badge>);
    
    expect(screen.getByText('Rounded')).toHaveClass('rounded-full px-3 py-1');
  });

  it('renders with different content types', () => {
    render(
      <div>
        <Badge>Text Badge</Badge>
        <Badge>123</Badge>
        <Badge>⭐</Badge>
        <Badge>New</Badge>
      </div>
    );
    
    expect(screen.getByText('Text Badge')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('⭐')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders with accessibility attributes', () => {
    render(<Badge role="status" aria-label="Status badge">Active</Badge>);
    
    const badge = screen.getByText('Active');
    expect(badge).toHaveAttribute('role', 'status');
    expect(badge).toHaveAttribute('aria-label', 'Status badge');
  });

  it('renders with data attributes', () => {
    render(<Badge data-testid="test-badge">Test</Badge>);
    
    expect(screen.getByTestId('test-badge')).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    render(<Badge id="custom-badge" title="Custom badge">Custom</Badge>);
    
    const badge = screen.getByText('Custom');
    expect(badge).toHaveAttribute('id', 'custom-badge');
    expect(badge).toHaveAttribute('title', 'Custom badge');
  });
});
