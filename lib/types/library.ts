import { PROMPT_ICON_CATALOG } from '@/lib/utils/library'
import { PROVIDERS } from '@/stores/llm'

export enum ResponseMode {
  InsertBelow,
  ReplaceSelection,
}

export const ResponseModeLabels = {
  [ResponseMode.InsertBelow]: 'Insert Below',
  [ResponseMode.ReplaceSelection]: 'Replace Selection',
}

export type Prompt = {
  id: number
  mainLabel: string
  secondaryLabel: string
  iconName: keyof typeof PROMPT_ICON_CATALOG
  template: string
  responseMode: ResponseMode
  groupName: string
  providerId: keyof typeof PROVIDERS
  modelId: string
  shortcut?: string
}
