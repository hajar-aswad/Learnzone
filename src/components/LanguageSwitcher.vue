<template>
    <el-dropdown 
      trigger="click" 
      placement="top-start"
      @command="handleLanguageChange"
    >
      <el-button 
        text 
        size="small" 
        class="language-switcher-button"
      >
        <el-icon class="mr-1">
          <Location />
        </el-icon>
        {{ currentLanguageLabel }}
        <el-icon class="ml-1">
          <ArrowDown />
        </el-icon>
      </el-button>
      
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            v-for="lang in languages" 
            :key="lang.code"
            :command="lang.code"
            :class="{ 'is-active': currentLocale === lang.code }"
          >
            <div class="flex items-center">
              <span class="text-lg mr-2">{{ lang.flag }}</span>
              <span>{{ lang.name }}</span>
              <el-icon v-if="currentLocale === lang.code" class="ml-auto text-blue-500">
                <Check />
              </el-icon>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Location, ArrowDown, Check } from '@element-plus/icons-vue'
  
  const { locale } = useI18n()
  
  const languages = [
    {
      code: 'en',
      name: 'English',
      flag: '🇺🇸'
    },
    {
      code: 'ar',
      name: 'العربية',
      flag: '🇸🇦'
    }
  ]
  
  const currentLocale = computed(() => locale.value)
  const currentLanguageLabel = computed(() => {
    const current = languages.find(lang => lang.code === currentLocale.value)
    return current?.name || 'English'
  })
  
  const handleLanguageChange = (langCode: string) => {
    if (langCode !== currentLocale.value) {
      locale.value = langCode
      
      if (langCode === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl')
        document.documentElement.setAttribute('lang', 'ar')
      } else {
        document.documentElement.setAttribute('dir', 'ltr')
        document.documentElement.setAttribute('lang', 'en')
      }
      
      localStorage.setItem('preferred-language', langCode)
    }
  }
  
  onMounted(() => {
    const savedLanguage = localStorage.getItem('preferred-language')
    if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
      handleLanguageChange(savedLanguage)
    }
  })
  </script>
  
  <style scoped>
  .language-switcher-button {
    color: #a7acb4;
    transition: all 0.2s ease;
  }
  
  .language-switcher-button:hover {
    color: #65558F;
  }
  
  .dark .language-switcher-button {
    color: #9ca3af;
  }
  
  .dark .language-switcher-button:hover {
    color: #65558F;
  }
  
  .el-dropdown-item.is-active {
    color: #65558F;
    background-color: #eff6ff;
  }
  
  .dark .el-dropdown-item.is-active {
    color: #65558F  ;
    background-color: #1e3a8a;
  }
  </style>