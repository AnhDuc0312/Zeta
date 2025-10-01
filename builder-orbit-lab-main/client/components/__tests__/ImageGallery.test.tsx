import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageGallery from '../ImageGallery';
import { ToastProvider } from '../../contexts/ToastContext';

// Mock fetch
global.fetch = vi.fn();

const renderWithToastProvider = (component: React.ReactElement) => {
  return render(
    <ToastProvider>
      {component}
    </ToastProvider>
  );
};

describe('ImageGallery', () => {
  const mockImages = [
    {
      id: '1',
      url: '/image1.jpg',
      filename: 'image1.jpg',
      metadata: {
        width: 800,
        height: 600,
        size: 50000,
        format: 'webp'
      }
    },
    {
      id: '2',
      url: '/image2.jpg',
      filename: 'image2.jpg',
      metadata: {
        width: 1200,
        height: 800,
        size: 75000,
        format: 'webp'
      }
    }
  ];

  const defaultProps = {
    images: mockImages,
    onImagesChange: vi.fn(),
    maxImages: 10
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockClear();
  });

  it('renders images in grid layout by default', () => {
    renderWithToastProvider(<ImageGallery {...defaultProps} />);

    expect(screen.getByText('Images (2/10)')).toBeInTheDocument();
    expect(screen.getByAltText('image1.jpg')).toBeInTheDocument();
    expect(screen.getByAltText('image2.jpg')).toBeInTheDocument();
  });

  it('renders empty state when no images', () => {
    renderWithToastProvider(
      <ImageGallery 
        {...defaultProps} 
        images={[]} 
      />
    );

    expect(screen.getByText('No images yet')).toBeInTheDocument();
    expect(screen.getByText('Upload your first image to get started')).toBeInTheDocument();
  });

  it('switches between grid and list view', async () => {
    const user = userEvent.setup();
    renderWithToastProvider(<ImageGallery {...defaultProps} />);

    const listButton = screen.getByRole('button', { name: /list/i });
    await user.click(listButton);

    expect(listButton).toHaveClass('bg-white');
    expect(screen.getByRole('button', { name: /grid/i })).not.toHaveClass('bg-white');
  });

  it('shows upload area when add image is clicked', async () => {
    const user = userEvent.setup();
    renderWithToastProvider(<ImageGallery {...defaultProps} />);

    const addButton = screen.getByRole('button', { name: /add image/i });
    await user.click(addButton);

    expect(screen.getByText('Click to upload or drag and drop')).toBeInTheDocument();
  });

  it('handles image upload', async () => {
    const user = userEvent.setup();
    const mockOnImagesChange = vi.fn();
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          filename: 'new-image.webp',
          url: '/uploads/new-image.webp',
          metadata: { width: 800, height: 600, size: 50000, format: 'webp' }
        }
      })
    });

    renderWithToastProvider(
      <ImageGallery 
        {...defaultProps} 
        onImagesChange={mockOnImagesChange}
      />
    );

    const addButton = screen.getByRole('button', { name: /add image/i });
    await user.click(addButton);

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);

    await vi.waitFor(() => {
      expect(mockOnImagesChange).toHaveBeenCalledWith([
        ...mockImages,
        {
          id: expect.any(String),
          url: '/uploads/new-image.webp',
          filename: 'new-image.webp',
          metadata: { width: 800, height: 600, size: 50000, format: 'webp' }
        }
      ]);
    });
  });

  it('handles image removal', async () => {
    const user = userEvent.setup();
    const mockOnImagesChange = vi.fn();

    renderWithToastProvider(
      <ImageGallery 
        {...defaultProps} 
        onImagesChange={mockOnImagesChange}
      />
    );

    const image = screen.getByAltText('image1.jpg');
    fireEvent.mouseOver(image);

    const removeButton = screen.getByTitle('Remove');
    await user.click(removeButton);

    expect(mockOnImagesChange).toHaveBeenCalledWith([mockImages[1]]);
  });

  it('handles remove all action', async () => {
    const user = userEvent.setup();
    const mockOnImagesChange = vi.fn();

    renderWithToastProvider(
      <ImageGallery 
        {...defaultProps} 
        onImagesChange={mockOnImagesChange}
      />
    );

    const removeAllButton = screen.getByText('Remove all');
    await user.click(removeAllButton);

    expect(mockOnImagesChange).toHaveBeenCalledWith([]);
  });

  it('shows max images reached message', () => {
    const maxImages = 2;
    renderWithToastProvider(
      <ImageGallery 
        {...defaultProps} 
        maxImages={maxImages}
      />
    );

    expect(screen.getByText(`Maximum number of images reached (${maxImages})`)).toBeInTheDocument();
  });

  it('hides add button when max images reached', () => {
    const maxImages = 2;
    renderWithToastProvider(
      <ImageGallery 
        {...defaultProps} 
        maxImages={maxImages}
      />
    );

    expect(screen.queryByRole('button', { name: /add image/i })).not.toBeInTheDocument();
  });

  it('displays image metadata in list view', async () => {
    const user = userEvent.setup();
    renderWithToastProvider(<ImageGallery {...defaultProps} />);

    const listButton = screen.getByRole('button', { name: /list/i });
    await user.click(listButton);

    expect(screen.getByText('image1.jpg')).toBeInTheDocument();
    expect(screen.getByText('800 × 600 • 48.8 KB')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderWithToastProvider(
      <ImageGallery 
        {...defaultProps} 
        className="custom-class" 
      />
    );

    const container = screen.getByText('Images (2/10)').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('shows upload area when showUpload is true and under max limit', () => {
    renderWithToastProvider(
      <ImageGallery 
        {...defaultProps} 
        showUpload={true}
        images={[]}
      />
    );

    expect(screen.getByRole('button', { name: /add image/i })).toBeInTheDocument();
  });

  it('hides upload area when showUpload is false', () => {
    renderWithToastProvider(
      <ImageGallery 
        {...defaultProps} 
        showUpload={false}
        images={[]}
      />
    );

    expect(screen.queryByRole('button', { name: /add image/i })).not.toBeInTheDocument();
  });
});

