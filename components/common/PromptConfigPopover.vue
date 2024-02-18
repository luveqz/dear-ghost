<script setup lang="ts">
import { type Prompt, ResponseModeLabels } from '@/lib/types/library'
import { PROMPT_ICON_CATALOG } from '@/stores/library'
import { PROVIDERS } from '@/stores/llm'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  prompt: {
    type: Object as PropType<Prompt>,
    required: true,
  },
})

const _groupName = ref(props.prompt.groupName)
const showAdvanced = ref(false)

const selectedResponseMode = ref({
  id: props.prompt.responseMode,
  label: ResponseModeLabels[props.prompt.responseMode],
})

const responseModes = Object.entries(ResponseModeLabels).map(([id, label]) => ({
  id: Number(id),
  label,
}))

const selectedProvider = ref({
  id: props.prompt.providerId,
  label: PROVIDERS[props.prompt.providerId].label,
})

const providers = Object.entries(PROVIDERS).map(([id, { label }]) => ({
  id: Number(id),
  label,
}))

const selectedModel = ref()
const models = ref<any[]>([])

const onUpdateProvider = async (option: any) => {
  props.prompt.providerId = option.id
  const modelList = await PROVIDERS[props.prompt.providerId].getModels()
  models.value = modelList.map((model) => ({ id: model, label: model }))

  if (!modelList.includes(props.prompt.modelId)) {
    props.prompt.modelId = modelList[0]
  }

  selectedModel.value = models.value.find(
    (model: any) => model.id === props.prompt.modelId,
  )
}

onUpdateProvider(selectedProvider.value)

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      showAdvanced.value = false
      _groupName.value = props.prompt.groupName
      onUpdateProvider(selectedProvider.value)
    } else {
      props.prompt.groupName = _groupName.value
    }
  },
)
</script>

<template>
  <section
    v-if="prompt"
    class="flex w-action-panel-popover flex-col gap-y-3 rounded rounded-ss-none border border-blue-gray-200 bg-blue-gray-50 p-7"
  >
    <div class="flex">
      <!-- General Options -->
      <section
        class="flex w-full shrink-0 flex-col gap-y-3"
        :class="{ 'invisible order-1 opacity-0': showAdvanced }"
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
                class="flex h-10 w-10 items-center justify-center rounded border border-blue-gray-200 bg-white"
              >
                <component
                  :is="PROMPT_ICON_CATALOG[prompt.iconName]"
                  class="h-4 w-4"
                />
              </div>
            </label>
          </div>
        </div>

        <!-- Second Line -->
        <div>
          <label class="mb-1 text-xs font-bold">
            <div class="flex items-center justify-between">
              <span class="mb-1 block">Template</span>
              <InfoIcon class="text-orange-500/60" />
            </div>
            <BaseTextarea
              v-model="prompt.template"
              class="h-48 w-full"
              stop-propagation-on-scroll
            />
          </label>
        </div>
      </section>

      <!-- Advanced Options -->
      <section
        class="flex w-full shrink-0 flex-col gap-y-3"
        :class="{ 'invisible order-1 opacity-0': !showAdvanced }"
      >
        <!-- First Line -->
        <div class="w-full">
          <label class="text-xs font-bold">
            <span class="mb-1 block">Secondary label</span>
            <BaseInput v-model="prompt.secondaryLabel" class="w-full" />
          </label>
        </div>

        <!-- Second Line -->
        <div class="w-full">
          <label class="text-xs font-bold">
            <span class="mb-1 block">Group name</span>
            <BaseInput v-model="_groupName" class="w-full" />
          </label>
        </div>

        <!-- Third Line -->
        <div class="flex gap-4">
          <div class="w-1/2 grow">
            <label class="text-xs font-bold">
              <div class="flex items-center justify-between">
                <span class="mb-1 block">Provider</span>
                <InfoIcon class="text-orange-500/60" />
              </div>
              <BaseSelect
                v-model="selectedProvider"
                :options="providers"
                @update:model-value="onUpdateProvider"
                class="w-full"
              />
            </label>
          </div>

          <div v-if="selectedModel" class="w-1/2 grow">
            <label class="text-xs font-bold">
              <div class="flex items-center justify-between">
                <span class="mb-1 block">Model</span>
              </div>
              <BaseSelect
                v-model="selectedModel"
                :options="models"
                @update:model-value="(option) => (prompt.modelId = option.id)"
                class="w-full"
              />
            </label>
          </div>
        </div>

        <!-- Fourth Line -->
        <div>
          <label class="text-xs font-bold">
            <div class="flex items-center justify-between">
              <span class="mb-1 block">Response</span>
              <InfoIcon class="text-orange-500/60" />
            </div>
            <BaseSelect
              v-model="selectedResponseMode"
              :options="responseModes"
              @update:model-value="
                (option) => (prompt.responseMode = option.id)
              "
              class="w-full"
            />
          </label>
        </div>
      </section>
    </div>

    <div class="flex flex-row-reverse justify-between">
      <button
        class="text-xs font-semibold underline"
        @click="showAdvanced = !showAdvanced"
      >
        {{ showAdvanced ? 'Hide advanced' : 'Advanced' }}
      </button>

      <button
        v-show="showAdvanced"
        class="text-xs font-semibold text-[#BB6677]"
        @click="$library.removePrompt(prompt)"
      >
        Delete
      </button>
    </div>
  </section>
</template>
