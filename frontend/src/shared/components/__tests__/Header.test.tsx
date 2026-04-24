import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Header } from '../Header';
import { renderWithProviders } from '../../../test/utils';

const LocationDisplay = () => {
  const location = useLocation();

  return <div data-testid="location-display">{location.pathname}</div>;
};

describe('Header', () => {
  it('renders the main navigation links', () => {
    renderWithProviders(
      <>
        <Header />
        <LocationDisplay />
      </>,
    );

    expect(screen.getByRole('link', { name: 'Turismo Norte-Goiano' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Eventos' })).toHaveAttribute('href', '/eventos');
    expect(screen.getByRole('link', { name: 'Cidades' })).toHaveAttribute('href', '/cidades');
    expect(screen.getByRole('link', { name: 'Explorar eventos' })).toHaveAttribute('href', '/eventos');
  });

  it('supports basic navigation through the menu', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <Header />
        <LocationDisplay />
      </>,
    );

    await user.click(screen.getByRole('link', { name: 'Eventos' }));
    expect(screen.getByTestId('location-display')).toHaveTextContent('/eventos');

    await user.click(screen.getByRole('link', { name: 'Cidades' }));
    expect(screen.getByTestId('location-display')).toHaveTextContent('/cidades');

    await user.click(screen.getByRole('link', { name: 'Turismo Norte-Goiano' }));
    expect(screen.getByTestId('location-display')).toHaveTextContent('/');
  });
});

