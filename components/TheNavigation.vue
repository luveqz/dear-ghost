<template>
  <nav
    class="flex h-10 items-center justify-between bg-gray-900 px-5 text-sm font-semibold text-white"
  >
    <!-- Left -->
    <section>
      <a class="flex items-center gap-x-1" href="#"> Help <AngleDownIcon /> </a>
    </section>

    <!-- Right -->
    <section class="flex items-center gap-x-5">
      <button
        :class="{ 'opacity-50': $editor.mode !== 'write' }"
        @click="$editor.mode = 'write'"
      >
        Write
      </button>
      <div class="block h-3 border-l border-l-white" />
      <button
        :class="{ 'opacity-50': $editor.mode !== 'edit-workspace' }"
        @click="$editor.mode = 'edit-workspace'"
      >
        Edit Workspace
      </button>
    </section>
  </nav>
</template>
