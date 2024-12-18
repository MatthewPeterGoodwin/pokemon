import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from './page';

jest.mock('./components/PokemonSearch', () => {
  return function MockPokemonSearch() {
    return <div data-testid="pokemon-search">PokemonSearch Component</div>;
  };
});

jest.mock('./components/PokemonGallery', () => {
  return function MockPokemonGallery() {
    return <div data-testid="pokemon-gallery">PokemonGallery Component</div>;
  };
});

jest.mock('./components/PokemonHeader', () => {
  return function MockPokemonGallery() {
    return <div data-testid="pokemon-header">PokemonHeader Component</div>;
  };
});

describe('Pokemon Home Page', () => {
  it('should render the page component', () => {
    render(<Page />);
    expect(screen.getByTestId('pokemon-header')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-search')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-gallery')).toBeInTheDocument();
  });

  it('should render components in correct order', () => {
    render(<Page />);

    const headerComponent = screen.getByTestId('pokemon-header');
    const searchComponent = screen.getByTestId('pokemon-search');
    const galleryComponent = screen.getByTestId('pokemon-gallery');
    
    expect(headerComponent.compareDocumentPosition(searchComponent))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    
    expect(searchComponent.compareDocumentPosition(galleryComponent))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('should display both components visibly', () => {
    render(<Page />);

    expect(screen.getByTestId('pokemon-search')).toBeVisible();
    expect(screen.getByTestId('pokemon-search')).toBeVisible();
    expect(screen.getByTestId('pokemon-gallery')).toBeVisible();
  });

  it('should match snapshot', () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});