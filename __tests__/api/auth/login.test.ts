/**
 * @jest-environment node
 */

import { POST } from '@/app/api/auth/login/route'
import { verifyCredentials } from '@/lib/auth'
import { createSession } from '@/lib/session'
import { NextRequest } from 'next/server'

// Mock dependencies
jest.mock('@/lib/auth')
jest.mock('@/lib/session')

describe('POST /api/auth/login', () => {
  const mockVerifyCredentials = verifyCredentials as jest.MockedFunction<typeof verifyCredentials>
  const mockCreateSession = createSession as jest.MockedFunction<typeof createSession>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200 and create session with valid credentials', async () => {
    mockVerifyCredentials.mockResolvedValue(true)
    mockCreateSession.mockResolvedValue(undefined)

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ 
      success: true,
      message: 'Login successful',
      username: 'admin'
    })
    expect(mockVerifyCredentials).toHaveBeenCalledWith('admin', 'admin123')
    expect(mockCreateSession).toHaveBeenCalledWith('admin')
  })

  it('should return 401 with invalid credentials', async () => {
    mockVerifyCredentials.mockResolvedValue(false)

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'admin', password: 'wrongpassword' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data).toEqual({ error: 'Invalid username or password' })
    expect(mockVerifyCredentials).toHaveBeenCalledWith('admin', 'wrongpassword')
    expect(mockCreateSession).not.toHaveBeenCalled()
  })

  it('should return 400 when username is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password: 'admin123' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Username and password are required' })
    expect(mockVerifyCredentials).not.toHaveBeenCalled()
    expect(mockCreateSession).not.toHaveBeenCalled()
  })

  it('should return 400 when password is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'admin' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Username and password are required' })
    expect(mockVerifyCredentials).not.toHaveBeenCalled()
    expect(mockCreateSession).not.toHaveBeenCalled()
  })

  it('should return 400 with empty username', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: '', password: 'admin123' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Username and password are required' })
  })

  it('should return 400 with empty password', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'admin', password: '' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Username and password are required' })
  })

  it('should handle JSON parsing errors', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: 'invalid json'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'An error occurred during login' })
  })

  it('should handle verifyCredentials errors', async () => {
    mockVerifyCredentials.mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'An error occurred during login' })
  })
})
