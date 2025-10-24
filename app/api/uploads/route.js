const prisma = require('../../lib/prisma')
const { NextResponse } = require('next/server')
const { UTApi } = require('uploadthing/server')

const utapi = new UTApi()

export async function GET() {
  try {
    // Find expired uploads first
    const expiredUploads = await prisma.upload.findMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    
    // Delete from UploadThing
    for (const upload of expiredUploads) {
      try {
        // Extract file key from URL
        // UploadThing URLs look like: https://utfs.io/f/FILE_KEY
        const fileKey = upload.url.split('/f/')[1]
        if (fileKey) {
          await utapi.deleteFiles([fileKey])
          console.log(`Deleted file ${fileKey} from UploadThing`)
        }
      } catch (error) {
        console.error(`Failed to delete file from UploadThing:`, error)
      }
    }
    
    // Delete from database
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