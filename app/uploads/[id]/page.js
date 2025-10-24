import { notFound } from 'next/navigation'
import Image from 'next/image'
const prisma = require('../../lib/prisma')

async function getUpload(id) {
  const upload = await prisma.upload.findUnique({
    where: { id }
  })
  return upload
}

export default async function UploadPage({ params }) {
  const { id } = await params;
  const upload = await getUpload(id)
  
  if (!upload) {
    notFound()
  }
  const timeRemaining = Math.max(0, Math.floor((new Date(upload.expiresAt) - new Date()) / 1000))
  const downloadUrl = upload.url

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">{upload.name}</h1>
        <div className="w-full max-h-96 overflow-hidden rounded-lg mb-6">
          <img
            src={upload.url}
            alt={upload.name}
            className="w-full h-auto object-contain"
          />
        </div>
        
        <div className="text-black mt-6 space-y-2">
          <p><strong>Type:</strong> {upload.fileType}</p>
          <p><strong>Size:</strong> {(upload.fileSize / 1024 / 1024).toFixed(2)} MB</p>
          <p><strong>Time Remaining:</strong> {timeRemaining} seconds</p>
          <p><strong>Link:</strong> <a className="text-blue-600 hover:underline" href={downloadUrl}>{downloadUrl}</a></p>
        </div>
      </div>
    </div>
  )
}