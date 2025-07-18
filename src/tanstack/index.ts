import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import type { VueQueryPluginOptions } from '@tanstack/vue-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000, 
    },
    mutations: {
      retry: 1,
    },
  },
})

export const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClient,
} 