<template>
  <div class="py-5">
    <div class="container text-center">
      <h1 class="display-5 fw-bold mb-3">Страница не найдена</h1>
      <p class="text-secondary mb-4">Проверьте адрес или вернитесь на главную страницу.</p>
      <RouterLink class="btn btn-primary" :to="{ name: 'home' }">На главную</RouterLink>
    </div>
  </div>
</template>
