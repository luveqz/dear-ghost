<script setup lang="ts">
import { TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/vue'

defineEmits(['run-prompt'])
</script>

<template>
  <TabGroup as="div" class="flex flex-col px-10">
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
        class="absolute bottom-0 left-0 h-0.25 w-full border-none bg-black/5"
      />
    </TabList>

    <TabPanels class="tab-panels grow overflow-y-scroll scroll-smooth pb-3">
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
        <!--
          This is a config popover's height.
          We should replace this hardcoded value
          and use something dynamic after launch.
        -->
        <div class="h-[23.625rem]" />
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>

<style scoped>
.tab-panels::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
</style>
