<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'

type Option = {
  label: string
  id: number | string
}

const props = defineProps({
  modelValue: {
    type: Object as PropType<Option>,
    required: true,
  },
  options: {
    type: Array as PropType<Option[]>,
    required: true,
  },
})

const renamingOptions = computed(() =>
  props.options.filter((option) => option.id != props.modelValue.id),
)

defineEmits(['update:model-value'])
</script>

<template>
  <Listbox
    as="div"
    class="relative"
    v-slot="{ open }"
    @update:model-value="(value) => $emit('update:model-value', value)"
  >
    <ListboxButton
      class="flex items-center justify-between gap-x-1.5 whitespace-nowrap text-left placeholder:opacity-40"
      :class="{ 'rounded-b-none ': open }"
    >
      <span
        class="underline decoration-black/50 decoration-1 underline-offset-2"
      >
        {{ modelValue.label }}
      </span>
      <AngleDownIcon />
    </ListboxButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <ListboxOptions class="absolute left-0 z-10 bg-white">
        <ListboxOption
          v-slot="{ selected }"
          as="button"
          v-for="option in renamingOptions"
          :key="option.id"
          :value="option"
        >
          <p
            class="cursor-pointer whitespace-nowrap rounded bg-black/5 px-3 py-1 font-semibold"
            :class="{ 'font-bold': selected }"
          >
            {{ option.label }}
          </p>
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>
