import { cleanEnv, str, num } from 'envalid'
import { createTransport } from 'nodemailer'
import type { NextApiRequest, NextApiResponse } from 'next'

const env = cleanEnv(process.env, {
  APP_NAME: str(),
  EMAIL_API_TOKEN: str(),
  EMAIL_USER: str(),
  EMAIL_PASSWORD: str(),
  EMAIL_HOST: str(),
  EMAIL_PORT: num()
})

const transporter = createTransport(
  `smtp://${env.EMAIL_USER}:${env.EMAIL_PASSWORD}@${env.EMAIL_HOST}:${env.EMAIL_PORT}`,
  { from: `${env.APP_NAME} <${env.EMAIL_USER}>` }
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.body.token !== env.EMAIL_API_TOKEN) {
      throw new Error('Unauthorized')
    }

    // token, to, from?, subject, text
    const sentMessageInfo = await transporter.sendMail(req.body)
    res.status(200).json(sentMessageInfo)
  } catch (err) {
    res.status(403).json({ error: err.message })
  }
}
