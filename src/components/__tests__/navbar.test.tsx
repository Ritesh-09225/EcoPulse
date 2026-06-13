import { render, screen, waitFor } from '@testing-library/react'
import { Navbar } from '../navbar'
import { createClient } from '@/lib/supabase/client'

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}))

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders branding and public links', async () => {
    ;(createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
        onAuthStateChange: jest
          .fn()
          .mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
      },
    })

    render(<Navbar />)

    // Check branding
    expect(screen.getByText('EcoPulse')).toBeInTheDocument()

    // Check links
    expect(screen.getByText('Why It Matters')).toBeInTheDocument()
    expect(screen.getByText('How It Works')).toBeInTheDocument()

    // Check auth buttons when logged out (after loading finishes)
    await waitFor(() => {
      expect(screen.getByText('Get Started')).toBeInTheDocument()
    })
  })

  it('renders user menu when logged in', async () => {
    ;(createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { email: 'test@example.com', user_metadata: { full_name: 'Test User' } } },
          error: null,
        }),
        onAuthStateChange: jest
          .fn()
          .mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
      },
    })

    render(<Navbar />)

    await waitFor(() => {
      // The initials 'TU' should be in the fallback
      expect(screen.getByText('TU')).toBeInTheDocument()
    })
  })
})
