<template>
  <section class="hero py-5">
    <div class="container py-lg-5">
      <h1 class="display-5 mb-3">Найдите работу, которая подходит вам</h1>
      <p class="lead text-secondary mb-4">
        Фильтруйте вакансии по отрасли, зарплате и опыту, храните резюме
        в личном кабинете и откликайтесь в один клик.
      </p>
      <RouterLink class="btn btn-primary btn-lg" :to="{ name: 'vacancies' }">Смотреть вакансии</RouterLink>
    </div>
  </section>
</template>
