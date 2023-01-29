// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { S3Client } from '@aws-sdk/client-s3'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { body } = req
  const s3 = new S3Client({ region: 'us-west-2' })
  const data = await s3.send(new GetObjectCommand({
    Bucket: 'ds-stt-bucket',
    Key: body
  }))

  const d = await data.Body.transformToString()
  res.status(200).json(JSON.parse(d))
}
