import { defineStore } from 'pinia'
import groupBy from 'lodash/groupBy'
import { get, set } from 'idb-keyval'

import { type Prompt, ResponseMode } from '@/lib/types/library'
import { DEFAULT_PROMPTS } from '@/lib/data/default-prompts'
import { LLMProvider } from '@/stores/llm'
import { makeId } from '@/lib/utils/random'
import { deepCopy } from '@/lib/utils/copy'

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

const LIBRARY_STORAGE_KEY = 'library-storage'

export const useLibraryStore = defineStore('library', {
  state: () =>
    ({
      prompts: [],
    }) as {
      prompts: Prompt[]
    },

  getters: {
    groupedPrompts(state) {
      return groupBy(state.prompts, 'groupName')
    },
  },

  actions: {
    validate(prompts: any) {
      // validate array with a Joi schema
      return true
    },

    addPrompt() {
      this.prompts.push(
        deepCopy({
          ...DEFAULT_PROMPT,
          id: makeId(60),
        }),
      )
    },

    async removePrompt(prompt: Prompt) {
      const promptIndex = this.prompts.findIndex(
        (prompt_) => prompt_.id === prompt.id,
      )
      this.prompts.splice(promptIndex, 1)

      return this._saveAllToIndexedDB()
    },

    async load() {
      this.prompts = await this._loadFromIndexedDB({ addDefault: true })
    },

    async _loadFromIndexedDB({ addDefault } = {} as { addDefault: boolean }) {
      let prompts = (await get(LIBRARY_STORAGE_KEY)) || []

      if (!this.validate(prompts)) {
        prompts = []
      }

      if (addDefault) {
        prompts = prompts.length ? prompts : DEFAULT_PROMPTS
      }

      return prompts as Prompt[]
    },

    saveAll() {
      this._saveAllToIndexedDB()
    },

    _saveAllToIndexedDB() {
      set(LIBRARY_STORAGE_KEY, toRaw(this.prompts))
    },
  },
})
