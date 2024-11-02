<template>
  <div class="home-page px-5">
    <nav
      class="max-w-home-container mx-auto mt-4 flex w-full items-center justify-between py-2"
    >
      <LogoIcon />

      <ul class="flex items-center gap-6 font-medium md:gap-10 md:text-lg">
        <a class="hidden sm:block" href="#features">Features</a>

        <div class="flex items-center gap-5">
          <a
            class="rounded border border-orange-gray-900/20 px-4 py-2"
            href="https://www.patreon.com/dearghost"
          >
            Patreon
          </a>

          <a
            href="https://github.com/luveqz/dear-ghost"
            target="_blank"
            rel="noreferrer"
          >
            <SolidGitHubIcon />
          </a>

          <a
            href="https://discord.gg/y4RvGKEtaF"
            target="_blank"
            rel="noreferrer"
          >
            <SolidDiscordIcon />
          </a>
        </div>
      </ul>
    </nav>

    <header class="flex flex-col items-center text-center">
      <h1
        class="mb-8 mt-14 max-w-[19rem] text-2xl font-medium leading-tight sm:mt-20 sm:max-w-[36.5rem] sm:text-[1.825rem] lg:mt-36 lg:text-[2.125rem]"
      >
        The open-source text editor for creative writing with language models
      </h1>

      <HomeLink href="/app">
        <span class="text-orange-300 shrink-0">
          <SolidSparkIcon />
        </span>
        Start Writing
      </HomeLink>

      <p class="font-semiold mt-2.5">
        Or become a
        <a
          class="text-orange-700 underline"
          href="https://www.patreon.com/dearghost"
          >Patreon</a
        >.
      </p>
    </header>

    <section class="max-w-home-container mx-auto mt-14 sm:mt-24 md:mt-40">
      <img
        class="aspect-[2548/1514] w-full overflow-hidden rounded border border-orange-gray-900/20 bg-orange-gray-900/5"
        src="https://res.cloudinary.com/dqsh2vhxj/image/upload/v1709427371/dear-ghost-website/Frame_286_4_1_pq8ehv.png"
        alt=" screenshot of the text editor UI"
      />
    </section>

    <section id="features" class="max-w-home-container mx-auto pt-14 sm:pt-24">
      <h2 class="text-center text-2xl font-bold sm:text-[1.85rem] md:text-4xl">
        Features
      </h2>

      <ul
        class="mt-8 grid gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-6 sm:text-lg lg:grid-cols-3 lg:gap-11"
      >
        <HomeFeature> Works offline. </HomeFeature>

        <HomeFeature>
          Supports
          <a
            class="text-blue-600"
            href="https://lmstudio.ai/"
            target="_blank"
            rel="noreferrer"
            >LM Studio</a
          >
          and
          <a
            class="text-blue-600"
            href="https://ollama.ai"
            target="_blank"
            rel="noreferrer"
            >Ollama</a
          >.
        </HomeFeature>

        <HomeFeature> Prompt templates. </HomeFeature>
        <HomeFeature> Prompt library. </HomeFeature>

        <HomeFeature>
          Works with <strong>local files</strong>.
          <span class="text-blue-600">*</span>
        </HomeFeature>

        <HomeFeature> No hidden prompt enginering. </HomeFeature>

        <HomeFeature>
          <strong>Focus</strong> and <strong>Night</strong> mode.
          <span class="text-blue-600">**</span>
        </HomeFeature>

        <HomeFeature>
          Integrated LLM <strong>chat</strong>.
          <span class="text-blue-600">**</span>
        </HomeFeature>

        <HomeFeature>
          Installable. <span class="text-blue-600">**</span>
        </HomeFeature>
      </ul>

      <div
        class="mt-8 flex flex-col gap-y-3 rounded bg-orange-gray-900/5 p-3 text-sm sm:mt-12 sm:px-6 sm:py-5 sm:text-base"
      >
        <p>
          <span class="text-blue-600">*</span>
          Dear Ghost doesn’t store your stories outside of your computer.
        </p>
        <p>
          <span class="text-blue-600">**</span>
          Some of the features on the "summer" roadmap.
        </p>
      </div>
    </section>

    <section class="flex items-center justify-center gap-6 pt-14 sm:pt-20">
      <HomeLink href="https://www.patreon.com/dearghost">
        <span class="text-orange-300 shrink-0">
          <SolidSparkIcon />
        </span>
        Become a Patreon
      </HomeLink>

      <p class="font-semiold mt-2.5">
        Or explore the
        <a class="text-orange-700 underline" href="/app">app</a> first.
      </p>
    </section>

    <footer class="pb-6 pt-14 text-sm sm:pt-20 sm:text-base">
      <p class="text-center leading-normal">
        Designed and built with
        <span
          aria-label="love"
          class="mt-0.5 inline-flex w-auto text-orange-500"
        >
          <SolidHeartIcon /> </span
        >.
      </p>
    </footer>
  </div>
</template>

<style scoped>
/*-------------------------------------
  General
-------------------------------------*/
.home-page {
  @apply text-orange-gray-900;
}

strong {
  @apply font-bold;
}

/*-------------------------------------
  Tailwind Extensions
-------------------------------------*/
.underline {
  text-underline-offset: 1.5px;
  text-decoration-thickness: 1px;
}
</style>
