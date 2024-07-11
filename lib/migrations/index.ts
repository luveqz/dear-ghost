import { get, set } from 'idb-keyval'

import type { UserConfig } from '@/lib/schemas/config'
import { migrateDeprecatedIdbKeys } from './idb'

export const migrations = [
  {
    name: '2024-07-11-deprecated-idb-keys',
    migrate: migrateDeprecatedIdbKeys,
  },
]

export async function runMigrations(config: UserConfig) {
  const executedMigrations = ((await get('migrations')) as string[]) || []
  let haveBeenRun = false

  for (const migration of migrations) {
    const hasBeenRun = executedMigrations?.includes(migration.name)

    if (!hasBeenRun) {
      console.log(`[*] Running migration: ${migration.name}`)
      await migration.migrate(config)

      executedMigrations?.push(migration.name)
      await set('migrations', executedMigrations)
      haveBeenRun = true
    }
  }

  return haveBeenRun
}
