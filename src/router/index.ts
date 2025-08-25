import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { JwtService } from '@/core/services/JwtService'

const LoginPage = () => import('../views/auth/LoginPage.vue')
const DashboardView = () => import('../views/DashboardView.vue')
const TeacherRequestsView = () => import('../views/dashboard/TeacherRequestsView.vue')
const ContentRequestsView = () => import('../views/dashboard/ContentRequestsView.vue')
const ContentTypesView = () => import('../views/dashboard/ContentTypeView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/dashboard/requests'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'requests',
          name: 'teacher-requests',
          component: TeacherRequestsView,
          meta: { requiresAuth: true }
        },
        {
          path: 'teachers',
          name: 'teachers',
          component: () => import('../views/dashboard/TeachersView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'students',
          name: 'students',
          component: () => import('../views/dashboard/StudentsView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/dashboard/SettingsView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'content-requests',
          name: 'ContentRequests',
          component: ContentRequestsView,
          meta: {
            title: 'Content Requests',
            roles: ['Admin']
          }
        },
        {
          path: 'content-types',
          name: 'ContentTypes',
          component: ContentTypesView,
          meta: {
            title: 'Content Types',
            roles: ['Admin']
          }
        }
      ]
    },

    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresGuest: true }
    },
    {
      path: '/admin/auth-success',
      name: 'AdminAuthSuccess',
      component: () => import('../components/AdminAuthSuccess.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/admin/auth-error',
      name: 'AdminAuthError',
      component: () => import('../components/AdminAuthError.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'teacher-requests' }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  const isAuthenticated = await authStore.checkAuth()

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return next({ name: 'teacher-requests' })
  }

  next()
})

export default router