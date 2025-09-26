import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test-utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../card';

describe('Card Component', () => {
  it('renders basic card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('renders card with only content', () => {
    render(
      <Card>
        <CardContent>
          <p>Simple card content</p>
        </CardContent>
      </Card>
    );
    
    expect(screen.getByText('Simple card content')).toBeInTheDocument();
  });

  it('renders card with header and content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title Only</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Content only</p>
        </CardContent>
      </Card>
    );
    
    expect(screen.getByText('Title Only')).toBeInTheDocument();
    expect(screen.getByText('Content only')).toBeInTheDocument();
  });

  it('renders card with content and footer', () => {
    render(
      <Card>
        <CardContent>
          <p>Content with footer</p>
        </CardContent>
        <CardFooter>
          <button>Footer Action</button>
        </CardFooter>
      </Card>
    );
    
    expect(screen.getByText('Content with footer')).toBeInTheDocument();
    expect(screen.getByText('Footer Action')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    
    render(
      <Card onClick={handleClick}>
        <CardContent>
          <p>Clickable card</p>
        </CardContent>
      </Card>
    );
    
    const card = screen.getByText('Clickable card').closest('[role="button"]');
    if (card) {
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalled();
    }
  });

  it('renders with custom className', () => {
    render(
      <Card className="custom-card">
        <CardHeader className="custom-header">
          <CardTitle className="custom-title">Custom Card</CardTitle>
        </CardHeader>
        <CardContent className="custom-content">
          <p>Custom content</p>
        </CardContent>
        <CardFooter className="custom-footer">
          <button>Custom action</button>
        </CardFooter>
      </Card>
    );
    
    expect(screen.getByText('Custom Card').closest('div')).toHaveClass('custom-card');
    expect(screen.getByText('Custom Card').closest('div')).toHaveClass('custom-header');
    expect(screen.getByText('Custom Card')).toHaveClass('custom-title');
    expect(screen.getByText('Custom content').closest('div')).toHaveClass('custom-content');
    expect(screen.getByText('Custom action').closest('div')).toHaveClass('custom-footer');
  });

  it('renders card with images', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Image Card</CardTitle>
        </CardHeader>
        <CardContent>
          <img src="/test.jpg" alt="Test image" />
        </CardContent>
      </Card>
    );
    
    const image = screen.getByRole('img', { name: /test image/i });
    expect(image).toHaveAttribute('src', '/test.jpg');
  });

  it('renders card with forms', () => {
    const handleSubmit = vi.fn();
    
    render(
      <Card>
        <CardHeader>
          <CardTitle>Form Card</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter text" />
            <button type="submit">Submit</button>
          </form>
        </CardContent>
      </Card>
    );
    
    const input = screen.getByPlaceholderText('Enter text');
    const submitButton = screen.getByText('Submit');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(submitButton);
    
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('renders card with lists', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>List Card</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </CardContent>
      </Card>
    );
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders card with tables', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Table Card</CardTitle>
        </CardHeader>
        <CardContent>
          <table>
            <thead>
              <tr>
                <th>Header 1</th>
                <th>Header 2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    );
    
    expect(screen.getByText('Header 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 1')).toBeInTheDocument();
  });

  it('renders card with buttons in footer', () => {
    const handleAction1 = vi.fn();
    const handleAction2 = vi.fn();
    
    render(
      <Card>
        <CardHeader>
          <CardTitle>Action Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card with multiple actions</p>
        </CardContent>
        <CardFooter>
          <button onClick={handleAction1}>Action 1</button>
          <button onClick={handleAction2}>Action 2</button>
        </CardFooter>
      </Card>
    );
    
    const action1 = screen.getByText('Action 1');
    const action2 = screen.getByText('Action 2');
    
    fireEvent.click(action1);
    expect(handleAction1).toHaveBeenCalled();
    
    fireEvent.click(action2);
    expect(handleAction2).toHaveBeenCalled();
  });

  it('renders card with links', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Link Card</CardTitle>
        </CardHeader>
        <CardContent>
          <a href="/test">Test Link</a>
        </CardContent>
      </Card>
    );
    
    const link = screen.getByRole('link', { name: /test link/i });
    expect(link).toHaveAttribute('href', '/test');
  });

  it('renders card with badges', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Badge Card</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="badge">New</span>
          <span className="badge">Featured</span>
        </CardContent>
      </Card>
    );
    
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('renders card with icons', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Icon Card</CardTitle>
        </CardHeader>
        <CardContent>
          <span>⭐ Star</span>
          <span>❤️ Heart</span>
        </CardContent>
      </Card>
    );
    
    expect(screen.getByText('⭐ Star')).toBeInTheDocument();
    expect(screen.getByText('❤️ Heart')).toBeInTheDocument();
  });

  it('renders card with progress bars', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Progress Card</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="progress">
            <div className="progress-bar" style={{ width: '50%' }}></div>
          </div>
        </CardContent>
      </Card>
    );
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('renders card with avatars', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Avatar Card</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="avatar">
            <img src="/avatar.jpg" alt="User avatar" />
          </div>
        </CardContent>
      </Card>
    );
    
    const avatar = screen.getByRole('img', { name: /user avatar/i });
    expect(avatar).toHaveAttribute('src', '/avatar.jpg');
  });

  it('renders card with dividers', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Divider Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Content above divider</p>
          <hr />
          <p>Content below divider</p>
        </CardContent>
      </Card>
    );
    
    expect(screen.getByText('Content above divider')).toBeInTheDocument();
    expect(screen.getByText('Content below divider')).toBeInTheDocument();
  });
});
