<script setup lang="ts">
import { type Prompt, ResponseModeLabels } from '@/lib/types/library'
import { PROMPT_ICON_CATALOG } from '@/lib/utils/library'

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
const showIcons = ref(false)

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
      showIcons.value = false
      _groupName.value = props.prompt.groupName
      onUpdateProvider(selectedProvider.value)
    } else {
      props.prompt.groupName = _groupName.value
    }
  },
)

const icons = Object.entries(PROMPT_ICON_CATALOG)
const ICONS_PER_PAGE = 30

const { currentPage, isFirstPage, isLastPage, prev, next, currentPageSize } =
  useOffsetPagination({
    total: icons.length,
    page: 1,
    pageSize: ICONS_PER_PAGE,
  })

const paginatedIcons = computed(() => {
  const offset = ICONS_PER_PAGE * (currentPage.value - 1)
  return icons.slice(offset, offset + ICONS_PER_PAGE)
})
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
        :class="{ 'invisible order-1 opacity-0': showAdvanced || showIcons }"
      >
        <!-- First Line -->
        <div class="flex gap-4">
          <div class="w-full">
            <div class="text-xs font-bold">
              <label class="mb-1 block">Main label</label>
              <BaseInput v-model="prompt.mainLabel" class="w-full" />
            </div>
          </div>

          <div>
            <div class="mb-1 text-xs font-bold">
              <label class="mb-1 block">Icon</label>

              <div
                class="flex h-10 w-10 cursor-pointer items-center justify-center rounded border border-blue-gray-200 bg-white"
                @click="showIcons = true"
              >
                <component
                  :is="PROMPT_ICON_CATALOG[prompt.iconName]"
                  class="h-4"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Second Line -->
        <div>
          <div class="mb-1 text-xs font-bold">
            <div class="flex items-center justify-between">
              <label class="mb-1 block">Template</label>
              <InfoIcon
                class="cursor-pointer text-orange-500/60"
                @click="$modal.open('template-info')"
              />
            </div>
            <BaseTextarea
              v-model="prompt.template"
              class="h-48 w-full"
              stop-propagation-on-scroll
            />
          </div>
        </div>
      </section>

      <!-- Advanced Options -->
      <section
        class="flex w-full shrink-0 flex-col gap-y-3"
        :class="{ 'invisible order-1 opacity-0': !showAdvanced || showIcons }"
      >
        <!-- First Line -->
        <div class="w-full">
          <div class="text-xs font-bold">
            <label class="mb-1 block">Secondary label</label>
            <BaseInput v-model="prompt.secondaryLabel" class="w-full" />
          </div>
        </div>

        <!-- Second Line -->
        <div class="w-full">
          <div class="text-xs font-bold">
            <label class="mb-1 block">Group name</label>
            <BaseInput v-model="_groupName" class="w-full" />
          </div>
        </div>

        <!-- Third Line -->
        <div class="flex gap-4">
          <div class="w-1/2 grow">
            <div class="text-xs font-bold">
              <div class="flex items-center justify-between">
                <label class="mb-1 block">Provider</label>
                <InfoIcon
                  class="cursor-pointer text-orange-500/60"
                  @click="$modal.open('setup-llm-provider')"
                />
              </div>
              <BaseSelect
                v-model="selectedProvider"
                :options="providers"
                @update:model-value="onUpdateProvider"
                class="w-full"
              />
            </div>
          </div>

          <div v-if="selectedModel" class="w-1/2 grow">
            <div class="text-xs font-bold">
              <div class="flex items-center justify-between">
                <label class="mb-1 block">Model</label>
              </div>
              <BaseSelect
                v-model="selectedModel"
                :options="models"
                @update:model-value="(option) => (prompt.modelId = option.id)"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Fourth Line -->
        <div>
          <div class="text-xs font-bold">
            <label class="mb-1 block">Response mode</label>
            <BaseSelect
              v-model="selectedResponseMode"
              :options="responseModes"
              @update:model-value="
                (option) => (prompt.responseMode = option.id)
              "
              class="w-full"
            />
          </div>
        </div>
      </section>

      <!-- Icons -->
      <section
        class="w-full shrink-0"
        :class="{ 'invisible order-1 opacity-0': !showIcons }"
      >
        <label class="mb-1 block text-xs font-bold">Select icon</label>

        <div class="flex flex-wrap gap-2">
          <div
            v-for="[name, icon] in paginatedIcons"
            :key="name"
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded border border-blue-gray-200 bg-white"
            @click="
              () => {
                prompt.iconName = name as any
                showIcons = false
              }
            "
          >
            <component :is="icon" class="h-4 w-4" />
          </div>
        </div>
      </section>
    </div>

    <!-- Base Navigation -->
    <nav v-if="!showIcons" class="flex flex-row-reverse justify-between">
      <button
        class="text-xs font-semibold underline"
        @click="showAdvanced = !showAdvanced"
      >
        {{ showAdvanced ? 'Hide advanced' : 'Advanced' }}
      </button>

      <button
        v-show="showAdvanced"
        class="text-xs font-semibold text-[#BB6677]"
        @click="
          $modal.open('confirm-remove-prompt', () =>
            $library.removePrompt(prompt),
          )
        "
      >
        Delete
      </button>
    </nav>

    <!-- Icon Navigation -->
    <nav v-else class="flex justify-between">
      <button class="text-xs font-semibold" @click="showIcons = false">
        Back to settings
      </button>

      <div class="flex gap-x-3">
        <button
          class="text-xs font-semibold underline"
          :class="{ 'cursor-auto opacity-50': isFirstPage }"
          @click="prev"
        >
          Prev
        </button>
        <button
          class="text-xs font-semibold underline"
          :class="{ 'cursor-auto opacity-50': isLastPage }"
          @click="next"
        >
          Next
        </button>
      </div>
    </nav>
  </section>
</template>
