<script setup lang="ts">
import { TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/vue'
import debounce from 'lodash/debounce'

defineEmits(['run-prompt'])

const panelRef = ref()

const { y, isScrolling } = useScroll(panelRef)

const onScrollPopover = (deltaY: number) => {
  if (!panelRef.value || !panelRef.value.$el) return
  panelRef.value.$el.scrollTo(0, y.value + deltaY)
}

/*----------------------------------------
  Save all changes in the library when
  the library is updated.
----------------------------------------*/
const { $library } = useNuxtApp()
const debouncedSaveAll = debounce($library.saveAll, 600)
watch($library, debouncedSaveAll)

/*----------------------------------------
  Hide the scroll indicator once the user
  scrolls the panel.
----------------------------------------*/
const { $editor } = useNuxtApp()

whenever(isScrolling, () => {
  if ($editor.config.view.promptsTabScrollIndicator) {
    $editor.setUserConfig('view.promptsTabScrollIndicator', false)
  }
})
</script>

<template>
  <TabGroup as="div" class="flex flex-col pl-10">
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

    <TabPanels
      ref="panelRef"
      class="tab-panels grow overflow-y-scroll scroll-smooth pb-3"
    >
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
              @scroll-popover="onScrollPopover"
              @run-prompt="$emit('run-prompt', prompt)"
            />
          </ul>
        </div>

        <button
          class="mt-3 w-full rounded border border-black/15 py-2 text-center text-sm font-medium leading-none"
          @click="$library.addPrompt"
        >
          New prompt
        </button>

        <div class="flex h-[70vh] flex-col justify-end">
          <transition
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform opacity-200"
            leave-to-class="transform opacity-0"
          >
            <div
              v-if="$editor.config.view.promptsTabScrollIndicator"
              class="sticky bottom-0 mt-4 flex justify-center"
              title="Scrollable panel :)"
            >
              <ScrollIcon />
            </div>
          </transition>
        </div>
      </TabPanel>

      <TabPanel class="h-3/4">
        <PatreonTab />
      </TabPanel>

      <TabPanel class="h-3/4">
        <PatreonTab />
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
