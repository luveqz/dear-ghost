<script setup lang="ts">
const providers = [
  {
    id: 0,
    label: 'LM Studio',
  },
  {
    id: 1,
    label: 'Ollama',
  },
]
const selectedProvider = ref(providers[0])
</script>

<template>
  <div class="max-w-[32.5rem] rounded bg-white p-12 text-sm-2 leading-[140%]">
    <p class="mb-4 text-2xl font-bold">Almost there!</p>

    <p>
      In order to run prompts, Dear Ghost needs you to have one of these local
      LLM providers installed and running:
    </p>
    <ul class="list-disc pl-5 pt-4">
      <li>
        <a
          class="text-blue-600"
          href="https://lmstudio.ai"
          target="_blank"
          rel="no-referrer"
        >
          LM Studio
        </a>
        (recommended)
      </li>
      <li>
        or
        <a
          class="text-blue-600"
          href="https://ollama.com"
          target="_blank"
          rel="no-referrer"
        >
          Ollama
        </a>
      </li>
    </ul>

    <div class="flex items-baseline gap-x-1.5 pt-7 text-lg font-bold">
      Using
      <ProviderSelect v-model="selectedProvider" :options="providers" />
    </div>

    <template v-if="selectedProvider.label === 'Ollama'">
      <ol class="list-inside list-decimal py-4">
        <li>Download and install Ollama.</li>
        <li>Open a terminal and run:</li>

        <BaseSnippet code="OLLAMA_ORIGINS=*.dearghost.co ollama serve" />

        <li>In a different terminal, download your model:</li>

        <BaseSnippet code="ollama pull mistral" />
      </ol>

      <p>
        Now Dear Ghost should be able to call Ollama models when you select it
        as a provider in your prompt button's config.
      </p>
      <!-- 
      <p class="pt-4">
        Here is <a class="text-blue-600" href="#">video tutorial</a> :)
      </p> -->
    </template>

    <template v-if="selectedProvider.label === 'LM Studio'">
      <ol class="list-decimal py-4 pl-5 leading-[164%]">
        <li>Download and install LM Studio.</li>
        <li>Open LM Studio.</li>
        <li>Download your favorite model.</li>
        <li>Click the <strong>Local Server</strong> tab on the left.</li>
        <li
          >Within <strong>Server Options</strong>, enable
          <strong>CORS</strong>.</li
        >
        <li
          >Make sure the <strong>Server Port</strong> option is set to
          "1234".</li
        >
        <li>Click <strong>Start Server</strong>.</li>
      </ol>

      <p>
        Now Dear Ghost should be able to call LLM Studio models when you select
        it as a provider in your prompt button's config.
      </p>
    </template>
  </div>
</template>
