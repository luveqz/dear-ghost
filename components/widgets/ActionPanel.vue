<template>
  <section class="px-10">
    <!-- Tabs -->
    <div class="relative flex justify-between text-xs font-semibold">
      <button class="relative flex flex-col items-center gap-1 px-1 pb-2">
        <SparkIcon />
        <p> Prompts </p>

        <hr
          class="absolute bottom-0 left-0 h-1 w-full border-none bg-orange-500"
        />
      </button>

      <button class="relative flex flex-col items-center gap-1 px-1 pb-2">
        <DialogIcon class="opacity-50" />
        <p class="opacity-60"> Chat </p>
      </button>

      <button class="relative flex flex-col items-center gap-1 px-1 pb-2">
        <HistoryIcon class="opacity-50" />
        <p class="opacity-60"> History </p>
      </button>

      <hr
        class="absolute bottom-0 left-0 h-1 w-full border-none bg-gray-900/5"
      />
    </div>

    <!-- Panel Content -->
    <div class="mt-5">
      <p class="text-xs font-semibold"> Perspective </p>

      <ul class="mt-2 flex flex-col gap-y-3">
        <PromptButton secondary-label="Insert" main-label="Rhetorical Figure" />
        <PromptButton secondary-label="Change" main-label="Point of View" />
        <PromptButton secondary-label="Change" main-label="Tense" />
      </ul>
    </div>

    <div class="mt-5">
      <p class="text-xs font-semibold"> Editing </p>

      <ul class="mt-2 flex flex-col gap-y-3">
        <PromptButton secondary-label="Make it" main-label="Weird" />
        <PromptButton
          secondary-label="Suggest"
          main-label="Ironic Turning Points"
        />
      </ul>
    </div>

    <div class="mt-5">
      <p class="text-xs font-semibold"> Other </p>

      <ul class="mt-2 flex flex-col gap-y-3">
        <PromptButton secondary-label="Ctrl + Enter" main-label="Raw Query" />
      </ul>
    </div>
  </section>
</template>
