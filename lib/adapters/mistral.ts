import { LLAMACPP_API_BASE_URL } from '@/lib/constants'

export function getAdaptedMistral7BRequest({ prompt }: { prompt: string }) {
  const options = {
    method: 'POST',
    body: {
      prompt,
      n_predict: 128,
    },
  }

  return {
    url: `${LLAMACPP_API_BASE_URL}/completion`,
    options,
  }
}
