import { defineStore } from 'pinia'
import groupBy from 'lodash/groupBy'

import { type Prompt, ResponseMode } from '@/lib/types/library'
import { DEFAULT_PROMPTS } from '@/lib/data/default-prompts'
import { LLMProvider } from '@/stores/llm'
import { makeId } from '@/lib/utils/random'
import { deepCopy } from '@/lib/utils/copy'
import DialogIcon from '@/components/icons/DialogIcon.vue'
import HistoryIcon from '@/components/icons/HistoryIcon.vue'
import SparkIcon from '@/components/icons/SparkIcon.vue'
import TextIcon from '@/components/icons/TextIcon.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import SandClockIcon from '@/components/icons/SandClockIcon.vue'
import BoltIcon from '@/components/icons/BoltIcon.vue'

export const DEFAULT_PROMPT: Prompt = {
  id: 0,
  mainLabel: 'New Prompt',
  secondaryLabel: 'Generate',
  iconName: 'SparkIcon',
  template: '{{ SELECTED_TEXT }}',
  responseMode: ResponseMode.InsertBelow,
  groupName: 'Other',
  providerId: LLMProvider.LMStudio,
  modelId: 'mistral:instruct',
}

export const PROMPT_ICON_CATALOG = {
  DialogIcon,
  HistoryIcon,
  SparkIcon,
  TextIcon,
  EyeIcon,
  SandClockIcon,
  BoltIcon,
}

export const useLibraryStore = defineStore('library', {
  state: () =>
    ({
      prompts: DEFAULT_PROMPTS,
    }) as {
      prompts: Prompt[]
    },

  getters: {
    groupedPrompts(state) {
      return groupBy(state.prompts, 'groupName')
    },
  },

  actions: {
    addPrompt() {
      this.prompts.push(
        deepCopy({
          ...DEFAULT_PROMPT,
          id: makeId(60),
        }),
      )
    },
  },
})
