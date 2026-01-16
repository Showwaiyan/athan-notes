/**
 * @jest-environment node
 */

import { POST } from '@/app/api/auth/logout/route'
import { destroySession } from '@/lib/session'

// Mock dependencies
jest.mock('@/lib/session')

describe('POST /api/auth/logout', () => {
  const mockDestroySession = destroySession as jest.MockedFunction<typeof destroySession>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200 and destroy session', async () => {
    mockDestroySession.mockResolvedValue(undefined)

    const response = await POST()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ 
      success: true,
      message: 'Logout successful'
    })
    expect(mockDestroySession).toHaveBeenCalled()
  })

  it('should handle destroySession errors', async () => {
    mockDestroySession.mockRejectedValue(new Error('Session error'))

    const response = await POST()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'An error occurred during logout' })
    expect(mockDestroySession).toHaveBeenCalled()
  })
})
