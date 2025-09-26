import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test-utils';
import { Label } from '../label';

describe('Label Component', () => {
  it('renders label with text', () => {
    render(<Label>Test Label</Label>);
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<Label className="custom-label">Custom Label</Label>);
    
    expect(screen.getByText('Custom Label')).toHaveClass('custom-label');
  });

  it('handles htmlFor attribute', () => {
    render(<Label htmlFor="test-input">Label for input</Label>);
    
    expect(screen.getByText('Label for input')).toHaveAttribute('for', 'test-input');
  });
});
