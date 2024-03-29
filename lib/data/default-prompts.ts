import { type Prompt } from '@/lib/types/library'
import { LLMProvider } from '@/stores/llm'

export const DEFAULT_PROMPTS: Prompt[] = [
  {
    id: 1,
    mainLabel: 'Ironic Turning Points',
    secondaryLabel: 'Think of',
    iconName: 'StepsIcon',
    template: `
      Suggest 3 unexpected turning points for this story:  

{{ selected_text }}
    `.trim(),
    groupName: 'Discovery',
    providerId: LLMProvider.LMStudio,
    modelId: 'mistral:instruct',
  },
  {
    id: 2,
    mainLabel: 'Awkward Dialog',
    secondaryLabel: 'Turn into',
    iconName: 'CouchIcon',
    template: `
      Rewrite the following dialog to make characters awkward:  

{{ selected_text }}
    `.trim(),
    groupName: 'Discovery',
    providerId: LLMProvider.LMStudio,
    modelId: 'mistral:instruct',
  },
  {
    id: 3,
    mainLabel: 'Points of View',
    secondaryLabel: 'Rewrite in different',
    iconName: 'BirdIcon',
    template: `
      Rewrite many times the following text, each time using a different point of view:  

{{ selected_text }}
    `.trim(),
    groupName: 'Style Lab',
    providerId: LLMProvider.LMStudio,
    modelId: 'mistral:instruct',
  },
  {
    id: 4,
    mainLabel: 'Tenses',
    secondaryLabel: 'Rewrite in different',
    iconName: 'CassetteIcon',
    template: `
      Rewrite many times the following text, each time using a different tense:  

{{ selected_text }}
    `.trim(),
    groupName: 'Style Lab',
    providerId: LLMProvider.LMStudio,
    modelId: 'mistral:instruct',
  },
  {
    id: 5,
    mainLabel: 'Raw Prompt',
    secondaryLabel: 'Ctrl + Enter',
    iconName: 'BoltIcon',
    template: '{{ selected_text }}',
    groupName: 'Other',
    providerId: LLMProvider.LMStudio,
    modelId: 'mistral:instruct',
    shortcut: 'control_enter',
  },
]
