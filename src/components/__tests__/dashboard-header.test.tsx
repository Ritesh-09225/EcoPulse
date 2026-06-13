import { render, screen } from '@testing-library/react'
import { DashboardHeader } from '../dashboard-header'

// Mock the next-themes ModeToggle to simplify
jest.mock('@/components/ui/mode-toggle', () => ({
  ModeToggle: () => <div data-testid="mode-toggle" />
}))

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
      onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
      signOut: jest.fn()
    }
  })
}))

describe('DashboardHeader Component', () => {
  it('renders correctly', async () => {
    render(<DashboardHeader />)
    
    // Check if the menu toggle button is present
    expect(screen.getByText('Toggle navigation menu')).toBeInTheDocument()
    
    // Check if the mock ModeToggle is rendered
    expect(screen.getByTestId('mode-toggle')).toBeInTheDocument()
  })
})
