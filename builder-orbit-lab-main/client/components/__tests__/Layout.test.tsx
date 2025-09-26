import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils';
import Layout from '../Layout';

// Mock useAuth hook
const mockAuth = {
  user: { id: '1', name: 'Test User', email: 'test@example.com' },
  isLoggedIn: true,
  isAdmin: false,
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
};

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockAuth,
}));

describe('Layout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders header with logo and navigation', () => {
    render(<Layout><div>Test Content</div></Layout>);
    
    expect(screen.getByText('Zeta')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /articles/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /documents/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /notes/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /search/i })).toBeInTheDocument();
  });

  it('renders user menu when logged in', () => {
    render(<Layout><div>Test Content</div></Layout>);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /account/i })).toBeInTheDocument();
  });

  it('renders login button when not logged in', () => {
    const mockAuthNotLoggedIn = {
      ...mockAuth,
      isLoggedIn: false,
      user: null,
    };
    
    vi.mocked(require('../../contexts/AuthContext').useAuth).mockReturnValue(mockAuthNotLoggedIn);
    
    render(<Layout><div>Test Content</div></Layout>);
    
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('handles mobile menu toggle', () => {
    render(<Layout><div>Test Content</div></Layout>);
    
    const mobileMenuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(mobileMenuButton);
    
    // Check if mobile menu is opened
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('handles user menu toggle', () => {
    render(<Layout><div>Test Content</div></Layout>);
    
    const userMenuButton = screen.getByRole('button', { name: /account/i });
    fireEvent.click(userMenuButton);
    
    // Check if user menu is opened
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });

  it('handles logout', () => {
    render(<Layout><div>Test Content</div></Layout>);
    
    const userMenuButton = screen.getByRole('button', { name: /account/i });
    fireEvent.click(userMenuButton);
    
    const logoutButton = screen.getByRole('button', { name: /sign out/i });
    fireEvent.click(logoutButton);
    
    expect(mockAuth.logout).toHaveBeenCalled();
  });

  it('renders footer', () => {
    render(<Layout><div>Test Content</div></Layout>);
    
    expect(screen.getByText(/© 2024 Zeta/i)).toBeInTheDocument();
    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy/i)).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(<Layout><div data-testid="test-content">Test Content</div></Layout>);
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('handles search form submission', () => {
    render(<Layout><div>Test Content</div></Layout>);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    fireEvent.click(searchButton);
    
    // Should navigate to search page
    expect(window.location.pathname).toBe('/search');
  });

  it('handles search on enter key', () => {
    render(<Layout><div>Test Content</div></Layout>);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    
    // Should navigate to search page
    expect(window.location.pathname).toBe('/search');
  });

  it('displays admin link for admin users', () => {
    const mockAuthAdmin = {
      ...mockAuth,
      isAdmin: true,
    };
    
    vi.mocked(require('../../contexts/AuthContext').useAuth).mockReturnValue(mockAuthAdmin);
    
    render(<Layout><div>Test Content</div></Layout>);
    
    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument();
  });

  it('handles loading state', () => {
    const mockAuthLoading = {
      ...mockAuth,
      loading: true,
    };
    
    vi.mocked(require('../../contexts/AuthContext').useAuth).mockReturnValue(mockAuthLoading);
    
    render(<Layout><div>Test Content</div></Layout>);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
