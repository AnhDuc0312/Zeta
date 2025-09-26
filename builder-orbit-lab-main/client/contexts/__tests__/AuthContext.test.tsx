import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../test-utils';
import { mockFetch } from '../../test-utils';
import { AuthProvider, useAuth } from '../AuthContext';

// Test component to access context
const TestComponent = () => {
  const { user, isLoggedIn, isAdmin, loading, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'No user'}</div>
      <div data-testid="isLoggedIn">{isLoggedIn ? 'true' : 'false'}</div>
      <div data-testid="isAdmin">{isAdmin ? 'true' : 'false'}</div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <button onClick={() => login({ id: '1', name: 'Test User', email: 'test@example.com' }, 'token')}>
        Login
      </button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('provides initial state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false');
    expect(screen.getByTestId('isAdmin')).toHaveTextContent('false');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('handles login', async () => {
    mockFetch({ success: true });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true');
    });
  });

  it('handles logout', async () => {
    mockFetch({ success: true });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // First login
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true');
    });
    
    // Then logout
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false');
    });
  });

  it('persists user data in localStorage', async () => {
    mockFetch({ success: true });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(localStorage.getItem('user')).toBeTruthy();
      expect(localStorage.getItem('token')).toBeTruthy();
    });
  });

  it('loads user data from localStorage on mount', () => {
    const userData = { id: '1', name: 'Test User', email: 'test@example.com' };
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', 'test-token');
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true');
  });

  it('handles admin user', async () => {
    const adminUser = { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' };
    mockFetch({ success: true });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('isAdmin')).toHaveTextContent('true');
    });
  });

  it('handles login error', async () => {
    mockFetch({ error: 'Invalid credentials' }, 401);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false');
    });
  });

  it('handles logout API call', async () => {
    mockFetch({ success: true });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // First login
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true');
    });
    
    // Then logout
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/logout',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  it('clears localStorage on logout', async () => {
    mockFetch({ success: true });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // First login
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true');
    });
    
    // Then logout
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
