<template>
  <div class="absolute left-0 top-0 h-full w-full">
    <TheNavigation class="fixed top-0 w-full" />

    <main class="mt-[4.75rem] flex" :class="'justify-center'">
      <section class="w-page">
        <BasePage />
      </section>
      <section class="w-action-panel">
        <ActionPanel />
      </section>
    </main>
  </div>
</template>
