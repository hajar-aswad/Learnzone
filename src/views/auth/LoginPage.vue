<template>
  <div class="login-bg-container">
    <div class="login-bg-svg">
      <div class="bg-overlay"></div>
      <img src="../../assets/AuthPic.svg" alt="Background" class="bg-svg" />
          </div>
    <div :class="['login-box-half', { 'login-box-mobile': isMobile }]">
        <div class="login-box-glass">
          <div class="ellipse ellipse-1"></div>
          <div class="ellipse ellipse-2"></div>
          <div class="ellipse ellipse-3"></div>
          <h2 class="login-title">{{ $t('auth.signInToAccount') }}</h2>
          <form @submit.prevent="onSubmit" class="login-form">
            <div class="input-group">
              <span class="input-icon">
                <img src="@/assets/Usericon.svg" alt="User" />
              </span>
              <Field name="email" v-slot="{ field, errors }">
                <input
                  v-bind="field"
                type="email"
                  autocomplete="username"
                  class="login-input"
                  :class="{ 'input-error': errors.length }"
                  @input="onInput('email', $event)"
                  @focus="onFocus('email')"
                  @blur="onBlur('email')"
                />
              </Field>
              <span v-if="showEmailPlaceholder" class="input-placeholder">Username</span>
            </div>
            <ErrorMessage name="email" v-slot="{ message }">
              <div class="error-message">{{ message }}</div>
            </ErrorMessage>
            <div class="input-group">
              <span class="input-icon">
                <img src="@/assets/Passwordicon.svg" alt="Password" />
              </span>
              <Field name="password" v-slot="{ field, errors }">
                <input
                  v-bind="field"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  class="login-input"
                  :class="{ 'input-error': errors.length }"
                  @input="onInput('password', $event)"
                  @focus="onFocus('password')"
                  @blur="onBlur('password')"
                />
              </Field>
              <span v-if="showPasswordPlaceholder" class="input-placeholder">Password</span>
              <span class="show-hide" @click="showPassword = !showPassword">
                {{ showPassword ? 'HIDE' : 'SHOW' }}
              </span>
            </div>
            <ErrorMessage name="password" v-slot="{ message }">
              <div class="error-message">{{ message }}</div>
            </ErrorMessage>
            <button
              type="submit"
              class="login-btn"
              :disabled="isSubmitting || authStore.loading"
            >
              <span v-if="!authStore.loading">{{ $t('auth.login') }}</span>
              <span v-else>{{ $t('common.loading') }}</span>
            </button>
            <div v-if="errorMessage" class="error-message mt-2">{{ errorMessage }}</div>
          </form>
          <div class="mt-6 text-center">
            <LanguageSwitcher />
        </div>
  
      </div>
    </div>
    <LoadingOverlay v-if="showLoadingOverlay" class="fixed inset-0 z-50" />
    </div>
  </template>
  
  <script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useAuthStore } from '@/stores/auth'
  import LanguageSwitcher from '../../components/LanguageSwitcher.vue'
import LoadingOverlay from '../../components/LoadingOverlay.vue'
import { useForm, Field, ErrorMessage } from 'vee-validate'
  import * as yup from 'yup'

  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

const showPassword = ref(false)
const errorMessage = ref('')
const showEmailPlaceholder = ref(true)
const showPasswordPlaceholder = ref(true)

const isMobile = ref(false)
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const showLoadingOverlay = ref(false)
let loadingTimeout: ReturnType<typeof setTimeout> | null = null

  const loginSchema = yup.object({
  email: yup.string().required(t('validation.required')).email(t('validation.email')),
  password: yup.string().required(t('validation.required')).min(6, t('validation.minLength', { min: 6 })),
})

const { handleSubmit, isSubmitting, values } = useForm({
    validationSchema: loginSchema,
    initialValues: {
      email: '',
      password: '',
  }
})

const onInput = (field: string, e: Event) => {
  const val = (e.target as HTMLInputElement).value
  if (field === 'email') showEmailPlaceholder.value = !val
  if (field === 'password') showPasswordPlaceholder.value = !val
}
const onFocus = (field: string) => {
  if (field === 'email') showEmailPlaceholder.value = !values.email
  if (field === 'password') showPasswordPlaceholder.value = !values.password
}
const onBlur = (field: string) => {
  if (field === 'email') showEmailPlaceholder.value = !values.email
  if (field === 'password') showPasswordPlaceholder.value = !values.password
}

const onSubmit = handleSubmit(async (formValues) => {
  errorMessage.value = ''
  showLoadingOverlay.value = true
  if (loadingTimeout) clearTimeout(loadingTimeout)
    try {
      const result = await authStore.login({
      email: formValues.email,
      password: formValues.password
      })
    loadingTimeout = setTimeout(() => {
      showLoadingOverlay.value = false
      if (result.success) {
        const redirectTo = (route.query.redirect as string) || '/dashboard/requests'
        router.push(redirectTo)
      } else {
        errorMessage.value = result.error || t('auth.invalidCredentials')
      }
    }, 2000)
  } catch (e) {
    loadingTimeout = setTimeout(() => {
      showLoadingOverlay.value = false
      errorMessage.value = t('auth.invalidCredentials')
    }, 2000)
  }
  })
  </script>
  
  <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

.login-bg-container {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow: hidden;
}

.login-bg-svg {
  position: absolute;
  left: 0; 
  top: 0; 
  width: 100vw; 
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}

.bg-svg {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  opacity: 0.85;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
}

.bg-overlay {
  position: absolute;
  left: 0; 
  top: 0; 
  width: 100vw; 
  height: 100vh;
  background: #ACB7C9;
  opacity: 1;
  z-index: 1;
}

