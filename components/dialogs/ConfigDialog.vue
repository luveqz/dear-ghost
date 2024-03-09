<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
</script>

<template>
  <div
    class="flex h-[calc(100vh_-_8rem)] w-full max-w-[48rem] overflow-hidden rounded bg-white font-normal"
  >
    <TabGroup>
      <TabList
        class="flex w-40 shrink-0 flex-col items-start gap-y-5 bg-[#DEE4EB] px-9 py-12"
      >
        <Tab v-slot="{ selected }">
          <span :class="{ 'font-bold': selected }">Models</span>
        </Tab>
        <Tab v-slot="{ selected }">
          <span :class="{ 'font-bold': selected }">Prompts</span>
        </Tab>
        <Tab v-slot="{ selected }">
          <span :class="{ 'font-bold': selected }">Appearance</span>
        </Tab>
      </TabList>

      <TabPanels class="mr-2 grow overflow-y-auto">
        <TabPanel>
          <ModelConfigPanel />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>
