import { PALM_API_SAFETY_SETTINGS } from '@/lib/constants'
import { NitroRuntimeConfigApp } from 'nitropack'

export function getAdaptedPalm2Request({
  prompt,
  config,
}: {
  prompt: string
  // TODO: add proper type
  config: NitroRuntimeConfigApp
}) {
  const url = `${config.PALM_2_API_BASE_URL}?key=${config.PALM_2_API_KEY}`

  // TODO: add proper type or use a different http client
  const options: any = {
    method: 'post',
    body: {
      prompt: {
        text: prompt,
      },
      safetySettings: PALM_API_SAFETY_SETTINGS,
    },
  }

  return {
    url,
    options,
  }
}
