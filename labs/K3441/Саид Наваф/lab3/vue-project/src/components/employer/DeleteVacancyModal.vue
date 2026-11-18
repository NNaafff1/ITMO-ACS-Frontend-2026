<script setup>
import BaseModal from '@/components/ui/BaseModal.vue'

defineProps({
  vacancy: { type: Object, default: null },
})

const open = defineModel({ type: Boolean, default: false })
defineEmits(['confirm'])
</script>

<template>
  <BaseModal id="deleteModal" v-model="open" title="Удалить вакансию?">
    Вакансия «{{ vacancy ? vacancy.title : '' }}» и все отклики на неё будут удалены.

    <template #footer>
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
      <button type="button" class="btn btn-danger" @click="$emit('confirm')">Удалить</button>
    </template>
  </BaseModal>
</template>
