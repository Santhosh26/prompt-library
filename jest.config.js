
const nextJest = require('next/jest')
// jest.setup.js
import '@testing-library/jest-dom'

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Add this to handle ESM modules like jose
  transformIgnorePatterns: [
    '/node_modules/(?!(.*(jose|next-auth|@panva|preact|openid-client)))'
  ],
}

module.exports = createJestConfig(customJestConfig)