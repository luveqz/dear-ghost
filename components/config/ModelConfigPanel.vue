<template>
  <section class="p-10 px-14">
    <h2 class="text-2xl font-bold">Models</h2>

    <p class="mt-4 leading-[120%]">
      You can connect <strong>Dear Ghost</strong> to different large language
      model providers. These are all the supported ones:
    </p>
  </section>

  <hr class="border-0 border-b-2 border-[#DEE4EB]" />

  <section class="p-10 px-14">
    <h3 class="text-xl font-bold"> Anthropic </h3>

    <p class="mt-4 leading-[120%]">
      The company behind <strong>Claude</strong>, one of the most popular family
      of models within the creative writing space.
    </p>
    <p class="mt-4 leading-[120%]">
      To use Claude through the Dear Ghost interface, you will have to create an
      API key on the
      <a
        class="font-semibold text-blue-600"
        href="https://console.anthropic.com/dashboard"
        >Anthropic Console</a
      >.
    </p>

    <label class="mb-1 mt-5 block font-bold" for="">API key:</label>
    <BaseInput
      variant="medium"
      v-model="$editor.providerConfig.anthropic.apiKey"
      class="w-full max-w-72"
      placeholder="sk-ant-api03-rV97zpCN..."
    />
  </section>

  <hr class="mx-auto max-w-20 border-0 border-b-2 border-[#DEE4EB]" />

  <section class="p-10 px-14">
    <h3 class="text-xl font-bold"> LM Studio </h3>

    <p class="mt-4 leading-[120%]">
      This is an app you can use to download and run models on your laptop.
      <strong>Mistral 7B</strong>
      is one of the many models in their catalog.
    </p>
    <p class="mt-4 leading-[120%]">
      Once you have installed
      <a class="font-semibold text-blue-600" href="https://lmstudio.ai/"
        >LM Studio</a
      >. and downloaded your favorite model, run its local server.
    </p>

    <label class="mb-1 mt-5 block font-bold" for="">Server port:</label>
    <BaseInput
      variant="medium"
      v-model="$editor.providerConfig.lmStudio.port"
      class="w-full max-w-72"
      placeholder="4321"
    />
  </section>

  <hr class="mx-auto max-w-20 border-0 border-b-2 border-[#DEE4EB]" />

  <section class="p-10 px-14 pb-20">
    <h3 class="text-xl font-bold"> Ollama </h3>

    <p class="mt-4 leading-[120%]">
      A command-line tool you can use to download and run models on your laptop.
      <strong>Mistral 7B</strong>
      is one of the many models in their catalog.
    </p>
    <p class="mt-4 leading-[120%]">
      Once you have installed
      <a class="font-semibold text-blue-600" href="https://ollama.com/"
        >Ollama</a
      >. and downloaded your favorite model, run its local server.
    </p>

    <label class="mb-1 mt-5 block font-bold" for="">Server host:</label>
    <BaseInput
      variant="medium"
      v-model="$editor.providerConfig.ollama.host"
      class="w-full max-w-72"
      placeholder="http://localhost:11434"
    />
  </section>
</template>
