import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageUpload from '../ImageUpload';
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

describe('ImageUpload', () => {
  const mockOnImageUploaded = vi.fn();
  const mockOnImageRemoved = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockClear();
  });

  it('renders upload area when no image is uploaded', () => {
    renderWithToastProvider(
      <ImageUpload onImageUploaded={mockOnImageUploaded} />
    );

    expect(screen.getByText('Click to upload or drag and drop')).toBeInTheDocument();
    expect(screen.getByText('Choose file')).toBeInTheDocument();
  });

  it('renders uploaded image when currentImage is provided', () => {
    renderWithToastProvider(
      <ImageUpload 
        onImageUploaded={mockOnImageUploaded}
        currentImage="/test-image.jpg"
      />
    );

    const image = screen.getByAltText('Uploaded');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('handles file selection via input', async () => {
    const user = userEvent.setup();
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          filename: 'test.webp',
          url: '/uploads/test.webp',
          metadata: { width: 800, height: 600, size: 50000, format: 'webp' }
        }
      })
    });

    renderWithToastProvider(
      <ImageUpload onImageUploaded={mockOnImageUploaded} />
    );

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByRole('button', { name: /choose file/i });
    
    await user.click(input);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(mockOnImageUploaded).toHaveBeenCalledWith('/uploads/test.webp', 'test.webp');
    });
  });

  it('handles drag and drop', async () => {
    const user = userEvent.setup();
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          filename: 'test.webp',
          url: '/uploads/test.webp',
          metadata: { width: 800, height: 600, size: 50000, format: 'webp' }
        }
      })
    });

    renderWithToastProvider(
      <ImageUpload onImageUploaded={mockOnImageUploaded} />
    );

    const dropZone = screen.getByText('Click to upload or drag and drop').closest('div');
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    fireEvent.dragEnter(dropZone!);
    fireEvent.dragOver(dropZone!);
    fireEvent.drop(dropZone!, { dataTransfer: { files: [file] } });

    await waitFor(() => {
      expect(mockOnImageUploaded).toHaveBeenCalledWith('/uploads/test.webp', 'test.webp');
    });
  });

  it('validates file type', async () => {
    const user = userEvent.setup();

    renderWithToastProvider(
      <ImageUpload onImageUploaded={mockOnImageUploaded} />
    );

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button', { name: /choose file/i });
    
    await user.click(input);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.getByText('Invalid file type')).toBeInTheDocument();
    });

    expect(mockOnImageUploaded).not.toHaveBeenCalled();
  });

  it('validates file size', async () => {
    const user = userEvent.setup();

    renderWithToastProvider(
      <ImageUpload onImageUploaded={mockOnImageUploaded} maxSize={1} />
    );

    // Create a large file (2MB)
    const largeFile = new File(['x'.repeat(2 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    const input = screen.getByRole('button', { name: /choose file/i });
    
    await user.click(input);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, largeFile);

    await waitFor(() => {
      expect(screen.getByText('File too large')).toBeInTheDocument();
    });

    expect(mockOnImageUploaded).not.toHaveBeenCalled();
  });

  it('handles upload error', async () => {
    const user = userEvent.setup();
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: 'Upload failed'
      })
    });

    renderWithToastProvider(
      <ImageUpload onImageUploaded={mockOnImageUploaded} />
    );

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByRole('button', { name: /choose file/i });
    
    await user.click(input);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.getByText('Upload failed')).toBeInTheDocument();
    });

    expect(mockOnImageUploaded).not.toHaveBeenCalled();
  });

  it('shows loading state during upload', async () => {
    const user = userEvent.setup();
    (fetch as any).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            filename: 'test.webp',
            url: '/uploads/test.webp',
            metadata: { width: 800, height: 600, size: 50000, format: 'webp' }
          }
        })
      }), 100))
    );

    renderWithToastProvider(
      <ImageUpload onImageUploaded={mockOnImageUploaded} />
    );

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByRole('button', { name: /choose file/i });
    
    await user.click(input);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);

    expect(screen.getByText('Uploading and processing...')).toBeInTheDocument();
  });

  it('handles image removal', async () => {
    const user = userEvent.setup();

    renderWithToastProvider(
      <ImageUpload 
        onImageUploaded={mockOnImageUploaded}
        onImageRemoved={mockOnImageRemoved}
        currentImage="/test-image.jpg"
      />
    );

    const removeButton = screen.getByRole('button', { name: /remove/i });
    await user.click(removeButton);

    expect(mockOnImageRemoved).toHaveBeenCalled();
  });
});

