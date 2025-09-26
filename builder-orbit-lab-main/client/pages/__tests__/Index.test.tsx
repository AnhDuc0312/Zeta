import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '../../test-utils';
import Index from '../Index';

describe('Index Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders home page with all sections', () => {
    render(<Index />);
    
    // Check main sections are present
    expect(screen.getByText('Welcome to Zeta')).toBeInTheDocument();
    expect(screen.getByText('Your Knowledge Hub')).toBeInTheDocument();
    expect(screen.getByText('Latest Articles')).toBeInTheDocument();
    expect(screen.getByText('Featured Documents')).toBeInTheDocument();
    expect(screen.getByText('Recent Notes')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Index />);
    
    // Check navigation links
    expect(screen.getByRole('link', { name: /articles/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /documents/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /notes/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /search/i })).toBeInTheDocument();
  });

  it('renders call-to-action buttons', () => {
    render(<Index />);
    
    // Check CTA buttons
    expect(screen.getByRole('link', { name: /explore articles/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse documents/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view notes/i })).toBeInTheDocument();
  });

  it('renders statistics section', () => {
    render(<Index />);
    
    // Check stats are displayed
    expect(screen.getByText(/articles/i)).toBeInTheDocument();
    expect(screen.getByText(/documents/i)).toBeInTheDocument();
    expect(screen.getByText(/notes/i)).toBeInTheDocument();
  });

  it('renders footer with links', () => {
    render(<Index />);
    
    // Check footer links
    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy/i)).toBeInTheDocument();
  });
});
