// route.ts

import { NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { env } from "@/env"

interface FormDataFile {
  name: string
  arrayBuffer(): Promise<ArrayBuffer>
}

const s3Client = new S3Client({
  region: env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY!,
  },
})

async function uploadFileToS3(
  fileBuffer: Buffer,
  fileName: string
): Promise<string> {
  const params = {
    Bucket: env.AWS_S3_BUCKET_NAME!,
    Key: `${fileName}`,
    Body: fileBuffer,
    ContentType: "xslx",
  }

  const command = new PutObjectCommand(params)
  await s3Client.send(command)
  return fileName
}

export async function POST(request: Request): Promise<any> {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as FormDataFile[]

    if (files.length === 0) {
      return NextResponse.json(
        { error: "At least one file is required." },
        { status: 400 }
      )
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const fileName = await uploadFileToS3(buffer, file.name)
      return fileName
    })

    const fileNames = await Promise.all(uploadPromises)

    return NextResponse.json({ success: true, fileNames })
  } catch (error) {
    return NextResponse.json({ error })
  }
}
