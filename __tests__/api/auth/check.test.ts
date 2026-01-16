/**
 * @jest-environment node
 */

import { GET } from '@/app/api/auth/check/route'
import { getSession } from '@/lib/session'

// Mock dependencies
jest.mock('@/lib/session')

describe('GET /api/auth/check', () => {
  const mockGetSession = getSession as jest.MockedFunction<typeof getSession>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return authenticated true when user is logged in', async () => {
    const timestamp = Date.now()
    mockGetSession.mockResolvedValue({
      username: 'admin',
      isLoggedIn: true,
      loggedInAt: timestamp,
      save: jest.fn(),
      destroy: jest.fn()
    } as any)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ 
      authenticated: true, 
      username: 'admin',
      loggedInAt: timestamp
    })
    expect(mockGetSession).toHaveBeenCalled()
  })

  it('should return authenticated false when user is not logged in', async () => {
    mockGetSession.mockResolvedValue({
      isLoggedIn: false,
      save: jest.fn(),
      destroy: jest.fn()
    } as any)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ 
      authenticated: false
    })
    expect(mockGetSession).toHaveBeenCalled()
  })

  it('should return authenticated false when username is missing', async () => {
    mockGetSession.mockResolvedValue({
      isLoggedIn: true,
      save: jest.fn(),
      destroy: jest.fn()
    } as any)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ 
      authenticated: true
    })
  })

  it('should handle getSession errors', async () => {
    mockGetSession.mockRejectedValue(new Error('Session error'))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ 
      authenticated: false,
      error: 'An error occurred checking session'
    })
    expect(mockGetSession).toHaveBeenCalled()
  })
})
