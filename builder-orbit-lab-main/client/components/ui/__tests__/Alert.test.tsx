import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test-utils';
import { Alert, AlertDescription, AlertTitle } from '../alert';

describe('Alert Component', () => {
  it('renders basic alert', () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Alert description')).toBeInTheDocument();
  });

  it('renders alert with only description', () => {
    render(
      <Alert>
        <AlertDescription>Simple alert message</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Simple alert message')).toBeInTheDocument();
  });

  it('renders alert with only title', () => {
    render(
      <Alert>
        <AlertTitle>Title Only</AlertTitle>
      </Alert>
    );
    
    expect(screen.getByText('Title Only')).toBeInTheDocument();
  });

  it('renders different variants', () => {
    const { rerender } = render(
      <Alert variant="default">
        <AlertDescription>Default alert</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Default alert')).toHaveClass('bg-background');
    
    rerender(
      <Alert variant="destructive">
        <AlertDescription>Destructive alert</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Destructive alert')).toHaveClass('bg-destructive');
    
    rerender(
      <Alert variant="warning">
        <AlertDescription>Warning alert</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Warning alert')).toHaveClass('bg-yellow-50');
    
    rerender(
      <Alert variant="success">
        <AlertDescription>Success alert</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Success alert')).toHaveClass('bg-green-50');
  });

  it('renders with custom className', () => {
    render(
      <Alert className="custom-alert">
        <AlertTitle className="custom-title">Custom Alert</AlertTitle>
        <AlertDescription className="custom-description">Custom description</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Custom Alert')).toHaveClass('custom-title');
    expect(screen.getByText('Custom description')).toHaveClass('custom-description');
  });

  it('renders with icons', () => {
    render(
      <Alert>
        <AlertTitle>⚠️ Warning</AlertTitle>
        <AlertDescription>This is a warning message</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('⚠️ Warning')).toBeInTheDocument();
    expect(screen.getByText('This is a warning message')).toBeInTheDocument();
  });

  it('renders with different icon types', () => {
    const { rerender } = render(
      <Alert>
        <AlertTitle>✅ Success</AlertTitle>
        <AlertDescription>Operation completed successfully</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('✅ Success')).toBeInTheDocument();
    
    rerender(
      <Alert>
        <AlertTitle>❌ Error</AlertTitle>
        <AlertDescription>An error occurred</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('❌ Error')).toBeInTheDocument();
    
    rerender(
      <Alert>
        <AlertTitle>ℹ️ Info</AlertTitle>
        <AlertDescription>Information message</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('ℹ️ Info')).toBeInTheDocument();
  });

  it('renders with buttons', () => {
    render(
      <Alert>
        <AlertTitle>Action Required</AlertTitle>
        <AlertDescription>Please confirm your action</AlertDescription>
        <button>Confirm</button>
        <button>Cancel</button>
      </Alert>
    );
    
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders with links', () => {
    render(
      <Alert>
        <AlertTitle>Link Alert</AlertTitle>
        <AlertDescription>
          <a href="/help">Click here for help</a>
        </AlertDescription>
      </Alert>
    );
    
    const link = screen.getByRole('link', { name: /click here for help/i });
    expect(link).toHaveAttribute('href', '/help');
  });

  it('renders with lists', () => {
    render(
      <Alert>
        <AlertTitle>List Alert</AlertTitle>
        <AlertDescription>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders with code blocks', () => {
    render(
      <Alert>
        <AlertTitle>Code Alert</AlertTitle>
        <AlertDescription>
          <code>console.log('Hello World');</code>
        </AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText("console.log('Hello World');")).toBeInTheDocument();
  });

  it('renders with multiple paragraphs', () => {
    render(
      <Alert>
        <AlertTitle>Multi-paragraph Alert</AlertTitle>
        <AlertDescription>
          <p>First paragraph</p>
          <p>Second paragraph</p>
        </AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });

  it('renders with custom styling', () => {
    render(
      <Alert className="border-l-4 border-blue-500 bg-blue-50">
        <AlertTitle className="text-blue-800">Custom Styled Alert</AlertTitle>
        <AlertDescription className="text-blue-700">
          This alert has custom styling
        </AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Custom Styled Alert')).toHaveClass('text-blue-800');
    expect(screen.getByText('This alert has custom styling')).toHaveClass('text-blue-700');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <Alert className="p-2">
        <AlertDescription>Small alert</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Small alert')).toHaveClass('p-2');
    
    rerender(
      <Alert className="p-4">
        <AlertDescription>Medium alert</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Medium alert')).toHaveClass('p-4');
    
    rerender(
      <Alert className="p-6">
        <AlertDescription>Large alert</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Large alert')).toHaveClass('p-6');
  });

  it('renders with custom borders', () => {
    render(
      <Alert className="border-2 border-red-500">
        <AlertDescription>Bordered alert</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Bordered alert')).toHaveClass('border-2 border-red-500');
  });

  it('renders with custom shadows', () => {
    render(
      <Alert className="shadow-lg">
        <AlertDescription>Shadowed alert</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Shadowed alert')).toHaveClass('shadow-lg');
  });

  it('renders with custom animations', () => {
    render(
      <Alert className="animate-pulse">
        <AlertDescription>Animated alert</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Animated alert')).toHaveClass('animate-pulse');
  });

  it('renders with custom positioning', () => {
    render(
      <Alert className="fixed top-4 right-4">
        <AlertDescription>Positioned alert</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Positioned alert')).toHaveClass('fixed top-4 right-4');
  });

  it('renders with custom z-index', () => {
    render(
      <Alert className="z-50">
        <AlertDescription>High z-index alert</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('High z-index alert')).toHaveClass('z-50');
  });

  it('renders with custom opacity', () => {
    render(
      <Alert className="opacity-75">
        <AlertDescription>Semi-transparent alert</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Semi-transparent alert')).toHaveClass('opacity-75');
  });

  it('renders with custom transforms', () => {
    render(
      <Alert className="scale-105">
        <AlertDescription>Scaled alert</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Scaled alert')).toHaveClass('scale-105');
  });

  it('renders with custom hover effects', () => {
    render(
      <Alert className="hover:bg-gray-100 transition-colors">
        <AlertDescription>Hoverable alert</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Hoverable alert')).toHaveClass('hover:bg-gray-100 transition-colors');
  });

  it('renders with custom focus effects', () => {
    render(
      <Alert className="focus:ring-2 focus:ring-blue-500">
        <AlertDescription>Focusable alert</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Focusable alert')).toHaveClass('focus:ring-2 focus:ring-blue-500');
  });
});
