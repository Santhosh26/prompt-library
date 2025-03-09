import { http, HttpResponse } from 'msw'
import { mockPrompts, mockUserSession, mockAdminSession } from './mockData'

export const handlers = [
  // Simulate GET /api/prompts
  http.get('/api/prompts', ({ request }) => {
    const url = new URL(request.url)
    const createdBy = url.searchParams.get('createdBy')
    const userRole = request.headers.get('x-user-role')
    
    let filteredPrompts = [...mockPrompts]
    
    if (createdBy) {
      filteredPrompts = filteredPrompts.filter(p => p.createdBy === createdBy)
    } else if (userRole !== 'ADMIN') {
      filteredPrompts = filteredPrompts.filter(p => p.status === 'APPROVED')
    }
    
    return HttpResponse.json(filteredPrompts)
  }),
  
  // Simulate GET /api/prompts/:id
  http.get('/api/prompts/:id', ({ params }) => {
    const { id } = params
    const prompt = mockPrompts.find(p => p.id === id)
    
    if (!prompt) {
      return new HttpResponse(
        JSON.stringify({ error: 'Prompt not found' }),
        { status: 404 }
      )
    }
    
    return HttpResponse.json(prompt)
  }),
  
  // Simulate POST /api/prompts
  http.post('/api/prompts', async ({ request }) => {
    const body = await request.json()
    
    const newPrompt = {
      id: `prompt-${mockPrompts.length + 1}`,
      ...body,
      status: 'PENDING',
      upvotes: 0,
      createdAt: new Date().toISOString(),
      createdBy: mockUserSession.user.id,
      user: { 
        name: mockUserSession.user.name, 
        email: mockUserSession.user.email 
      },
      liked: false
    }
    
    mockPrompts.push(newPrompt)
    
    return HttpResponse.json(newPrompt, { status: 201 })
  }),
  
  // Simulate POST /api/prompts/:id/approve
  http.post('/api/prompts/:id/approve', ({ params }) => {
    const { id } = params
    const promptIndex = mockPrompts.findIndex(p => p.id === id)
    
    if (promptIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ error: 'Prompt not found' }),
        { status: 404 }
      )
    }
    
    mockPrompts[promptIndex].status = 'APPROVED'
    
    return HttpResponse.json(mockPrompts[promptIndex])
  }),
  
  // Simulate POST /api/prompts/:id/reject
  http.post('/api/prompts/:id/reject', ({ params }) => {
    const { id } = params
    const promptIndex = mockPrompts.findIndex(p => p.id === id)
    
    if (promptIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ error: 'Prompt not found' }),
        { status: 404 }
      )
    }
    
    mockPrompts[promptIndex].status = 'REJECTED'
    
    return HttpResponse.json(mockPrompts[promptIndex])
  }),
  
  // Simulate POST /api/prompts/:id/upvote
  http.post('/api/prompts/:id/upvote', ({ params }) => {
    const { id } = params
    const promptIndex = mockPrompts.findIndex(p => p.id === id)
    
    if (promptIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ error: 'Prompt not found' }),
        { status: 404 }
      )
    }
    
    const prompt = mockPrompts[promptIndex]
    
    // Toggle like status
    if (prompt.liked) {
      prompt.upvotes -= 1
      prompt.liked = false
    } else {
      prompt.upvotes += 1
      prompt.liked = true
    }
    
    return HttpResponse.json(prompt)
  })
]