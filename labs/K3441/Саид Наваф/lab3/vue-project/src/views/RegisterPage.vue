<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AlertMessage from '@/components/ui/AlertMessage.vue'
import FormField from '@/components/ui/FormField.vue'
import PasswordField from '@/components/ui/PasswordField.vue'
import { useAuth } from '@/composables/useAuth'
import { useFormValidation } from '@/composables/useFormValidation'
import { useSubmit } from '@/composables/useSubmit'

const router = useRouter()
const { register, cabinetRoute } = useAuth()
const { formRef, validated, validate } = useFormValidation()

const form = reactive({
  role: 'seeker',
  name: '',
  email: '',
  password: '',
  password2: '',
  terms: false,
})

const passwordMismatch = computed(() => (form.password === form.password2 ? '' : 'Пароли не совпадают'))

const { submitting, error, submit } = useSubmit(() =>
  register({
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password,
    role: form.role,
  }),
)

async function onSubmit() {
  if (!validate()) {
    return
  }
  const user = await submit()
  if (user) {
    router.push(cabinetRoute.value)
  }
}
</script>

<template>
  <section class="auth-section">
    <div class="container">
      <div class="card auth-card shadow-sm">
        <div class="card-body p-4">
          <h1 class="mb-1">Регистрация</h1>
          <p class="text-secondary mb-4">Создайте аккаунт соискателя или работодателя.</p>

          <form
            ref="formRef"
            class="needs-validation"
            :class="{ 'was-validated': validated }"
            novalidate
            @submit.prevent="onSubmit"
          >
            <AlertMessage :message="error" />

            <fieldset class="mb-3">
              <legend class="form-label fs-6">Я хочу</legend>
              <div class="form-check form-check-inline">
                <input id="roleSeeker" v-model="form.role" class="form-check-input" type="radio" name="role" value="seeker">
                <label class="form-check-label" for="roleSeeker">Найти работу</label>
              </div>
              <div class="form-check form-check-inline">
                <input id="roleEmployer" v-model="form.role" class="form-check-input" type="radio" name="role" value="employer">
                <label class="form-check-label" for="roleEmployer">Найти сотрудников</label>
              </div>
            </fieldset>

            <FormField
              id="regName"
              v-model="form.name"
              label="Имя и фамилия"
              autocomplete="name"
              required
              feedback="Укажите имя и фамилию."
            />

            <FormField
              id="regEmail"
              v-model="form.email"
              type="email"
              label="Эл. почта"
              placeholder="name@example.com"
              autocomplete="email"
              required
              feedback="Введите корректный адрес почты."
            />

            <PasswordField
              id="regPassword"
              v-model="form.password"
              label="Пароль"
              autocomplete="new-password"
              minlength="6"
              required
              feedback="Пароль — не короче 6 символов."
            />

            <FormField
              id="regPassword2"
              v-model="form.password2"
              type="password"
              label="Повторите пароль"
              autocomplete="new-password"
              required
              :custom-error="passwordMismatch"
              feedback="Пароли не совпадают."
            />

            <div class="form-check mb-4">
              <input
                id="regTerms"
                v-model="form.terms"
                class="form-check-input"
                type="checkbox"
                required
                aria-describedby="regTermsFeedback"
              >
              <label class="form-check-label" for="regTerms">Согласен с условиями использования сайта</label>
              <div id="regTermsFeedback" class="invalid-feedback">Нужно принять условия.</div>
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="submitting">
              {{ submitting ? 'Подождите…' : 'Создать аккаунт' }}
            </button>
          </form>

          <p class="text-center text-secondary mt-4 mb-0">
            Уже есть аккаунт? <RouterLink :to="{ name: 'login' }">Войти</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
