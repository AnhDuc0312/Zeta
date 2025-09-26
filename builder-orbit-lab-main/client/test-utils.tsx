import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { vi } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

// Mock window.matchMedia
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock scrollTo
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'scrollTo', {
    value: vi.fn(),
    writable: true,
  });
}

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock API responses
export const mockApiResponses = {
  articles: {
    data: [
      {
        id: '1',
        title: 'Test Article 1',
        description: 'Test description 1',
        content: '<p>Test content 1</p>',
        author_name: 'Test Author',
        category_name: 'Technology',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10,
        tags: ['test', 'article'],
        readTime: 5,
        date: '2024-01-01',
      },
      {
        id: '2',
        title: 'Test Article 2',
        description: 'Test description 2',
        content: '<p>Test content 2</p>',
        author_name: 'Test Author 2',
        category_name: 'Science',
        created_at: '2024-01-02T00:00:00Z',
        views: 200,
        likes: 20,
        tags: ['test', 'science'],
        readTime: 3,
        date: '2024-01-02',
      },
    ],
    total: 2,
    page: 1,
    limit: 12,
  },
  documents: {
    data: [
      {
        id: '1',
        title: 'Test Document 1',
        description: 'Test document description 1',
        file_url: '/files/test1.pdf',
        file_size: 1024000,
        author_name: 'Test Author',
        category_name: 'Technology',
        created_at: '2024-01-01T00:00:00Z',
        views: 50,
        likes: 5,
        tags: ['test', 'document'],
        type: 'PDF',
        size: '1.0 MB',
        date: '2024-01-01',
        downloads: 25,
        rating: 4,
        featured: false,
      },
    ],
    total: 1,
    page: 1,
    limit: 12,
  },
  notes: {
    data: [
      {
        id: '1',
        title: 'Test Note 1',
        content: 'Test note content 1',
        author_name: 'Test Author',
        category_name: 'Personal',
        created_at: '2024-01-01T00:00:00Z',
        views: 30,
        likes: 3,
        tags: ['test', 'note'],
        color: 'yellow',
        date: '2024-01-01',
        pinned: false,
        wordCount: 50,
      },
    ],
    total: 1,
    page: 1,
    limit: 12,
  },
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    bio: 'Test bio',
    location: 'Test Location',
    website: 'https://test.com',
  },
  stats: {
    articles: 5,
    documents: 3,
    notes: 2,
    totalViews: 1000,
  },
  favorites: {
    articles: [
      {
        id: '1',
        title: 'Favorite Article',
        description: 'Favorite article description',
        author_name: 'Test Author',
        category_name: 'Technology',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10,
        tags: ['favorite'],
        readTime: 5,
        date: '2024-01-01',
      },
    ],
    documents: [],
    notes: [],
  },
};

// Helper function to mock fetch responses
export const mockFetch = (response: any, status = 200) => {
  (global.fetch as any).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(response),
  });
};

// Helper function to mock fetch errors
export const mockFetchError = (message = 'Network error') => {
  (global.fetch as any).mockRejectedValueOnce(new Error(message));
};

// Helper function to clear all mocks
export const clearAllMocks = () => {
  vi.clearAllMocks();
  (global.fetch as any).mockClear();
};

export * from '@testing-library/react';
export { customRender as render };
