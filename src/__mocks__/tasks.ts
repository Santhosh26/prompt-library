import { rest } from 'msw';
import { mockPrompts, mockUserSession, mockAdminSession } from './data';

export const handlers = [
  // Session handler
  rest.get('/api/auth/session', (req, res, ctx) => {
    const isAdmin = req.headers.get('x-mock-role') === 'ADMIN';
    return res(
      ctx.json(isAdmin ? mockAdminSession : mockUserSession)
    );
  }),
  
  // Get all prompts
  rest.get('/api/prompts', (req, res, ctx) => {
    const createdBy = req.url.searchParams.get('createdBy');
    const isAdmin = req.headers.get('x-mock-role') === 'ADMIN';
    
    let filteredPrompts = [...mockPrompts];
    
    if (createdBy) {
      filteredPrompts = filteredPrompts.filter(p => p.createdBy === createdBy);
    } else if (!isAdmin) {
      filteredPrompts = filteredPrompts.filter(p => p.status === 'APPROVED');
    }
    
    return res(ctx.json(filteredPrompts));
  }),
  
  // Get single prompt
  rest.get('/api/prompts/:id', (req, res, ctx) => {
    const { id } = req.params;
    const prompt = mockPrompts.find(p => p.id === id);
    
    if (!prompt) {
      return res(ctx.status(404), ctx.json({ error: 'Prompt not found' }));
    }
    
    return res(ctx.json(