import { CookieStore, createCookiesItem } from './cookies-store'
import { TOKEN_CONFIG } from '@/api/config'

// JWT Token interface
export interface JwtTokens {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
}

// JWT Payload interface
export interface JwtPayload {
  sub: string
  iat: number
  exp: number
  [key: string]: any
}

export class JwtService {
  // Save both access and refresh tokens
  static saveTokens(tokens: JwtTokens): void {
    const accessTokenItem = createCookiesItem(tokens.accessToken, {
      expires: tokens.expiresIn ? tokens.expiresIn / (24 * 60 * 60) : 7 // Convert seconds to days
    })
    
    CookieStore.set(TOKEN_CONFIG.ACCESS_TOKEN, accessTokenItem.value, accessTokenItem.config)
    
    if (tokens.refreshToken) {
      const refreshTokenItem = createCookiesItem(tokens.refreshToken, {
        expires: 30 // 30 days for refresh token
      })
      
      CookieStore.set(TOKEN_CONFIG.REFRESH_TOKEN, refreshTokenItem.value, refreshTokenItem.config)
    }
  }

  // Get access token
  static getToken(): string | null {
    return CookieStore.get<string>(TOKEN_CONFIG.ACCESS_TOKEN)
  }

  // Get refresh token
  static getRefreshToken(): string | null {
    return CookieStore.get<string>(TOKEN_CONFIG.REFRESH_TOKEN)
  }

  // Save only access token
  static saveToken(token: string, expiresIn?: number): void {
    const tokenItem = createCookiesItem(token, {
      expires: expiresIn ? expiresIn / (24 * 60 * 60) : 7
    })
    
    CookieStore.set(TOKEN_CONFIG.ACCESS_TOKEN, tokenItem.value, tokenItem.config)
  }

  // Save only refresh token
  static saveRefreshToken(token: string): void {
    const tokenItem = createCookiesItem(token, {
      expires: 30
    })
    
    CookieStore.set(TOKEN_CONFIG.REFRESH_TOKEN, tokenItem.value, tokenItem.config)
  }

  // Destroy all tokens
  static destroyTokens(): void {
    CookieStore.remove(TOKEN_CONFIG.ACCESS_TOKEN)
    CookieStore.remove(TOKEN_CONFIG.REFRESH_TOKEN)
  }

  // Check if token exists and is not expired
  static isAuthenticated(): boolean {
    const token = this.getToken()
    return token !== null && !this.isTokenExpired(token)
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token)
      if (!payload) return true
      
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch (error) {
      return true
    }
  }

  // Decode JWT token without verification
  static decodeToken(token: string): JwtPayload | null {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      
      return JSON.parse(jsonPayload) as JwtPayload
    } catch (error) {
      console.error('Failed to decode JWT token:', error)
      return null
    }
  }

  // Get token payload
  static getTokenPayload(): JwtPayload | null {
    const token = this.getToken()
    if (!token) return null
    
    return this.decodeToken(token)
  }

  // Get user ID from token
  static getUserId(): string | null {
    const payload = this.getTokenPayload()
    return payload?.sub || null
  }

  // Get token expiration time
  static getTokenExpiration(): Date | null {
    const payload = this.getTokenPayload()
    if (!payload?.exp) return null
    
    return new Date(payload.exp * 1000)
  }

  // Check if token will expire soon (within specified minutes)
  static willTokenExpireSoon(minutes: number = 5): boolean {
    const expiration = this.getTokenExpiration()
    if (!expiration) return true
    
    const now = new Date()
    const timeUntilExpiration = expiration.getTime() - now.getTime()
    const minutesUntilExpiration = timeUntilExpiration / (1000 * 60)
    
    return minutesUntilExpiration <= minutes
  }

  // Get authorization header value
  static getAuthorizationHeader(): string | null {
    const token = this.getToken()
    if (!token) return null
    
    return `${TOKEN_CONFIG.TOKEN_PREFIX} ${token}`
  }

  // Clear all authentication data
  static clearAuth(): void {
    this.destroyTokens()
  }
}