import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHero } from './PageHero';

describe('PageHero', () => {
  test('renders the main heading', () => {
    render(<PageHero />);
    expect(screen.getByText('Echtzeit-Verkehrsübersicht')).toBeInTheDocument();
  });

  test('renders the description text', () => {
    render(<PageHero />);
    expect(screen.getByText(/Aktuelle Ereignisse/)).toBeInTheDocument();
  });
});
