/*
--------------------------------------------------
  LM Studio
--------------------------------------------------
*/
export const LM_STUDIO_API_BASE_URL = 'http://localhost:1234/v1'

/*
--------------------------------------------------
  LLaMA C++ / HuggingFace / Local
--------------------------------------------------
*/
export const MISTRAL_7B_FILENAME = 'mistral-7b-v0.1.Q4_K_M.gguf'
export const LLAMACPP_API_PORT = '11432'
export const LLAMACPP_API_BASE_URL = `http://localhost:${LLAMACPP_API_PORT}`

/*
--------------------------------------------------
  Ollama
--------------------------------------------------
*/
export const OLLAMA_API_BASE_URL = 'http://localhost:11434'

/*
--------------------------------------------------
  Clarifai
--------------------------------------------------
*/
export const CLARIFAI_API_BASE_URL = 'https://api.clarifai.com/v2/models/'

/*
--------------------------------------------------
  Google: Palm 2
--------------------------------------------------
*/
export const PALM_2_API_BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText'

export const PALM_API_SAFETY_SETTINGS = [
  {
    category: 'HARM_CATEGORY_DEROGATORY',
    threshold: 'BLOCK_NONE',
  },
  {
    category: 'HARM_CATEGORY_TOXICITY',
    threshold: 'BLOCK_NONE',
  },
  {
    category: 'HARM_CATEGORY_VIOLENCE',
    threshold: 'BLOCK_NONE',
  },
  {
    category: 'HARM_CATEGORY_SEXUAL',
    threshold: 'BLOCK_NONE',
  },
  {
    category: 'HARM_CATEGORY_MEDICAL',
    threshold: 'BLOCK_NONE',
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS',
    threshold: 'BLOCK_NONE',
  },
]
