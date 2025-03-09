import { UserRole, PromptStatus } from '@prisma/client'

// Mock Users
export const mockUsers = [
  {
    id: 'user-1',
    name: 'Test User',
    email: 'user@example.com',
    role: 'USER' as UserRole,
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN' as UserRole,
  }
]

// Mock Prompts
export const mockPrompts = [
  {
    id: 'prompt-1',
    title: 'Test Prompt 1',
    content: 'This is test prompt content 1',
    useCase: 'Marketing',
    source: 'Test',
    upvotes: 5,
    status: 'APPROVED' as PromptStatus,
    createdAt: new Date().toISOString(),
    createdBy: 'user-1',
    user: { name: 'Test User', email: 'user@example.com' },
    liked: false
  },
  {
    id: 'prompt-2',
    title: 'Test Prompt 2',
    content: 'This is test prompt content 2',
    useCase: 'Programming',
    status: 'PENDING' as PromptStatus,
    upvotes: 0,
    source: 'Test',
    createdAt: new Date().toISOString(),
    createdBy: 'user-1',
    user: { name: 'Test User', email: 'user@example.com' },
    liked: false
  },
  {
    id: 'prompt-3',
    title: 'Admin Prompt',
    content: 'This is a prompt by admin',
    useCase: 'Education',
    status: 'PENDING' as PromptStatus,
    upvotes: 0,
    source: 'Admin',
    createdAt: new Date().toISOString(),
    createdBy: 'admin-1',
    user: { name: 'Admin User', email: 'admin@example.com' },
    liked: false
  }
]

// Mock Sessions
export const mockUserSession = {
  user: {
    id: 'user-1',
    name: 'Test User',
    email: 'user@example.com',
    role: 'USER'
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
}

export const mockAdminSession = {
  user: {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN'
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
}