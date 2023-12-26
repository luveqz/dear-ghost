export const OLLAMA_API_BASE_URL = 'http://localhost:11434'

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
