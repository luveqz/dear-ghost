<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

const tabs = ['Models', 'Prompts', 'Appearance']
</script>

<template>
  <div
    class="flex h-[calc(100vh_-_8rem)] w-full max-w-[48rem] overflow-hidden rounded bg-white font-normal"
  >
    <TabGroup>
      <TabList
        class="flex w-40 shrink-0 flex-col items-start gap-y-5 bg-[#DEE4EB] px-9 py-12"
      >
        <Tab v-for="tab in tabs" :key="tab" v-slot="{ selected }">
          <span :class="{ 'font-bold': selected }">
            {{ tab }}
          </span>
        </Tab>
      </TabList>

      <TabPanels class="mr-2 grow overflow-y-auto">
        <TabPanel>
          <ModelConfigPanel />
        </TabPanel>

        <TabPanel>
          <PatreonConfigPanel />
        </TabPanel>

        <TabPanel>
          <PatreonConfigPanel />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>
