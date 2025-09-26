import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../dialog';

describe('Dialog Component', () => {
  it('renders dialog trigger', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <p>Dialog content</p>
        </DialogContent>
      </Dialog>
    );
    
    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });

  it('opens dialog when trigger is clicked', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <p>Dialog content</p>
        </DialogContent>
      </Dialog>
    );
    
    const trigger = screen.getByText('Open Dialog');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
      expect(screen.getByText('Dialog content')).toBeInTheDocument();
    });
  });

  it('closes dialog when escape key is pressed', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <p>Dialog content</p>
        </DialogContent>
      </Dialog>
    );
    
    const trigger = screen.getByText('Open Dialog');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    });
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
    });
  });

  it('closes dialog when clicking outside', async () => {
    render(
      <div>
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
            <p>Dialog content</p>
          </DialogContent>
        </Dialog>
      </div>
    );
    
    const trigger = screen.getByText('Open Dialog');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    });
    
    // Click on the overlay
    const overlay = screen.getByRole('dialog').parentElement;
    if (overlay) {
      fireEvent.click(overlay);
    }
    
    await waitFor(() => {
      expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
    });
  });

  it('handles controlled open state', async () => {
    const TestComponent = () => {
      const [open, setOpen] = React.useState(false);
      
      return (
        <div>
          <button onClick={() => setOpen(true)}>Open</button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
              </DialogHeader>
              <p>Dialog content</p>
              <button onClick={() => setOpen(false)}>Close</button>
            </DialogContent>
          </Dialog>
        </div>
      );
    };
    
    render(<TestComponent />);
    
    const openButton = screen.getByText('Open');
    fireEvent.click(openButton);
    
    await waitFor(() => {
      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
    });
  });

  it('renders with custom className', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent className="custom-dialog">
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <p>Dialog content</p>
        </DialogContent>
      </Dialog>
    );
    
    const trigger = screen.getByText('Open Dialog');
    fireEvent.click(trigger);
    
    expect(screen.getByRole('dialog')).toHaveClass('custom-dialog');
  });

  it('handles focus management', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <button>First Button</button>
          <button>Second Button</button>
        </DialogContent>
      </Dialog>
    );
    
    const trigger = screen.getByText('Open Dialog');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    });
    
    // First button should be focused
    expect(screen.getByText('First Button')).toHaveFocus();
  });

  it('handles multiple dialogs', async () => {
    render(
      <div>
        <Dialog>
          <DialogTrigger>Open Dialog 1</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog 1</DialogTitle>
            </DialogHeader>
            <p>Content 1</p>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>Open Dialog 2</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog 2</DialogTitle>
            </DialogHeader>
            <p>Content 2</p>
          </DialogContent>
        </Dialog>
      </div>
    );
    
    const trigger1 = screen.getByText('Open Dialog 1');
    const trigger2 = screen.getByText('Open Dialog 2');
    
    fireEvent.click(trigger1);
    
    await waitFor(() => {
      expect(screen.getByText('Dialog 1')).toBeInTheDocument();
    });
    
    fireEvent.click(trigger2);
    
    await waitFor(() => {
      expect(screen.getByText('Dialog 2')).toBeInTheDocument();
    });
  });

  it('handles dialog with form', async () => {
    const handleSubmit = vi.fn();
    
    render(
      <Dialog>
        <DialogTrigger>Open Form</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form Dialog</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter text" />
            <button type="submit">Submit</button>
          </form>
        </DialogContent>
      </Dialog>
    );
    
    const trigger = screen.getByText('Open Form');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Form Dialog')).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText('Enter text');
    const submitButton = screen.getByText('Submit');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(submitButton);
    
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('handles dialog with close button', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <p>Dialog content</p>
          <button>Close</button>
        </DialogContent>
      </Dialog>
    );
    
    const trigger = screen.getByText('Open Dialog');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
    });
  });
});
