import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import ImageUpload from '../components/ImageUpload';

// Mock fetch
global.fetch = vi.fn();

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            {component}
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('ImageUpload Component', () => {
  const mockOnImageUploaded = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    if (fetch && typeof (fetch as any).mockClear === 'function') {
      (fetch as any).mockClear();
    }
  });

  it('renders upload area when no image is uploaded', () => {
    renderWithProviders(
      <ImageUpload onImageUploaded={mockOnImageUploaded} />
    );

    expect(screen.getByText('Click to upload or drag and drop')).toBeInTheDocument();
    expect(screen.getByText('Choose file')).toBeInTheDocument();
  });

  it('renders uploaded image when currentImage is provided', () => {
    renderWithProviders(
      <ImageUpload 
        onImageUploaded={mockOnImageUploaded}
        currentImage="/test-image.jpg"
      />
    );

    const image = screen.getByAltText('Uploaded');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('shows file input when choose file is clicked', () => {
    renderWithProviders(
      <ImageUpload onImageUploaded={mockOnImageUploaded} />
    );

    const chooseFileButton = screen.getByText('Choose file');
    expect(chooseFileButton).toBeInTheDocument();
    
    // Check if file input exists
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });

  it('accepts correct file types', () => {
    renderWithProviders(
      <ImageUpload onImageUploaded={mockOnImageUploaded} />
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toHaveAttribute('accept', 'image/*');
  });

  it('handles file selection', async () => {
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

    renderWithProviders(
      <ImageUpload onImageUploaded={mockOnImageUploaded} />
    );

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simulate file selection
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });

    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);

    // Wait for upload to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockOnImageUploaded).toHaveBeenCalledWith('/uploads/test.webp', 'test.webp');
  });

  it('validates file type', async () => {
    renderWithProviders(
      <ImageUpload onImageUploaded={mockOnImageUploaded} />
    );

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simulate file selection
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });

    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);

    // Wait for validation
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockOnImageUploaded).not.toHaveBeenCalled();
  });

  it('handles upload error', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Upload failed'));

    renderWithProviders(
      <ImageUpload onImageUploaded={mockOnImageUploaded} />
    );

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simulate file selection
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });

    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);

    // Wait for upload to fail
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockOnImageUploaded).not.toHaveBeenCalled();
  });

  it('shows loading state during upload', async () => {
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

    renderWithProviders(
      <ImageUpload onImageUploaded={mockOnImageUploaded} />
    );

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simulate file selection
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });

    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);

    // Should show loading state
    expect(screen.getByText('Uploading and processing...')).toBeInTheDocument();
  });
});
