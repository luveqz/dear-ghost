import { defineStore } from 'pinia'
import { Ollama } from 'langchain/llms/ollama'
import { getAdaptedPalm2Request } from '@/lib/adapters/palm'
import { getAdaptedClaudeInstantRequest } from '@/lib/adapters/claude'
import { OLLAMA_API_BASE_URL } from '@/lib/constants'

export enum LLMProvider {
  OpenAI,
  Anthropic,
  Google,
  Ollama,
}

export enum GoogleModel {
  Palm2TextBison,
}

export enum AnthropicModel {
  ClaudeInstant,
}

export enum OllamaModel {
  Mistral,
}

type SendParams = {
  prompt: string
  provider: LLMProvider
  model: GoogleModel | AnthropicModel | OllamaModel
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

        const response = await $fetch<any>(url, options as any)

        try {
          completion = response['outputs'][0]['data']['text']['raw']
        } catch (error) {
          console.error(error)
        }
      }

      /*
      --------------------------------------------------
        Ollama: Mistral 7B
      --------------------------------------------------
      */
      if (provider === LLMProvider.Ollama && model === OllamaModel.Mistral) {
        try {
          const ollama = new Ollama({
            baseUrl: OLLAMA_API_BASE_URL,
            model: 'mistral',
          })

          const stream = await ollama.stream(prompt)

          const chunks = []
          for await (const chunk of stream) {
            chunks.push(chunk)
          }

          completion = chunks.join('')
        } catch (error) {
          console.error(error)
        }
      }

      this.running = false
      return completion
    },
  },
})
