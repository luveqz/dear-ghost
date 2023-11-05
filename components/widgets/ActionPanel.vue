<script setup lang="ts">
import { TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/vue'
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
        class="bg-orange-gray-900/5 absolute bottom-0 left-0 h-1 w-full border-none"
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

          <ul class="mt-2 flex flex-col gap-y-3">
            <PromptButton
              v-for="prompt in prompts"
              :key="prompt.id"
              :prompt="prompt"
            />
          </ul>
        </div>
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>
