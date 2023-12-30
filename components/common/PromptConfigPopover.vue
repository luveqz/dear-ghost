<script setup lang="ts">
import { Prompt, ResponseModeLabels } from '@/lib/types/library'
import { PROMPT_ICON_CATALOG } from '@/stores/library'

const props = defineProps({
  prompt: {
    type: Object as PropType<Prompt>,
    required: true,
  },
})

const selectedResponseMode = ref({
  id: props.prompt.responseMode,
  label: ResponseModeLabels[props.prompt.responseMode],
})

const responseModes = Object.entries(ResponseModeLabels).map(([id, label]) => ({
  id: Number(id),
  label,
}))
</script>

<template>
  <section
    v-if="prompt"
    class="border-blue-gray-200 flex w-action-panel-popover flex-col gap-y-3 rounded border bg-blue-gray-50 p-7"
  >
    <!-- First Line -->
    <div class="flex gap-4">
      <div class="w-full">
        <label class="text-xs font-bold">
          <span class="mb-1 block">Main label</span>
          <BaseInput v-model="prompt.mainLabel" class="w-full" />
        </label>
      </div>

      <div>
        <label class="mb-1 text-xs font-bold">
          <span class="mb-1 block">Icon</span>

          <div
            class="border-blue-gray-200 flex h-10 w-10 items-center justify-center rounded border bg-white"
          >
            <component
              :is="PROMPT_ICON_CATALOG[prompt.iconName]"
              class="h-4 w-4"
            />
          </div>
        </label>
      </div>
    </div>

    <!-- Third Line -->
    <div>
      <label class="mb-1 text-xs font-bold">
        <div class="flex items-center justify-between">
          <span class="mb-1 block">Template</span>
          <InfoIcon class="text-orange-500/60" />
        </div>
        <BaseTextarea v-model="prompt.template" class="h-48 w-full" />
      </label>
    </div>

    <div>
      <label class="text-xs font-bold">
        <div class="flex items-center justify-between">
          <span class="mb-1 block">Response</span>
          <InfoIcon class="text-orange-500/60" />
        </div>
        <BaseSelect
          v-model="selectedResponseMode"
          :options="responseModes"
          @update:model-value="(option) => (prompt.responseMode = option.id)"
          class="w-full"
        />
      </label>
    </div>
  </section>
</template>
