import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToastContext } from '../ToastContext';
import { ReactNode } from 'react';

// Test component that uses the context
const TestComponent = () => {
  const { toast, dismiss, toasts } = useToastContext();

  return (
    <div>
      <button onClick={() => toast({ title: 'Test Toast' })}>
        Add Toast
      </button>
      <button onClick={() => toast({ title: 'Success Toast', variant: 'success' })}>
        Add Success Toast
      </button>
      <button onClick={() => toast({ title: 'Error Toast', variant: 'destructive' })}>
        Add Error Toast
      </button>
      <div data-testid="toast-count">{toasts.length}</div>
      {toasts.map((t) => (
        <div key={t.id} data-testid={`toast-${t.id}`}>
          {t.title} - {t.variant}
          <button onClick={() => dismiss(t.id)}>Dismiss</button>
        </div>
      ))}
    </div>
  );
};

// Component that should throw error when used outside provider
const ComponentWithoutProvider = () => {
  useToastContext();
  return <div>Should not render</div>;
};

describe('ToastContext', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('provides toast context to children', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.getByText('Add Toast')).toBeInTheDocument();
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  it('allows adding toasts through context', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const addButton = screen.getByText('Add Toast');
    await user.click(addButton);

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByTestId(/toast-/)).toHaveTextContent('Test Toast - default');
  });

  it('supports different toast variants', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const successButton = screen.getByText('Add Success Toast');
    await user.click(successButton);

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByTestId(/toast-/)).toHaveTextContent('Success Toast - success');

    const errorButton = screen.getByText('Add Error Toast');
    await user.click(errorButton);

    expect(screen.getByTestId('toast-count')).toHaveTextContent('2');
    expect(screen.getByText('Error Toast - destructive')).toBeInTheDocument();
  });

  it('allows dismissing toasts through context', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const addButton = screen.getByText('Add Toast');
    await user.click(addButton);

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    const dismissButton = screen.getByText('Dismiss');
    await user.click(dismissButton);

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  it('auto-removes toasts after duration', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const addButton = screen.getByText('Add Toast');
    await user.click(addButton);

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
    });
  });

  it('handles multiple toasts correctly', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const addButton = screen.getByText('Add Toast');
    const successButton = screen.getByText('Add Success Toast');

    await user.click(addButton);
    await user.click(successButton);

    expect(screen.getByTestId('toast-count')).toHaveTextContent('2');
    expect(screen.getByText('Test Toast - default')).toBeInTheDocument();
    expect(screen.getByText('Success Toast - success')).toBeInTheDocument();
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<ComponentWithoutProvider />);
    }).toThrow('useToastContext must be used within a ToastProvider');

    consoleSpy.mockRestore();
  });

  it('maintains toast state across re-renders', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const addButton = screen.getByText('Add Toast');
    await user.click(addButton);

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    // Re-render the component
    rerender(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByText('Test Toast - default')).toBeInTheDocument();
  });

  it('cleans up timers on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('provides consistent API', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // The context should provide the same API as the hook
    expect(typeof useToastContext).toBe('function');
  });
});

