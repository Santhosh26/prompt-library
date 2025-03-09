import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import Navigation from '@/components/Navigation'

// Mock the useSession hook
jest.mock('next-auth/react')

describe('Navigation Component', () => {
  it('renders sign in and sign up links when not authenticated', () => {
    // Mock unauthenticated session
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })

    render(<Navigation />)
    
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
  })

  it('renders profile and sign out when authenticated as regular user', () => {
    // Mock authenticated session for regular user
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
          role: 'USER',
        },
        expires: new Date().toISOString(),
      },
      status: 'authenticated',
    })

    render(<Navigation />)
    
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
    expect(screen.queryByText('Admin')).not.toBeInTheDocument()
  })

  it('renders admin link when authenticated as admin', () => {
    // Mock authenticated session for admin user
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'ADMIN',
        },
        expires: new Date().toISOString(),
      },
      status: 'authenticated',
    })

    render(<Navigation />)
    
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })
})