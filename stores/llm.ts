import { defineStore } from 'pinia'
import { Selection } from '@tiptap/pm/state'
import { Ollama } from 'langchain/llms/ollama'
import { ChatOpenAI } from '@langchain/openai'

import { getAdaptedClaudeInstantRequest } from '@/lib/adapters/claude'
import { LM_STUDIO_API_BASE_URL, OLLAMA_API_BASE_URL } from '@/lib/constants'
import { llamaCpp } from '@/lib/utils/llamacpp'

export enum LLMProvider {
  OpenAI,
  Anthropic,
  Google,
  Ollama,
  LLaMACpp,
  LMStudio,
}

export enum LLaMACppModel {
  Mistral7B,
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

export const PROVIDERS = {
  [LLMProvider.LMStudio]: {
    label: 'LM Studio',
    async getModels() {
      return []
    },
  },
  [LLMProvider.Ollama]: {
    label: 'Ollama',
    async getModels() {
      const models: string[] = []
      async function fetchTags() {
        try {
          const response = await fetch(`${OLLAMA_API_BASE_URL}/api/tags`)
          const data = await response.json()
          return data
        } catch (error) {
          console.error('Error fetching data:', error)
          return []
        }
      }

      models.push(
        ...(await fetchTags()
          .then((tags) => {
            return tags.models.map((model: any) => model.name)
          })
          .catch((error) => {
            console.error(error)
          })),
      )

      return models
    },
  },
}

type SendParams = {
  prompt: string
  provider: LLMProvider
  model: string
  selection: Selection
  controller: Ref<AbortController | undefined>
  insertChunk: (chunk: string) => any
}

export const useLLMStore = defineStore('llm', {
  state: () =>
    ({
      running: false,
    }) as {
      running: Boolean
    },

  actions: {
    async send({
      prompt,
      provider,
      model,
      selection,
      controller,
      insertChunk,
    }: SendParams) {
      this.running = true

      const { $config } = useNuxtApp()
      controller.value = new AbortController()
      const signal = controller.value.signal

      /*
      --------------------------------------------------
        LM Studio
      --------------------------------------------------
      */
      if (provider === LLMProvider.LMStudio) {
        try {
          const lmStudio = new ChatOpenAI({
            temperature: 0.7,
            openAIApiKey: 'N/A',
            streaming: true,
            configuration: {
              baseURL: LM_STUDIO_API_BASE_URL,
            },
          })

          const stream = await lmStudio.stream(prompt, {
            signal,
          })

          for await (const chunk of stream) {
            insertChunk(chunk.content)
          }
        } catch (error) {
          console.error(error)
        }
      }

      /*
      --------------------------------------------------
        LLaMA C++: Mistral 7B
      --------------------------------------------------
      */
      if (provider === LLMProvider.LLaMACpp) {
        try {
          const stream = await llamaCpp({
            prompt,
          })

          for await (const chunk of stream as any) {
            insertChunk(chunk.data.content)
          }
        } catch (error) {
          console.error(error)
        }
      }

      /*
      --------------------------------------------------
        Anthropic: Claude Instant
      --------------------------------------------------
      */
      if (provider === LLMProvider.Anthropic) {
        const { url, options } = getAdaptedClaudeInstantRequest({
          prompt,
          config: $config.app,
        })

        const response = await $fetch<any>(url, options as any)

        try {
          // completion = response['outputs'][0]['data']['text']['raw']
        } catch (error) {
          console.error(error)
        }
      }

      /*
      --------------------------------------------------
        Ollama
      --------------------------------------------------
      */
      if (provider === LLMProvider.Ollama) {
        try {
          const ollama = new Ollama({
            baseUrl: OLLAMA_API_BASE_URL,
            model,
          })

          const stream = await ollama.stream(prompt, {
            signal,
          })

          for await (const chunk of stream as any) {
            insertChunk(chunk)
          }
        } catch (error) {
          console.error(error)
        }
      }

      this.running = false
    },
  },
})
