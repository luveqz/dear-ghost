import { getAdaptedPalm2Request } from '@/lib/adapters/palm'

export enum LLMProvider {
  OpenAI,
  Anthropic,
  Google,
}

export enum GoogleModel {
  Palm2TextBison,
}

type SendParams = { prompt: string; provider: LLMProvider; model: GoogleModel }

export default defineNuxtPlugin(() => {
  const { $config } = useNuxtApp()

  return {
    provide: {
      llm: {
        async send({ prompt, provider, model }: SendParams) {
          if (
            provider === LLMProvider.Google &&
            model === GoogleModel.Palm2TextBison
          ) {
            const { url, options } = getAdaptedPalm2Request({
              prompt,
              config: $config.app,
            })

            const response = await $fetch<any>(url, options)

            try {
              return response.candidates[0].output
            } catch (error) {
              console.error(error)
            }
          }
        },
      },
    },
  }
})
