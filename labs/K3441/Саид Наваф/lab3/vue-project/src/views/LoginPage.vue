<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ResetPasswordModal from '@/components/auth/ResetPasswordModal.vue'
import AlertMessage from '@/components/ui/AlertMessage.vue'
import FormField from '@/components/ui/FormField.vue'
import PasswordField from '@/components/ui/PasswordField.vue'
import { useAuth } from '@/composables/useAuth'
import { useFormValidation } from '@/composables/useFormValidation'
import { useSubmit } from '@/composables/useSubmit'

const route = useRoute()
const router = useRouter()
const { login, cabinetRoute } = useAuth()
const { formRef, validated, validate } = useFormValidation()

const form = reactive({ email: '', password: '', remember: false })
const resetOpen = ref(false)

const { submitting, error, submit } = useSubmit(() =>
  login({ email: form.email.trim().toLowerCase(), password: form.password }, form.remember),
)

function getTarget() {
  const redirect = route.query.redirect
  const isInternal = typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
  return isInternal ? redirect : cabinetRoute.value
}

async function onSubmit() {
  if (!validate()) {
    return
  }
  const user = await submit()
  if (user) {
    router.push(getTarget())
  }
}
</script>

<template>
  <section class="auth-section">
    <div class="container">
      <div class="card auth-card shadow-sm">
        <div class="card-body p-4">
          <h1 class="mb-1">Вход</h1>
          <p class="text-secondary mb-4">Войдите, чтобы откликаться на вакансии и управлять резюме.</p>

          <form
            ref="formRef"
            class="needs-validation"
            :class="{ 'was-validated': validated }"
            novalidate
            @submit.prevent="onSubmit"
          >
            <AlertMessage :message="error" />

            <FormField
              id="loginEmail"
              v-model="form.email"
              type="email"
              label="Эл. почта"
              placeholder="name@example.com"
              autocomplete="email"
              required
              feedback="Введите корректный адрес почты."
            />

            <PasswordField
              id="loginPassword"
              v-model="form.password"
              label="Пароль"
              autocomplete="current-password"
              minlength="6"
              required
              feedback="Пароль — не короче 6 символов."
            />

            <div class="d-flex justify-content-between align-items-center mb-4">
              <div class="form-check">
                <input id="rememberMe" v-model="form.remember" class="form-check-input" type="checkbox">
                <label class="form-check-label" for="rememberMe">Запомнить меня</label>
              </div>
              <button type="button" class="btn btn-link p-0 align-baseline" @click="resetOpen = true">
                Забыли пароль?
              </button>
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="submitting">
              {{ submitting ? 'Подождите…' : 'Войти' }}
            </button>
          </form>

          <p class="text-center text-secondary mt-4 mb-0">
            Нет аккаунта? <RouterLink :to="{ name: 'register' }">Зарегистрироваться</RouterLink>
          </p>
        </div>
      </div>
    </div>

    <ResetPasswordModal v-model="resetOpen" />
  </section>
</template>
