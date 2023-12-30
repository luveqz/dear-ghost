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

defineProps({
  modelValue: {
    type: Object as PropType<Option>,
    required: true,
  },
  options: {
    type: Array as PropType<Option[]>,
    required: true,
  },
})

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
      class="border-blue-gray-200 flex h-10 w-full items-center justify-between rounded border bg-white p-2.5 px-2 text-left text-sm font-medium placeholder:opacity-40"
      :class="{ 'rounded-b-none ': open }"
    >
      {{ modelValue.label }}
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
      <ListboxOptions
        class="border-blue-gray-200 absolute left-0 w-full rounded-b border bg-blue-gray-50 py-1.5"
      >
        <ListboxOption
          v-slot="{ active, selected }"
          as="button"
          v-for="option in options"
          :key="option.id"
          :value="option"
          class="block px-4 py-1 font-medium"
        >
          <p :class="{ 'font-bold': selected }">
            {{ option.label }}
          </p>
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>
