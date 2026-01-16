/**
 * @jest-environment node
 */

import { getSession, createSession, destroySession, isAuthenticated } from '@/lib/session'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'

// Mock next/headers
jest.mock('next/headers')

// Mock iron-session
jest.mock('iron-session')

describe('lib/session', () => {
  let mockCookies: {
    get: jest.Mock
    set: jest.Mock
    delete: jest.Mock
  }

  let mockSession: {
    username?: string
    isLoggedIn: boolean
    loggedInAt?: number
    save: jest.Mock
    destroy: jest.Mock
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Set up environment variables
    process.env.SESSION_SECRET = 'test-secret-key-32-characters-long-minimum'
    process.env.SESSION_MAX_AGE = '345600'

    mockCookies = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn()
    }
    ;(cookies as jest.Mock).mockResolvedValue(mockCookies)

    mockSession = {
      isLoggedIn: false,
      save: jest.fn().mockResolvedValue(undefined),
      destroy: jest.fn()
    }
    ;(getIronSession as jest.Mock).mockResolvedValue(mockSession)
  })

  describe('getSession', () => {
    it('should return session with isLoggedIn set to false by default', async () => {
      const session = await getSession()

      expect(cookies).toHaveBeenCalled()
      expect(getIronSession).toHaveBeenCalled()
      expect(session.isLoggedIn).toBe(false)
    })

    it('should preserve existing session data', async () => {
      mockSession.username = 'admin'
      mockSession.isLoggedIn = true
      mockSession.loggedInAt = Date.now()

      const session = await getSession()

      expect(session.username).toBe('admin')
      expect(session.isLoggedIn).toBe(true)
      expect(session.loggedInAt).toBeDefined()
    })
  })

  describe('createSession', () => {
    it('should create session with username and set isLoggedIn to true', async () => {
      await createSession('admin')

      expect(getSession).toBeDefined()
      expect(mockSession.username).toBe('admin')
      expect(mockSession.isLoggedIn).toBe(true)
      expect(mockSession.loggedInAt).toBeDefined()
      expect(mockSession.save).toHaveBeenCalled()
    })

    it('should save loggedInAt timestamp', async () => {
      const beforeTime = Date.now()
      await createSession('testuser')
      const afterTime = Date.now()

      expect(mockSession.loggedInAt).toBeGreaterThanOrEqual(beforeTime)
      expect(mockSession.loggedInAt).toBeLessThanOrEqual(afterTime)
    })
  })

  describe('destroySession', () => {
    it('should call session.destroy()', async () => {
      await destroySession()

      expect(mockSession.destroy).toHaveBeenCalled()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when user is logged in', async () => {
      mockSession.isLoggedIn = true

      const result = await isAuthenticated()

      expect(result).toBe(true)
    })

    it('should return false when user is not logged in', async () => {
      mockSession.isLoggedIn = false

      const result = await isAuthenticated()

      expect(result).toBe(false)
    })
  })
})
