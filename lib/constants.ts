/*--------------------------------------------------
  User Config
--------------------------------------------------*/
export const defaultConfig = {
  view: {
    fileTree: false,
    actionPanel: true,
    stickyTitle: false,
    indent: true,
    installButton: true,
    promptsTabScrollIndicator: true,
  },
  providers: {
    anthropic: {
      apiKey: '',
    },
    lmStudio: {
      port: '1234',
    },
    ollama: {
      host: 'http://localhost:11434',
    },
  },
}

/*--------------------------------------------------
  Ollama
--------------------------------------------------*/
export const OLLAMA_API_BASE_URL = 'http://localhost:11434'
