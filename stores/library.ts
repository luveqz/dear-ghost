import { defineStore } from 'pinia'
import groupBy from 'lodash/groupBy'

enum ResponseMode {
  InsertBelow,
  ReplaceSelection,
}

type Prompt = {
  id: number
  mainLabel: string
  secondaryLabel: string
  iconName: string
  template: string
  responseMode: ResponseMode
  groupName: string
  providerId: number
  modelId: number
}

const DEFAULT_PROMPTS = [
  {
    id: 1,
    mainLabel: 'Ironic Turning Points',
    secondaryLabel: 'Think of',
    iconName: '',
    template: `
      Suggest 3 unexpected turning points in which all the characters will have to start an ironic journey:  

      {{ SELECTED_TEXT }}
    `,
    responseMode: ResponseMode.InsertBelow,
    groupName: 'Discovery',
    providerId: 0,
    modelId: 0,
  },
  {
    id: 2,
    mainLabel: 'Awkward Dialog',
    secondaryLabel: 'Turn into',
    iconName: '',
    template: `
      Rewrite the following dialog to make characters awkward:  

      {{ SELECTED_TEXT }}
    `,
    responseMode: ResponseMode.InsertBelow,
    groupName: 'Discovery',
    providerId: 0,
    modelId: 0,
  },
  {
    id: 3,
    mainLabel: 'Point of Views',
    secondaryLabel: 'Rewrite in different',
    iconName: '',
    template: `
      Rewrite many times the following text, each time using a different point of view:  

      {{ SELECTED_TEXT }}
    `,
    responseMode: ResponseMode.InsertBelow,
    groupName: 'Style Lab',
    providerId: 0,
    modelId: 0,
  },
  {
    id: 4,
    mainLabel: 'Tenses',
    secondaryLabel: 'Rewrite in different',
    iconName: '',
    template: `
      Rewrite many times the following text, each time using a different tense:  

      {{ SELECTED_TEXT }}
    `,
    responseMode: ResponseMode.InsertBelow,
    groupName: 'Style Lab',
    providerId: 0,
    modelId: 0,
  },
  {
    id: 4,
    mainLabel: 'Raw Query',
    secondaryLabel: 'Ctrl + Enter',
    iconName: '',
    template: `
      Rewrite many times the following text, each time using a different tense:  

      {{ SELECTED_TEXT }}
    `,
    responseMode: ResponseMode.InsertBelow,
    groupName: 'Other',
    providerId: 0,
    modelId: 0,
  },
]

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
})
