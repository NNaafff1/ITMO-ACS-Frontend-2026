<script setup>
import { nextTick } from 'vue'

const props = defineProps({
  tabs: { type: Array, required: true },
  label: { type: String, default: '' },
})

const active = defineModel({ type: String, required: true })

function move(step) {
  const index = props.tabs.findIndex((tab) => tab.id === active.value)
  const next = props.tabs[(index + step + props.tabs.length) % props.tabs.length]
  active.value = next.id
  nextTick(() => document.getElementById(`${next.id}-tab`)?.focus())
}
</script>

<template>
  <ul class="nav nav-tabs mb-3" role="tablist" :aria-label="label">
    <li v-for="tab in tabs" :key="tab.id" class="nav-item" role="presentation">
      <button
        :id="`${tab.id}-tab`"
        class="nav-link"
        :class="{ active: active === tab.id }"
        type="button"
        role="tab"
        :aria-controls="tab.id"
        :aria-selected="active === tab.id"
        :tabindex="active === tab.id ? 0 : -1"
        @click="active = tab.id"
        @keydown.right.prevent="move(1)"
        @keydown.left.prevent="move(-1)"
      >
        {{ tab.label }}
      </button>
    </li>
  </ul>
</template>
