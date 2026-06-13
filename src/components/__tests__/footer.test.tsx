import { render, screen } from '@testing-library/react'
import { Footer } from '../footer'

describe('Footer Component', () => {
  it('renders the EcoPulse branding', () => {
    render(<Footer />)
    expect(screen.getByText('EcoPulse')).toBeInTheDocument()
  })
  
  it('renders the copyright text with current year', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear().toString()
    const copyrightElement = screen.getByText(new RegExp(`© ${currentYear} EcoPulse`, 'i'))
    expect(copyrightElement).toBeInTheDocument()
  })
  
  it('renders the company links', () => {
    render(<Footer />)
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Careers')).toBeInTheDocument()
    expect(screen.getByText('Press')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })
})
