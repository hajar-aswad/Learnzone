import Cookies from 'js-cookie'

export const STRICT_RULES = {
  sameSite: 'strict' as const,
  secure: true,
  expires: 7 // 7 days 
} as const

export interface CookieConfig {
  expires?: number
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

export interface CookieItem<T = any> {
  value: T
  config?: CookieConfig
}

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

export class CookieStore {
  static set<T>(key: string, value: T, config?: CookieConfig): void {
    const cookieConfig = {
      ...STRICT_RULES,
      ...config
    }
    
    Cookies.set(key, JSON.stringify(value), cookieConfig)
  }

  static get<T>(key: string): T | null {
    const value = Cookies.get(key)
    if (!value) return null
    
    try {
      return JSON.parse(value) as T
    } catch {
      return value as T
    }
  }

  static remove(key: string, config?: CookieConfig): void {
    const cookieConfig = {
      ...STRICT_RULES,
      ...config
    }
    
    Cookies.remove(key, cookieConfig)
  }

  static exists(key: string): boolean {
    return Cookies.get(key) !== undefined
  }

  static getAll(): Record<string, any> {
    return Cookies.get()
  }

  static clearAll(): void {
    Object.keys(Cookies.get()).forEach(key => {
      Cookies.remove(key)
    })
  }

  static setMultiple(cookies: Record<string, CookieItem>): void {
    Object.entries(cookies).forEach(([key, item]) => {
      this.set(key, item.value, item.config)
    })
  }

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

export default CookieStore 