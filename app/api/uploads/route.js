const prisma = require('../../lib/prisma')
const { NextResponse } = require('next/server')
const { UTApi } = require('uploadthing/server')

const utapi = new UTApi()

export async function GET() {
  try {
    const expiredUploads = await prisma.upload.findMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    for (const upload of expiredUploads) {
      try {
        const fileKey = upload.url.split('/f/')[1]
        if (fileKey) {
          await utapi.deleteFiles([fileKey])
          console.log(`Deleted file ${fileKey} from UploadThing`)
        }
      } catch (error) {
        console.error(`Failed to delete file from UploadThing:`, error)
      }
    }
    await prisma.upload.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    
    const uploads = await prisma.upload.findMany({
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(uploads)
  } catch(error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
