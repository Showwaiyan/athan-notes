import { verifyCredentials, hashPassword } from '@/lib/auth'
import bcrypt from 'bcryptjs'

// Mock bcryptjs
jest.mock('bcryptjs')

describe('lib/auth', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { 
      ...originalEnv,
      APP_USERNAME: 'admin',
      APP_PASSWORD_HASH: '$2b$10$hashedpassword'
    }
    jest.clearAllMocks()
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('verifyCredentials', () => {
    const mockCompare = bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>

    it('should return true when credentials are valid', async () => {
      mockCompare.mockResolvedValue(true as never)

      const result = await verifyCredentials('admin', 'admin123')

      expect(result).toBe(true)
      expect(mockCompare).toHaveBeenCalledWith('admin123', '$2b$10$hashedpassword')
      expect(mockCompare).toHaveBeenCalledTimes(1)
    })

    it('should return false when username does not match', async () => {
      const result = await verifyCredentials('wronguser', 'admin123')

      expect(result).toBe(false)
      expect(mockCompare).not.toHaveBeenCalled()
    })

    it('should return false when password does not match hash', async () => {
      mockCompare.mockResolvedValue(false as never)

      const result = await verifyCredentials('admin', 'wrongpassword')

      expect(result).toBe(false)
      expect(mockCompare).toHaveBeenCalledWith('wrongpassword', '$2b$10$hashedpassword')
    })

    it('should return false when APP_USERNAME is not set', async () => {
      delete process.env.APP_USERNAME

      const result = await verifyCredentials('admin', 'admin123')

      expect(result).toBe(false)
      expect(mockCompare).not.toHaveBeenCalled()
    })

    it('should return false when APP_PASSWORD_HASH is not set', async () => {
      delete process.env.APP_PASSWORD_HASH

      const result = await verifyCredentials('admin', 'admin123')

      expect(result).toBe(false)
      expect(mockCompare).not.toHaveBeenCalled()
    })

    it('should handle bcrypt errors and return false', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockCompare.mockRejectedValue(new Error('Bcrypt error') as never)

      const result = await verifyCredentials('admin', 'admin123')

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith('Error verifying password:', expect.any(Error))
      consoleSpy.mockRestore()
    })
  })

  describe('hashPassword', () => {
    const mockHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>

    it('should hash password with 10 salt rounds', async () => {
      mockHash.mockResolvedValue('$2b$10$hashedpassword' as never)

      const result = await hashPassword('admin123')

      expect(result).toBe('$2b$10$hashedpassword')
      expect(mockHash).toHaveBeenCalledWith('admin123', 10)
      expect(mockHash).toHaveBeenCalledTimes(1)
    })

    it('should handle different passwords', async () => {
      mockHash.mockResolvedValue('$2b$10$differenthash' as never)

      const result = await hashPassword('differentpassword')

      expect(result).toBe('$2b$10$differenthash')
      expect(mockHash).toHaveBeenCalledWith('differentpassword', 10)
    })
  })
})
