<script setup lang="ts">
const template = `Make really embarrassing questions about this text:

{{ selected_text }}`
</script>
<template>
  <div class="max-w-[29rem] rounded bg-white p-12 text-sm-2 leading-[140%]">
    <p class="mb-4 text-2xl font-bold">Prompt Templates</p>

    <div class="flex flex-col gap-y-5">
      <p>
        When you push a prompt button, the content of its “template” field gets
        sent to the language model. It’s like sending a single message to
        ChatGPT.
      </p>

      <p>
        The response of the model is then inserted where your cursor was when
        you pushed the button.
      </p>

      <p>
        If you use the
        <span v-pre class="rounded bg-black/10 p-0.5 px-1 text-black/45"
          >{{ <span class="font-bold text-black"> selected_text </span> }}</span
        >
        mark, it'll get replaced with your current selection.
      </p>

      <p class="italic underline"> Example: </p>

      <BaseSnippet :code="template" big />
    </div>
  </div>
</template>
