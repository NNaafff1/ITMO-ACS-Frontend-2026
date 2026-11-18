<script setup>
import { computed } from 'vue'
import { initials } from '@/utils/format'

const props = defineProps({
  user: { type: Object, required: true },
  resume: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const position = computed(() => {
  if (props.loading) {
    return '…'
  }
  return props.resume ? props.resume.position : 'Резюме не заполнено'
})

const city = computed(() => (props.resume ? props.resume.city : 'не указан'))
</script>

<template>
  <div class="card profile-card">
    <div class="card-body text-center p-4">
      <div class="avatar mb-3" aria-hidden="true">{{ initials(user.name) }}</div>
      <h2 class="h5 mb-1">{{ user.name }}</h2>
      <p class="text-secondary mb-3">{{ position }}</p>
      <ul class="list-unstyled text-start small mb-0">
        <li class="mb-1"><span class="text-secondary">Почта:</span> {{ user.email }}</li>
        <li class="mb-1"><span class="text-secondary">Город:</span> {{ city }}</li>
        <li><span class="text-secondary">Роль:</span> соискатель</li>
      </ul>
    </div>
  </div>
</template>
