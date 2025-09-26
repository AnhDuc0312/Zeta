import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../test-utils';
import { mockApiResponses, mockFetch } from '../../test-utils';
import Account from '../Account';

// Mock useAuth hook
const mockAuth = {
  user: mockApiResponses.user,
  isLoggedIn: true,
  isAdmin: false,
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
};

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockAuth,
}));

describe('Account Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch(mockApiResponses.user);
    mockFetch(mockApiResponses.stats);
    mockFetch(mockApiResponses.favorites);
  });

  it('renders account page with user information', async () => {
    render(<Account />);
    
    await waitFor(() => {
      expect(screen.getByText('Account Settings')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });
  });

  it('displays profile information form', async () => {
    render(<Account />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/website/i)).toBeInTheDocument();
    });
  });

  it('handles profile form submission', async () => {
    mockFetch({ success: true });
    render(<Account />);
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
    
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/users/profile',
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('Updated Name'),
        })
      );
    });
  });

  it('handles change password', async () => {
    mockFetch({ success: true });
    render(<Account />);
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
    
    const changePasswordButton = screen.getByRole('button', { name: /change password/i });
    fireEvent.click(changePasswordButton);
    
    // Check if password dialog opens
    expect(screen.getByText(/change password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('handles password form submission', async () => {
    mockFetch({ success: true });
    render(<Account />);
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
    
    const changePasswordButton = screen.getByRole('button', { name: /change password/i });
    fireEvent.click(changePasswordButton);
    
    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(currentPasswordInput, { target: { value: 'current123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });
    
    const submitButton = screen.getByRole('button', { name: /update password/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/change-password',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('current123'),
        })
      );
    });
  });

  it('handles two-factor authentication button', async () => {
    render(<Account />);
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
    
    const twoFactorButton = screen.getByRole('button', { name: /two-factor authentication/i });
    fireEvent.click(twoFactorButton);
    
    // Check if coming soon dialog opens
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
    expect(screen.getByText(/two-factor authentication/i)).toBeInTheDocument();
  });

  it('displays user statistics', async () => {
    render(<Account />);
    
    await waitFor(() => {
      expect(screen.getByText('Your Stats')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument(); // articles count
      expect(screen.getByText('3')).toBeInTheDocument(); // documents count
      expect(screen.getByText('2')).toBeInTheDocument(); // notes count
      expect(screen.getByText('1,000')).toBeInTheDocument(); // total views
    });
  });

  it('displays user favorites', async () => {
    render(<Account />);
    
    await waitFor(() => {
      expect(screen.getByText('Your Favorites')).toBeInTheDocument();
      expect(screen.getByText('Articles')).toBeInTheDocument();
      expect(screen.getByText('Documents')).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();
    });
  });

  it('handles favorites tab switching', async () => {
    render(<Account />);
    
    await waitFor(() => {
      expect(screen.getByText('Your Favorites')).toBeInTheDocument();
    });
    
    const documentsTab = screen.getByRole('tab', { name: /documents/i });
    fireEvent.click(documentsTab);
    
    // Should show documents tab content
    expect(screen.getByText(/no documents found/i)).toBeInTheDocument();
  });

  it('displays favorite articles', async () => {
    render(<Account />);
    
    await waitFor(() => {
      expect(screen.getByText('Favorite Article')).toBeInTheDocument();
    });
  });

  it('handles logout', async () => {
    render(<Account />);
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
    
    const logoutButton = screen.getByRole('button', { name: /sign out/i });
    fireEvent.click(logoutButton);
    
    expect(mockAuth.logout).toHaveBeenCalled();
  });

  it('handles form validation', async () => {
    render(<Account />);
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
    
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: '' } });
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    
    // Should show validation error
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  });

  it('handles password validation', async () => {
    render(<Account />);
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
    
    const changePasswordButton = screen.getByRole('button', { name: /change password/i });
    fireEvent.click(changePasswordButton);
    
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(newPasswordInput, { target: { value: 'short' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different' } });
    
    const submitButton = screen.getByRole('button', { name: /update password/i });
    fireEvent.click(submitButton);
    
    // Should show validation errors
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('handles loading states', async () => {
    // Mock loading state
    mockFetch({}, 0); // Never resolves
    render(<Account />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles error states', async () => {
    mockFetch({}, 500);
    render(<Account />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load profile/i)).toBeInTheDocument();
    });
  });
});
