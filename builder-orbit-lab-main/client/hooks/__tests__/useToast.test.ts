import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../useToast';

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial empty toasts array', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toasts).toEqual([]);
    expect(typeof result.current.toast).toBe('function');
    expect(typeof result.current.dismiss).toBe('function');
  });

  it('adds toast when toast function is called', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'Test description'
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      title: 'Test Toast',
      description: 'Test description',
      variant: 'default',
      duration: 5000
    });
    expect(result.current.toasts[0].id).toBeDefined();
  });

  it('generates unique IDs for each toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Toast 1' });
      result.current.toast({ title: 'Toast 2' });
    });

    expect(result.current.toasts).toHaveLength(2);
    expect(result.current.toasts[0].id).not.toBe(result.current.toasts[1].id);
  });

  it('uses custom duration when provided', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Test Toast',
        duration: 3000
      });
    });

    expect(result.current.toasts[0].duration).toBe(3000);
  });

  it('uses default duration when not provided', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Test Toast'
      });
    });

    expect(result.current.toasts[0].duration).toBe(5000);
  });

  it('supports different variants', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Success', variant: 'success' });
      result.current.toast({ title: 'Error', variant: 'destructive' });
      result.current.toast({ title: 'Info', variant: 'default' });
    });

    expect(result.current.toasts[0].variant).toBe('success');
    expect(result.current.toasts[1].variant).toBe('destructive');
    expect(result.current.toasts[2].variant).toBe('default');
  });

  it('removes toast when dismiss is called', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Test Toast' });
    });

    expect(result.current.toasts).toHaveLength(1);
    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('auto-removes toast after duration', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Test Toast',
        duration: 2000
      });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('does not auto-remove toast with no duration', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Test Toast',
        duration: undefined
      });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.toasts).toHaveLength(1);
  });

  it('handles multiple toasts with different durations', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Quick Toast', duration: 1000 });
      result.current.toast({ title: 'Slow Toast', duration: 5000 });
    });

    expect(result.current.toasts).toHaveLength(2);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Slow Toast');

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('clears timers when component unmounts', () => {
    const { result, unmount } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Test Toast' });
    });

    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('returns toast ID for tracking', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;
    act(() => {
      toastId = result.current.toast({ title: 'Test Toast' });
    });

    expect(toastId!).toBeDefined();
    expect(typeof toastId!).toBe('string');
    expect(result.current.toasts[0].id).toBe(toastId);
  });

  it('handles rapid toast additions and removals', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      const id1 = result.current.toast({ title: 'Toast 1' });
      const id2 = result.current.toast({ title: 'Toast 2' });
      const id3 = result.current.toast({ title: 'Toast 3' });
      
      result.current.dismiss(id2);
    });

    expect(result.current.toasts).toHaveLength(2);
    expect(result.current.toasts.map(t => t.title)).toEqual(['Toast 1', 'Toast 3']);
  });

  it('maintains toast order when adding new toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'First' });
      result.current.toast({ title: 'Second' });
      result.current.toast({ title: 'Third' });
    });

    expect(result.current.toasts.map(t => t.title)).toEqual(['First', 'Second', 'Third']);
  });
});

