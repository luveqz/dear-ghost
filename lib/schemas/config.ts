import { z } from 'zod'

const configSchema = z.object({
  view: z.object({
    fileTree: z.boolean(),
    actionPanel: z.boolean(),
    stickyTitle: z.boolean(),
    indent: z.boolean(),
    installButton: z.boolean(),
    promptsTabScrollIndicator: z.boolean(),
  }),
  providers: z.object({
    anthropic: z.object({
      apiKey: z.string(),
    }),
    lmStudio: z.object({
      port: z.string(),
    }),
    ollama: z.object({
      host: z.string(),
    }),
  }),
})

export type UserConfig = z.infer<typeof configSchema>
export default configSchema
