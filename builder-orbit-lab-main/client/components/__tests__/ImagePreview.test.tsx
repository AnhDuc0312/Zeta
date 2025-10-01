import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImagePreview from '../ImagePreview';

// Mock window.open
const mockOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockOpen,
  writable: true
});

describe('ImagePreview', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image'
  };

  it('renders image with correct src and alt', () => {
    render(<ImagePreview {...defaultProps} />);

    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('shows action buttons on hover', async () => {
    const user = userEvent.setup();
    render(<ImagePreview {...defaultProps} showActions={true} />);

    const image = screen.getByAltText('Test image');
    await user.hover(image);

    expect(screen.getByTitle('Zoom')).toBeInTheDocument();
    expect(screen.getByTitle('Download')).toBeInTheDocument();
    expect(screen.getByTitle('Open in new tab')).toBeInTheDocument();
  });

  it('opens dialog when image is clicked', async () => {
    const user = userEvent.setup();
    render(<ImagePreview {...defaultProps} />);

    const image = screen.getByAltText('Test image');
    await user.click(image);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test image')).toBeInTheDocument();
  });

  it('handles download action', async () => {
    const user = userEvent.setup();
    const mockClick = vi.fn();
    
    // Mock createElement and appendChild
    const mockLink = {
      href: '',
      download: '',
      click: mockClick
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);

    render(<ImagePreview {...defaultProps} showActions={true} />);

    const image = screen.getByAltText('Test image');
    await user.hover(image);

    const downloadButton = screen.getByTitle('Download');
    await user.click(downloadButton);

    expect(mockClick).toHaveBeenCalled();
  });

  it('handles open in new tab action', async () => {
    const user = userEvent.setup();
    render(<ImagePreview {...defaultProps} showActions={true} />);

    const image = screen.getByAltText('Test image');
    await user.hover(image);

    const newTabButton = screen.getByTitle('Open in new tab');
    await user.click(newTabButton);

    expect(mockOpen).toHaveBeenCalledWith('/test-image.jpg', '_blank');
  });

  it('handles remove action when onRemove is provided', async () => {
    const user = userEvent.setup();
    const mockOnRemove = vi.fn();

    render(
      <ImagePreview 
        {...defaultProps} 
        showActions={true} 
        onRemove={mockOnRemove} 
      />
    );

    const image = screen.getByAltText('Test image');
    await user.hover(image);

    const removeButton = screen.getByTitle('Remove');
    await user.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalled();
  });

  it('displays metadata when provided', () => {
    const metadata = {
      width: 800,
      height: 600,
      size: 50000,
      format: 'webp'
    };

    render(
      <ImagePreview 
        {...defaultProps} 
        metadata={metadata} 
      />
    );

    expect(screen.getByText('800 × 600 • 48.8 KB')).toBeInTheDocument();
  });

  it('displays metadata in dialog', async () => {
    const user = userEvent.setup();
    const metadata = {
      width: 800,
      height: 600,
      size: 50000,
      format: 'webp'
    };

    render(
      <ImagePreview 
        {...defaultProps} 
        metadata={metadata} 
      />
    );

    const image = screen.getByAltText('Test image');
    await user.click(image);

    expect(screen.getByText('800 × 600 pixels')).toBeInTheDocument();
    expect(screen.getByText('48.8 KB')).toBeInTheDocument();
    expect(screen.getByText('WEBP')).toBeInTheDocument();
  });

  it('closes dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ImagePreview {...defaultProps} />);

    const image = screen.getByAltText('Test image');
    await user.click(image);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <ImagePreview 
        {...defaultProps} 
        className="custom-class" 
      />
    );

    const container = screen.getByAltText('Test image').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('does not show action buttons when showActions is false', () => {
    render(
      <ImagePreview 
        {...defaultProps} 
        showActions={false} 
      />
    );

    const image = screen.getByAltText('Test image');
    fireEvent.mouseOver(image);

    expect(screen.queryByTitle('Zoom')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Download')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Open in new tab')).not.toBeInTheDocument();
  });
});

