const prisma = require('../../lib/prisma')
const { NextResponse } = require('next/server')

export async function POST(request) {
  try {
    const { name, url, fileType, fileSize, expiry } = await request.json()
    
    const expiresAt = new Date();
    if(expiry === '10m') expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    else if(expiry === '1h') expiresAt.setHours(expiresAt.getHours() + 1);
    else if(expiry === '1d') expiresAt.setHours(expiresAt.getHours() + 24);
    
    const upload = await prisma.upload.create({
      data: {
        name,
        url,
        fileType,
        fileSize,
        expiresAt
      }
    });
    
    return NextResponse.json({ success: true, id: upload.id });
  } catch(error) {
    console.error("Save upload error:", error);
    return NextResponse.json({ error: "Failed to save upload" }, { status: 500 });
  }
}