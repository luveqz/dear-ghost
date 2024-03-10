import { PROMPT_ICON_CATALOG } from '@/lib/utils/library'
import { PROVIDERS } from '@/stores/llm'

export type Prompt = {
  id: number
  mainLabel: string
  secondaryLabel: string
  iconName: keyof typeof PROMPT_ICON_CATALOG
  template: string
  groupName: string
  providerId: keyof typeof PROVIDERS
  modelId: string
  shortcut?: string
}
