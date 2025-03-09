// src/__tests__/app/admin.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { useRouter, redirect } from 'next/navigation'
import AdminPage from '@/app/admin/page'

// Mock modules
jest.mock('next-auth/react')
jest.mock('next/navigation')

describe('Admin Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup fetch mock
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([
        {
          id: 'prompt-1',
          title: 'Pending Prompt 1',
          content: 'Test content',
          useCase: 'Marketing',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          user: { name: 'Test User' }
        }
      ])
    }) as jest.Mock;
  })

  it('redirects non-admin users', async () => {
    // Mock the redirect function
    const mockRedirect = jest.fn()
    ;(redirect as jest.Mock).mockImplementation(mockRedirect)
    
    // Mock regular user session
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: { role: 'USER' }
      },
      status: 'authenticated'
    })

    render(<AdminPage />)

    // Verify redirect happens
    await waitFor(() => {
      expect(mockRedirect).toHaveBeenCalledWith('/')
    })
  })

  it('shows pending prompts for admin users', async () => {
    // Mock admin user session
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: { role: 'ADMIN' }
      },
      status: 'authenticated'
    })

    render(<AdminPage />)

    // Use a more direct approach to check content
    await waitFor(() => {
      const headingElement = screen.getByText('Pending Prompts')
      expect(headingElement).toBeTruthy()
      
      const promptElement = screen.getByText('Pending Prompt 1')
      expect(promptElement).toBeTruthy()
    })
  })
})