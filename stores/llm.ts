import { defineStore } from 'pinia'
import { getAdaptedPalm2Request } from '@/lib/adapters/palm'
import { getAdaptedClaudeInstantRequest } from '@/lib/adapters/claude'

export enum LLMProvider {
  OpenAI,
  Anthropic,
  Google,
}

export enum GoogleModel {
  Palm2TextBison,
}

export enum AnthropicModel {
  ClaudeInstant,
}

type SendParams = {
  prompt: string
  provider: LLMProvider
  model: GoogleModel | AnthropicModel
}

export const useLLMStore = defineStore('llm', {
  state: () =>
    ({
      running: false,
    }) as {
      running: Boolean
    },

  actions: {
    async send({ prompt, provider, model }: SendParams) {
      this.running = true
      let completion

      const { $config } = useNuxtApp()

      /*
      --------------------------------------------------
        Google: Palm 2
      --------------------------------------------------
      */
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
          completion = response.candidates[0].output
        } catch (error) {
          console.error(error)
        }
      }

      /*
      --------------------------------------------------
        Anthropic: Claude Instant
      --------------------------------------------------
      */
      if (
        provider === LLMProvider.Anthropic &&
        model === AnthropicModel.ClaudeInstant
      ) {
        const { url, options } = getAdaptedClaudeInstantRequest({
          prompt,
          config: $config.app,
        })

        const response = await $fetch<any>(url, options)

        try {
          completion = response['outputs'][0]['data']['text']['raw']
        } catch (error) {
          console.error(error)
        }
      }

      this.running = false
      return completion
    },
  },
})
