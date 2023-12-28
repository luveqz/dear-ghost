<script setup lang="ts">
import { TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/vue'

defineEmits(['run-prompt'])
</script>

<template>
  <TabGroup as="div" class="sticky top-sticky-widget px-10">
    <TabList class="relative flex justify-between text-xs font-semibold">
      <BaseTab label="Prompts">
        <SparkIcon />
      </BaseTab>

      <BaseTab label="Chat">
        <DialogIcon />
      </BaseTab>

      <BaseTab label="History">
        <HistoryIcon />
      </BaseTab>

      <hr
        class="h-0.25 absolute bottom-0 left-0 w-full border-none bg-black/5"
      />
    </TabList>

    <TabPanels>
      <TabPanel>
        <div
          v-for="(prompts, group) in $library.groupedPrompts"
          :key="group"
          class="mt-5"
        >
          <p class="text-xs font-semibold"> {{ group }} </p>

          <ul class="mt-2 flex flex-col">
            <PromptButton
              v-for="(prompt, id) in prompts"
              :class="{
                'rounded-t': id === 0,
                'rounded-b border-b': id === prompts.length - 1,
              }"
              :key="prompt.id"
              :prompt="prompt"
              @run-prompt="$emit('run-prompt', prompt)"
            />
          </ul>
        </div>
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>
