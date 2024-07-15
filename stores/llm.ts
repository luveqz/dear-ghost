import { defineStore } from 'pinia'
import { Ollama } from 'langchain/llms/ollama'
import { ChatOpenAI } from '@langchain/openai'

import { OLLAMA_API_BASE_URL } from '@/lib/constants'
import { useToast } from '@/composables/toast'
import { useStatusBarMessage } from '@/composables/status-bar'

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
  [LLMProvider.Anthropic]: {
    label: 'Anthropic',
    async getModels() {
      return ['claude-3-haiku-20240307', 'claude-2.0', 'claude-instant-1.2']
    },
  },
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
      controller,
      insertChunk,
    }: SendParams) {
      this.running = true
      const { resetStatusBarMessage } = useStatusBarMessage({
        message: 'Running model...',
        manualReset: true,
      })

      const { $config, $editor } = useNuxtApp()
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
              baseURL: `http://localhost:${$editor.config.providers.lmStudio.port}/v1`,
            },
            maxRetries: 1,
            timeout: 250,
          })

          const stream = await lmStudio.stream(prompt, {
            signal,
          })

          let index = 0
          for await (const chunk of stream) {
            if (index === 0) {
              insertChunk('\n- - -\n')
            }
            insertChunk(chunk.content)
            index++
          }
        } catch (error) {
          if (
            ['Connection error.', 'Request timed out.'].includes(
              (error as Error).message,
            )
          ) {
            useToast({
              message: 'Seems like LM Studio’s server is not running.',
              duration: 6,
              seeMoreModalId: 'setup-llm-provider',
              ctaText: 'Install',
              icon: 'unplug',
            })
          } else {
            useToast({ message: 'Connection error.' })
          }
        }
      }

      /*
      --------------------------------------------------
        Anthropic
      --------------------------------------------------
      */
      if (provider === LLMProvider.Anthropic) {
        if (!$editor.config.providers.anthropic.apiKey) {
          useToast({
            message: 'Please provide an Anthropic API key',
            duration: 6,
            seeMoreModalId: 'config',
            ctaText: 'Config',
            icon: 'unplug',
          })
          this.running = false
          resetStatusBarMessage()
          return
        }

        try {
          const response = await fetch('/api/generate', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              apiKey: $editor.config.providers.anthropic.apiKey,
              prompt,
              model,
            }),
            signal: controller.value.signal,
          })

          const reader = response.body!.getReader()

          let index = 0
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              break
            }

            if (index === 0) {
              insertChunk('\n- - -\n')
            }
            index++

            const chunk = new TextDecoder().decode(value)
            insertChunk(chunk)
          }
        } catch (error) {
          useToast({ message: 'Connection error.' })
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
            baseUrl: $editor.config.providers.ollama.host,
            model,
          })

          const stream = await ollama.stream(prompt, {
            signal,
          })

          let index = 0
          for await (const chunk of stream as any) {
            if (index === 0) {
              insertChunk('\n- - -\n')
            }
            index++
            insertChunk(chunk)
          }
        } catch (error) {
          if (['Failed to fetch'].includes((error as Error).message)) {
            useToast({
              message: 'Seems like Ollama is not running.',
              duration: 6,
              seeMoreModalId: 'setup-llm-provider',
              ctaText: 'Install',
              icon: 'unplug',
            })
          } else {
            useToast({ message: 'Connection error.' })
          }
        }
      }

      this.running = false
      resetStatusBarMessage()
    },
  },
})
