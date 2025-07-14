import { defineStore } from 'pinia'
import { JwtService } from '@/core/services/JwtService'
import { authApi } from '@/api/auth'
import type { AuthResponse, User } from '@/tanstack/types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: JwtService.isAuthenticated(),
    loading: false,
    error: null
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && state.user !== null,
    currentUser: (state) => state.user,
    userRole: (state) => state.user?.role || 'guest'
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null

      try {
        const response = await authApi.login(credentials)
        
        // Save token
        JwtService.saveToken(response.accessToken)

        // Update state
        this.user = response
        this.isAuthenticated = true
        this.loading = false

        return { success: true, user: response }
      } catch (error: any) {
        this.error = error.message || 'Login failed'
        this.loading = false
        this.isAuthenticated = false
        return { success: false, error: this.error }
      }
    },

    async logout() {
      this.loading = true

      try {
        // Clear tokens and state
        JwtService.destroyTokens()
        this.user = null
        this.isAuthenticated = false
        this.loading = false
        this.error = null
      } catch (error) {
        console.error('Logout error:', error)
        // Still clear state even if there's an error
        JwtService.destroyTokens()
        this.user = null
        this.isAuthenticated = false
        this.loading = false
        this.error = null
      }
    },

    async checkAuth() {
      if (!JwtService.isAuthenticated()) {
        this.isAuthenticated = false
        this.user = null
        return false
      }

      // If token exists and is valid, set authenticated
      this.isAuthenticated = true
      
      // You can implement user fetching here if needed
      // For now, we'll rely on the token being valid
      return true
    },

    async refreshToken() {
      const refreshToken = JwtService.getRefreshToken()
      if (!refreshToken) {
        this.logout()
        return false
      }

      try {
        // You can implement token refresh logic here
        // For now, we'll just check if the current token is still valid
        if (JwtService.isAuthenticated()) {
          this.isAuthenticated = true
          return true
        } else {
          this.logout()
          return false
        }
      } catch (error) {
        console.error('Token refresh failed:', error)
        this.logout()
        return false
      }
    },

    // Set user data (for use with TanStack Query)
    setUser(user: User) {
      this.user = user
    },

    // Set authentication status (for use with TanStack Query)
    setAuthenticated(status: boolean) {
      this.isAuthenticated = status
    },

    // Set error (for use with TanStack Query)
    setError(error: string | null) {
      this.error = error
    },

    clearError() {
      this.error = null
    }
  }
})