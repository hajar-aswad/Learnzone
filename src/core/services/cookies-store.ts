import Cookies from 'js-cookie'

// Strict cookie rules for security
export const STRICT_RULES = {
  sameSite: 'strict' as const,
  secure: true,
  expires: 7 // 7 days default
} as const

// Cookie configuration interface
export interface CookieConfig {
  expires?: number
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

// Type-safe cookie item interface
export interface CookieItem<T = any> {
  value: T
  config?: CookieConfig
}

// Create a type-safe cookie item
export function createCookiesItem<T>(
  value: T,
  config?: CookieConfig
): CookieItem<T> {
  return {
    value,
    config: {
      ...STRICT_RULES,
      ...config
    }
  }
}

// Generic cookie operations
export class CookieStore {
  // Set a cookie with type safety
  static set<T>(key: string, value: T, config?: CookieConfig): void {
    const cookieConfig = {
      ...STRICT_RULES,
      ...config
    }
    
    Cookies.set(key, JSON.stringify(value), cookieConfig)
  }

  // Get a cookie with type safety
  static get<T>(key: string): T | null {
    const value = Cookies.get(key)
    if (!value) return null
    
    try {
      return JSON.parse(value) as T
    } catch {
      return value as T
    }
  }

  // Remove a cookie
  static remove(key: string, config?: CookieConfig): void {
    const cookieConfig = {
      ...STRICT_RULES,
      ...config
    }
    
    Cookies.remove(key, cookieConfig)
  }

  // Check if a cookie exists
  static exists(key: string): boolean {
    return Cookies.get(key) !== undefined
  }

  // Get all cookies
  static getAll(): Record<string, any> {
    return Cookies.get()
  }

  // Clear all cookies
  static clearAll(): void {
    Object.keys(Cookies.get()).forEach(key => {
      Cookies.remove(key)
    })
  }

  // Set multiple cookies
  static setMultiple(cookies: Record<string, CookieItem>): void {
    Object.entries(cookies).forEach(([key, item]) => {
      this.set(key, item.value, item.config)
    })
  }

  // Get multiple cookies
  static getMultiple<T extends Record<string, any>>(keys: (keyof T)[]): Partial<T> {
    const result: Partial<T> = {}
    
    keys.forEach(key => {
      const value = this.get(key as string)
      if (value !== null) {
        result[key] = value as T[keyof T]
      }
    })
    
    return result
  }
}

// Export default instance
export default CookieStore 