.login-box-half {
  width: 50vw;
  height: 100vh;
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 3;
  transition: all 0.3s;
}

@media (min-width: 769px) and (max-width: 1023px) {
  .login-box-half {
    width: 50vw;
    min-width: 500px;
  }
}

@media (min-width: 1024px) {
  .login-box-half {
    width: 50vw;
    min-width: 600px;
  }
}

.login-box-mobile {
  width: 100vw !important;
  height: 75vh !important;
  min-width: 0 !important;
  left: 0 !important;
  right: 0 !important;
  top: auto !important;
  bottom: 0 !important;
  justify-content: center !important;
  align-items: flex-end !important;
  position: absolute !important;
  background: none;
  z-index: 4;
}

.login-box-container {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
}

.login-box-mobile .login-box-container {
  justify-content: center;
  align-items: flex;
}

.login-box-glass {
  position: relative;
  width: 100%;
  height: 100%;
    max-width: none !important;

  background: rgba(70, 45, 91, 0.20);
  backdrop-filter: blur(15px);
  border-top-left-radius: 59px;
  border-bottom-left-radius: 59px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  box-shadow: 0 8px 32px 0 rgba(70,45,91,0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  overflow: hidden;
  transition: all 0.3s;
  padding: 2rem;
}

.login-box-mobile .login-box-glass {
  width: 95vw;
  height: 70vh;
  max-width: none;
  border-radius: 40px 40px 0 0;
  margin: 0 auto 2vw auto;
  box-shadow: 0 8px 32px 0 rgba(70,45,91,0.15);
}

.ellipse {
  position: absolute;
  pointer-events: none;
  z-index: 5;
  border-radius: 50%;
  animation: float 4s ease-in-out infinite alternate;
}

.ellipse-1 {
  top: -60px;
  right: -60px;
  width: 180px;
  height: 180px;
  background: radial-gradient(50% 50% at 50% 50%, #B379DF 0%, rgba(54, 0, 96, 0) 100%);
  opacity: 0.58;
}

.ellipse-2 {
  bottom: -60px;
  left: -60px;
  width: 140px;
  height: 140px;
  background: radial-gradient(50% 50% at 50% 50%, #56516D 0%, rgba(165, 148, 249, 0.1) 100%);
  opacity: 0.58;
}

.ellipse-3 {
  bottom: -40px;
  right: -40px;
  width: 120px;
  height: 120px;
  background: radial-gradient(50% 50% at 50% 50%, #B379DF 0%, rgba(54, 0, 96, 0) 100%);
  opacity: 0.58;
}

@keyframes float {
  0% { transform: translateY(0); }
  100% { transform: translateY(-12px); }
}

.login-title {
  color: #65558F;
  font-family: 'Poppins', sans-serif;
  font-size: 2.2rem;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 2rem;
  text-align: center;
  z-index: 10;
  position: relative;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  position: relative;
}

.input-group {
  position: relative;
  width: 314px;
  height: 55px;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  background: radial-gradient(90.16% 143.01% at 15.32% 21.04%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.0447917) 77.08%, rgba(255, 255, 255, 0) 100%);
  backdrop-filter: blur( 2px);
  border-radius: 30px;
  border: 0.3px solid transparent;
  background-clip: padding-box;
  box-shadow: 
    0 0 0 0.3px rgba(255, 255, 255, 0.3),
    inset 0 0 0 0.3px rgba(255, 255, 255, 0.1);
}

.input-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  z-index: 2;
}

.input-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.login-input {
  width: 100%;
  height: 100%;
  padding-left: 50px;
  padding-right: 80px;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 1.1rem;
  font-family: 'Poppins', sans-serif;
  border-radius: 30px;
  transition: box-shadow 0.2s, border 0.2s;
}

.login-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.input-placeholder {
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
  font-size: 1.1rem;
  font-family: 'Poppins', sans-serif;
  transition: opacity 0.2s;
}

.show-hide {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  z-index: 2;
  transition: color 0.2s;
}

.show-hide:hover {
  color: #fff;
}

.input-error {
  box-shadow: 
    0 0 0 2px #65558F,
    inset 0 0 0 0.3px rgba(255, 255, 255, 0.1);
  border: 1px solid #65558F;
}

.error-message {
  color: #FF6B6B;
  background: rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 6px 16px;
  margin-top: 0.2rem;
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;
  transition: background 0.2s, color 0.2s;
  text-align: center;
}

.login-btn {
  width: 235px;
  height: 43px;
  margin: 1.5rem auto 0 auto;
  background: radial-gradient(124.52% 124.52% at -3.99% 35.36%, #56516D 0%, #2E2437 69.33%);
  box-shadow: 0px 51px 95px -41px #003CCF, -80px -101px 147px -68px rgba(255, 28, 137, 0.49), 0px 109px 175px -30px rgba(183, 0, 206, 0.7);
  border-radius: 80px;
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 17.9182px;
  line-height: 27px;
  color: #FFFFFF;
  border: none;
  outline: none;
  transition: transform 0.15s, box-shadow 0.15s;
  cursor: pointer;
  z-index: 10;
  position: relative;
}

.login-btn:hover:not(:disabled) {
  transform: scale(1.04);
  box-shadow: 0px 61px 120px -41px #003CCF, -80px -101px 147px -68px rgba(255, 28, 137, 0.59), 0px 129px 200px -30px rgba(183, 0, 206, 0.8);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .login-title {
    font-size: 1.8rem;
  }
  
  .input-group {
    width: 280px;
  }
  
  .login-btn {
    width: 200px;
  }
  }
  </style>