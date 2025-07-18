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
        
        JwtService.saveToken(response.accessToken)

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
        JwtService.destroyTokens()
        this.user = null
        this.isAuthenticated = false
        this.loading = false
        this.error = null
      } catch (error) {
        console.error('Logout error:', error)
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

      this.isAuthenticated = true
      
      return true
    },

    async refreshToken() {
      const refreshToken = JwtService.getRefreshToken()
      if (!refreshToken) {
        this.logout()
        return false
      }

      try {
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

    setUser(user: User) {
      this.user = user
    },

    setAuthenticated(status: boolean) {
      this.isAuthenticated = status
    },

    setError(error: string | null) {
      this.error = error
    },

    clearError() {
      this.error = null
    }
  }
})