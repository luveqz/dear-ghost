<script setup lang="ts">
import { TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/vue'
</script>

<template>
  <TabGroup as="div" class="px-10">
    <TabList class="relative -mt-2 flex justify-between text-xs font-semibold">
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
        class="absolute bottom-0 left-0 h-1 w-full border-none bg-gray-900/5"
      />
    </TabList>

    <TabPanels>
      <TabPanel>
        <div class="mt-5">
          <p class="text-xs font-semibold"> Perspective </p>

          <ul class="mt-2 flex flex-col gap-y-3">
            <PromptButton
              secondary-label="Insert"
              main-label="Rhetorical Figure"
            />
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
            <PromptButton
              secondary-label="Ctrl + Enter"
              main-label="Raw Query"
            />
          </ul>
        </div>
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>
