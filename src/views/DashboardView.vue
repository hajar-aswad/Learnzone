<template>
  <div class="dashboard-container">
    <aside class="sidebar" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <div class="sidebar-header">
        <h2 class="logo">Admin Panel</h2>
        <el-button
          type="text"
          @click="toggleSidebar"
          class="sidebar-toggle"
        >
          <el-icon>
            <component :is="isSidebarCollapsed ? 'Expand' : 'Fold'" />
          </el-icon>
        </el-button>
      </div>

      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li v-for="item in menuItems" :key="item.path" class="nav-item">
            <router-link
              :to="item.path"
              class="nav-link"
              :class="{ active: $route.path === item.path }"
            >
              <el-icon class="nav-icon">
                <component :is="item.icon" />
              </el-icon>
              <span v-show="!isSidebarCollapsed" class="nav-text">
                {{ item.name }}
              </span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <el-button
          type="danger"
          @click="handleLogout"
          class="logout-btn"
          :class="{ 'logout-btn-collapsed': isSidebarCollapsed }"
        >
          <el-icon>
            <SwitchButton />
          </el-icon>
          <span v-show="!isSidebarCollapsed">Logout</span>
        </el-button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content" :class="{ 'main-content-expanded': isSidebarCollapsed }">
      <!-- Top Header -->
      <header class="top-header">
        <div class="header-left">
          <h1 class="page-title">{{ currentPageTitle }}</h1>
        </div>
        <div class="header-right">
          <div class="user-info">
            <el-avatar :size="32" :src="userAvatar">
              {{ userInitials }}
            </el-avatar>
            <span class="user-name">{{ userFullName }}</span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="page-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessageBox } from 'element-plus'
import {
  Document,
  User,
  School,
  Setting,
  SwitchButton,
  Expand,
  Fold,
  VideoPlay,
  Collection,
  PriceTag
} from '@element-plus/icons-vue'

const isSidebarCollapsed = ref(false)

const authStore = useAuthStore()
const router = useRouter()

const menuItems = [
  {
    name: 'Teacher Requests',
    path: '/dashboard/requests',
    icon: 'Document'
  },
  {
    name: 'Teachers',
    path: '/dashboard/teachers',
    icon: 'User'
  },
  {
    name: 'Students',
    path: '/dashboard/students',
    icon: 'School'
  },
  {
    name: 'Settings',
    path: '/dashboard/settings',
    icon: 'Setting'
  },
  {
  name: 'Content Requests', 
  path: '/dashboard/content-requests',
  icon: 'VideoPlay'
},
{
  name: 'Content Types',
  path: '/dashboard/content-types', 
  icon: 'Collection'
},
{
  name: 'Tags',
  path: '/dashboard/tags',
  icon: 'PriceTag'
}

]

const currentPageTitle = computed(() => {
  const currentRoute = router.currentRoute.value
  const menuItem = menuItems.find(item => item.path === currentRoute.path)
  return menuItem?.name || 'Dashboard'
})

const userFullName = computed(() => {
  const user = authStore.currentUser
  if (!user) return 'Unknown User'
  return `${user.fName} ${user.lName}`
})

const userInitials = computed(() => {
  const user = authStore.currentUser
  if (!user) return 'U'
  return `${user.fName.charAt(0)}${user.lName.charAt(0)}`.toUpperCase()
})

const userAvatar = computed(() => {
  return ''
})

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to logout?',
      'Confirm Logout',
      {
        confirmButtonText: 'Logout',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    await authStore.logout()
    router.push('/login')
  } catch {
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
}

.sidebar {
  width: 280px;
  background: linear-gradient(135deg, #5767b3 0%, #8667a5 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-toggle {
  color: white;
  font-size: 18px;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-left-color: rgba(255, 255, 255, 0.5);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-left-color: white;
}

.nav-icon {
  font-size: 18px;
  margin-right: 12px;
  min-width: 18px;
}

.nav-text {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  background-color: rgba(255, 255, 255, 0.1);
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.logout-btn-collapsed {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.main-content-expanded {
  margin-left: 0;
}

.top-header {
  background: white;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e4e7ed;
}

.page-title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  color: #303133;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-weight: 500;
  color: #606266;
}

.page-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 1000;
    transform: translateX(-100%);
  }
  
  .sidebar-collapsed {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .page-content {
    padding: 20px;
  }
}
</style>
