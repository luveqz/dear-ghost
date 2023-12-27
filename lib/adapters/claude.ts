import { NitroRuntimeConfigApp } from 'nitropack'
import { CLARIFAI_API_BASE_URL } from '@/lib/constants'

const USER_ID = 'anthropic'
const MODEL_ID = 'claude-instant'
const MODEL_VERSION_ID = '0363c83d073947d4ba2f76df394dd28d'
const APP_ID = 'completion'

export function getAdaptedClaudeInstantRequest({
  prompt,
  config,
}: {
  prompt: string
  // TODO: add proper type
  config: NitroRuntimeConfigApp
}) {
  const url =
    CLARIFAI_API_BASE_URL +
    MODEL_ID +
    '/versions/' +
    MODEL_VERSION_ID +
    '/outputs'

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          text: {
            raw: prompt,
          },
        },
      },
    ],
  })

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Key ' + config.CLARIFAI_API_KEY,
    },
    body: raw,
  }

  return {
    url,
    options,
  }
}
