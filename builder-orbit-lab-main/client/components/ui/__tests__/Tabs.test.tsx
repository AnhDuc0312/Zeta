import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';

describe('Tabs Component', () => {
  it('renders tabs with triggers and content', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('switches content when tab is clicked', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    
    const tab2 = screen.getByText('Tab 2');
    fireEvent.click(tab2);
    
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('handles controlled value', () => {
    const TestComponent = () => {
      const [value, setValue] = React.useState('tab1');
      
      return (
        <Tabs value={value} onValueChange={setValue}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );
    };
    
    render(<TestComponent />);
    
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    
    const tab2 = screen.getByText('Tab 2');
    fireEvent.click(tab2);
    
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    );
    
    const tab1 = screen.getByText('Tab 1');
    const tab2 = screen.getByText('Tab 2');
    const tab3 = screen.getByText('Tab 3');
    
    // Test arrow key navigation
    fireEvent.keyDown(tab1, { key: 'ArrowRight' });
    expect(tab2).toHaveFocus();
    
    fireEvent.keyDown(tab2, { key: 'ArrowRight' });
    expect(tab3).toHaveFocus();
    
    fireEvent.keyDown(tab3, { key: 'ArrowLeft' });
    expect(tab2).toHaveFocus();
  });

  it('handles disabled tabs', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    
    const tab2 = screen.getByText('Tab 2');
    expect(tab2).toHaveAttribute('data-disabled', 'true');
    
    fireEvent.click(tab2);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList className="custom-tabs-list">
          <TabsTrigger value="tab1" className="custom-trigger">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-content">Content 1</TabsContent>
      </Tabs>
    );
    
    expect(screen.getByRole('tablist')).toHaveClass('custom-tabs-list');
    expect(screen.getByText('Tab 1')).toHaveClass('custom-trigger');
    expect(screen.getByText('Content 1')).toHaveClass('custom-content');
  });

  it('handles multiple tab groups', () => {
    render(
      <div>
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
        <Tabs defaultValue="tab3">
          <TabsList>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            <TabsTrigger value="tab4">Tab 4</TabsTrigger>
          </TabsList>
          <TabsContent value="tab3">Content 3</TabsContent>
          <TabsContent value="tab4">Content 4</TabsContent>
        </Tabs>
      </div>
    );
    
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 3')).toBeInTheDocument();
  });

  it('handles tab content with forms', () => {
    const handleSubmit = vi.fn();
    
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Form Tab</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter text" />
            <button type="submit">Submit</button>
          </form>
        </TabsContent>
      </Tabs>
    );
    
    const input = screen.getByPlaceholderText('Enter text');
    const submitButton = screen.getByText('Submit');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(submitButton);
    
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('handles tab content with buttons', () => {
    const handleClick = vi.fn();
    
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Button Tab</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <button onClick={handleClick}>Click me</button>
        </TabsContent>
      </Tabs>
    );
    
    const button = screen.getByText('Click me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalled();
  });

  it('handles tab content with links', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Link Tab</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <a href="/test">Test Link</a>
        </TabsContent>
      </Tabs>
    );
    
    const link = screen.getByRole('link', { name: /test link/i });
    expect(link).toHaveAttribute('href', '/test');
  });

  it('handles tab content with images', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Image Tab</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <img src="/test.jpg" alt="Test image" />
        </TabsContent>
      </Tabs>
    );
    
    const image = screen.getByRole('img', { name: /test image/i });
    expect(image).toHaveAttribute('src', '/test.jpg');
  });

  it('handles tab content with lists', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">List Tab</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </TabsContent>
      </Tabs>
    );
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('handles tab content with tables', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Table Tab</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
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
        </TabsContent>
      </Tabs>
    );
    
    expect(screen.getByText('Header 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 1')).toBeInTheDocument();
  });
});
