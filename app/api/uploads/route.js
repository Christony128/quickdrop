const prisma = require('../../lib/prisma')
const { NextResponse } = require('next/server')

export async function GET() {
  try {
    const uploads = await prisma.upload.findMany({
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(uploads)
  } catch(error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}