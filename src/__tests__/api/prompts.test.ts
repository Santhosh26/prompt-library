// src/__tests__/api/prompts.test.ts
import { getServerSession } from 'next-auth/next'

// Mock the modules we're using
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn()
}))

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockClient = {
    prompt: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'prompt-1',
          title: 'Test Prompt 1',
          content: 'Content 1',
          useCase: 'Marketing',
          status: 'APPROVED',
          upvotes: 5,
          createdBy: 'user-1',
          upvotedBy: [],
          user: { name: 'User 1', email: 'user1@example.com' }
        },
        {
          id: 'prompt-2',
          title: 'Test Prompt 2',
          content: 'Content 2',
          useCase: 'Programming',
          status: 'PENDING',
          upvotes: 0,
          createdBy: 'user-1',
          upvotedBy: [],
          user: { name: 'User 1', email: 'user1@example.com' }
        }
      ])
    },
    $disconnect: jest.fn()
  }
  
  return {
    PrismaClient: jest.fn(() => mockClient)
  }
})

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data) => ({
      status: 200,
      json: async () => data
    }))
  },
  NextRequest: jest.fn().mockImplementation((url) => ({
    url,
    nextUrl: new URL(url)
  }))
}))

// For now, let's directly test the API handler function
describe('Prompts API', () => {
  // Let's make a simplified test that will work without NextRequest
  it('returns filtered prompts when getPrompts is called', async () => {
    // Import your actual API handlers here
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GET } = require('@/app/api/prompts/route')
    
    // Mock session to return a regular user
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: {
        id: 'user-1',
        role: 'USER'
      }
    })
    
    // Call the handler with a minimal mock request
    const mockRequest = {
      url: 'http://localhost:3000/api/prompts',
      nextUrl: new URL('http://localhost:3000/api/prompts')
    }
    
    const response = await GET(mockRequest)
    const result = await response.json()
    
    // Verify expected filtering behavior
    expect(result.length).toBe(1)
    expect(result[0].id).toBe('prompt-1')
    expect(result[0].status).toBe('APPROVED')
  })
})