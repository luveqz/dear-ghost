import { get } from 'idb-keyval'
import type { UserConfig } from '@/lib/schemas/config'

export async function migrateDeprecatedIdbKeys(config: UserConfig) {
  const fileTree = await get('show-file-tree')

  if (typeof fileTree === 'boolean') {
    config.view.fileTree = fileTree
  }

  const actionPanel = await get('show-action-panel')
  if (typeof actionPanel === 'boolean') {
    config.view.actionPanel = actionPanel
  }

  const installButton = await get('show-install-button')
  if (typeof installButton === 'boolean') {
    config.view.installButton = installButton
  }

  const indent = await get('show-indent')
  if (typeof indent === 'boolean') {
    config.view.indent = indent
  }

  const promptsTabScrollIndicator = await get(
    'show-prompts-tab-scroll-indicator',
  )
  if (typeof promptsTabScrollIndicator === 'boolean') {
    config.view.promptsTabScrollIndicator = promptsTabScrollIndicator
  }

  const providerConfig = await get('provider-config')
  if (providerConfig) {
    config.providers = providerConfig
  }
}
