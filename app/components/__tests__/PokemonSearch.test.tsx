import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PokemonSearch from '../PokemonSearch'

// Mock fetch globally
global.fetch = jest.fn()

// Sample Pokemon data for testing
const mockPokemonData = {
  name: 'pikachu',
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    back_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png'
  },
  types: [
    {
      type: {
        name: 'electric'
      }
    }
  ],
  stats: [
    {
      base_stat: 55,
      stat: {
        name: 'hp'
      }
    },
    {
      base_stat: 90,
      stat: {
        name: 'speed'
      }
    }
  ],
  height: 4,
  weight: 60
}

describe('PokemonSearch', () => {
  beforeEach(() => {
    // Clear mock before each test
    jest.clearAllMocks()
  })

  it('renders the search form', () => {
    render(<PokemonSearch />)
    
    expect(screen.getByText('Pokemon Search')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter Pokemon name...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('handles input change correctly', async () => {
    render(<PokemonSearch />)
    
    const input = screen.getByPlaceholderText('Enter Pokemon name...')
    await userEvent.type(input, 'pikachu')
    
    expect(input).toHaveValue('pikachu')
  })

  it('disables search button when input is empty', () => {
    render(<PokemonSearch />)
    
    const button = screen.getByRole('button', { name: 'Search' })
    expect(button).toBeDisabled()
  })

  it('enables search button when input has value', async () => {
    render(<PokemonSearch />)
    
    const input = screen.getByPlaceholderText('Enter Pokemon name...')
    await userEvent.type(input, 'pikachu')
    
    const button = screen.getByRole('button', { name: 'Search' })
    expect(button).toBeEnabled()
  })

  it('successfully fetches and displays Pokemon data', async () => {
    // Mock successful API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemonData
    })

    render(<PokemonSearch />)
    
    const input = screen.getByPlaceholderText('Enter Pokemon name...')
    await userEvent.type(input, 'pikachu')
    
    const button = screen.getByRole('button', { name: 'Search' })
    fireEvent.click(button)

    // Verify loading state
    expect(screen.getByText('Searching...')).toBeInTheDocument()

    // Wait for and verify Pokemon data display
    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument()
      expect(screen.getByAltText('pikachu')).toBeInTheDocument()
      expect(screen.getByText('electric')).toBeInTheDocument()
      expect(screen.getByText('0.4m')).toBeInTheDocument()
      expect(screen.getByText('6.0kg')).toBeInTheDocument()
    })
  })

  it('handles API error correctly', async () => {
    // Mock failed API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    render(<PokemonSearch />)
    
    const input = screen.getByPlaceholderText('Enter Pokemon name...')
    await userEvent.type(input, 'invalidpokemon')
    
    const button = screen.getByRole('button', { name: 'Search' })
    fireEvent.click(button)

    // Wait for and verify error message
    await waitFor(() => {
      expect(screen.getByText('Pokemon "invalidpokemon" not found')).toBeInTheDocument()
    })
  })

  it('handles network error correctly', async () => {
    // Mock network error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<PokemonSearch />)
    
    const input = screen.getByPlaceholderText('Enter Pokemon name...')
    await userEvent.type(input, 'pikachu')
    
    const button = screen.getByRole('button', { name: 'Search' })
    fireEvent.click(button)

    // Wait for and verify error message
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('clears previous error when new search is initiated', async () => {
    // First, trigger an error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<PokemonSearch />)
    
    const input = screen.getByPlaceholderText('Enter Pokemon name...')
    await userEvent.type(input, 'pikachu')
    
    const button = screen.getByRole('button', { name: 'Search' })
    fireEvent.click(button)

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })

    // Clear input and type new value
    fireEvent.change(input, { target: { value: '' } })
    await userEvent.type(input, 'charizard')

    // Verify error is cleared
    expect(screen.queryByText('Network error')).not.toBeInTheDocument()
  })
})