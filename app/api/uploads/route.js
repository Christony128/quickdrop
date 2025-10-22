const prisma = require('../../lib/prisma')
const { NextResponse } = require('next/server')

export async function GET() {
  try {
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
    return NextResponse.json({ error: error }, { status: 500 })
  }
}