import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { JwtService } from '@/core/services/JwtService'


// Route component loaders (preferred style)
const LoginPage = () => import('../views/auth/LoginPage.vue')
const DashboardView = () => import('../views/DashboardView.vue')
const HomeView = () => import('../views/dashboard/HomeView.vue')
const TeacherRequestsView = () => import('../views/dashboard/TeacherRequestsView.vue')
const TeachersView = () => import('../views/dashboard/TeachersView.vue')
const StudentsView = () => import('../views/dashboard/StudentsView.vue')

const ContentRequestsView = () => import('../views/dashboard/ContentRequestsView.vue')
const ContentTypesView = () => import('../views/dashboard/ContentTypeView.vue')
const TagsView = () => import('../views/dashboard/TagsView.vue')
const AdminAuthSuccess = () => import('../components/AdminAuthSuccess.vue')
const AdminAuthError = () => import('../components/AdminAuthError.vue')



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/dashboard/home'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'home',
          name: 'dashboard-home',
          component: HomeView,
          meta: { requiresAuth: true }
        },
        {
          path: 'requests',
          name: 'teacher-requests',
          component: TeacherRequestsView,
          meta: { requiresAuth: true }
        },
        {
          path: 'teachers',
          name: 'teachers',
          component: TeachersView,
          meta: { requiresAuth: true }
        },
        {
          path: 'students',
          name: 'students',
          component: StudentsView,
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
        },
        {
          path: 'tags',
          name: 'Tags',
          component: TagsView,
          meta: {
            title: 'Tags Management',
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
      component: AdminAuthSuccess,
      meta: { requiresGuest: true }
    },
    {
      path: '/admin/auth-error',
      name: 'AdminAuthError',
      component: AdminAuthError,
      meta: { requiresGuest: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'dashboard-home' }
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