import Anthropic from '@anthropic-ai/sdk'
import express from 'express'
import cors from 'cors'
const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

app.post('/api/generate', async (req, res) => {
  const apiKey = req.body.apiKey
  const prompt = req.body.prompt
  const model = req.body.model

  const anthropic = new Anthropic({
    apiKey,
  })

  const stream = await anthropic.messages.create({
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    model,
    stream: true,
  })

  for await (const messageStreamEvent of stream) {
    if (messageStreamEvent?.delta?.text) {
      res.write(messageStreamEvent?.delta?.text)
    }
  }

  res.end()
})

app.listen(port, () => {
  console.log('[*] Anthropic endpoint running')
})

export default app

export const config = {
  supportsResponseStreaming: true,
}
