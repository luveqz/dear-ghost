import { Prompt, ResponseMode } from '@/lib/types/library'
import { AnthropicModel, LLMProvider } from '@/stores/llm'

export const DEFAULT_PROMPTS: Prompt[] = [
  {
    id: 1,
    mainLabel: 'Ironic Turning Points',
    secondaryLabel: 'Think of',
    iconName: 'TextIcon',
    template: `
      Suggest 3 unexpected turning points in which all the characters will have to start an ironic journey:  

{{ SELECTED_TEXT }}
    `.trim(),
    responseMode: ResponseMode.InsertBelow,
    groupName: 'Discovery',
    providerId: LLMProvider.Anthropic,
    modelId: AnthropicModel.ClaudeInstant,
  },
  {
    id: 2,
    mainLabel: 'Awkward Dialog',
    secondaryLabel: 'Turn into',
    iconName: 'DialogIcon',
    template: `
      Rewrite the following dialog to make characters awkward:  

{{ SELECTED_TEXT }}
    `.trim(),
    responseMode: ResponseMode.InsertBelow,
    groupName: 'Discovery',
    providerId: LLMProvider.Anthropic,
    modelId: AnthropicModel.ClaudeInstant,
  },
  {
    id: 3,
    mainLabel: 'Point of Views',
    secondaryLabel: 'Rewrite in different',
    iconName: 'EyeIcon',
    template: `
      Rewrite many times the following text, each time using a different point of view:  

{{ SELECTED_TEXT }}
    `.trim(),
    responseMode: ResponseMode.InsertBelow,
    groupName: 'Style Lab',
    providerId: LLMProvider.Anthropic,
    modelId: AnthropicModel.ClaudeInstant,
  },
  {
    id: 4,
    mainLabel: 'Tenses',
    secondaryLabel: 'Rewrite in different',
    iconName: 'SandClockIcon',
    template: `
      Rewrite many times the following text, each time using a different tense:  

{{ SELECTED_TEXT }}
    `.trim(),
    responseMode: ResponseMode.InsertBelow,
    groupName: 'Style Lab',
    providerId: LLMProvider.Anthropic,
    modelId: AnthropicModel.ClaudeInstant,
  },
  {
    id: 4,
    mainLabel: 'Raw Query',
    secondaryLabel: 'Ctrl + Enter',
    iconName: 'BoltIcon',
    template: '{{ SELECTED_TEXT }}',
    responseMode: ResponseMode.InsertBelow,
    groupName: 'Other',
    providerId: LLMProvider.Anthropic,
    modelId: AnthropicModel.ClaudeInstant,
    shortcut: 'control_enter',
  },
]
