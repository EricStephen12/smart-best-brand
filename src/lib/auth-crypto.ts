import { scrypt, randomBytes, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

/**
 * Hashes a plaintext password using Node's native scrypt with a cryptographically
 * secure random 16-byte salt.
 * Returns format: "saltHex:derivedKeyHex"
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer
  return `${salt}:${derivedKey.toString('hex')}`
}

/**
 * Verifies a plaintext password against a stored "saltHex:derivedKeyHex" string.
 * Uses timingSafeEqual to protect against timing attacks.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, key] = storedHash.split(':')
  if (!salt || !key) return false

  const keyBuffer = Buffer.from(key, 'hex')
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer

  if (keyBuffer.length !== derivedKey.length) {
    return false
  }

  return timingSafeEqual(keyBuffer, derivedKey)
}
