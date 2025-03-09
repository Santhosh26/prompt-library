// src/__mocks__/server.ts
import { http } from 'msw'
import { setupServer } from 'msw/node'

const handlers = []

export const server = setupServer(...handlers)