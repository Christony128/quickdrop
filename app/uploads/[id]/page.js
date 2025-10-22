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
  const upload = await getUpload(params.id)
  
  if (!upload) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
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
          <p><strong>Time Remaining: </strong>{((upload.expiresAt-new Date())/1000)} seconds</p>
          <p><strong>Link:</strong> <a className="text-blue-600 hover:underline" href={upload.url}>{upload.url}</a></p>
        </div>
        
        
      </div>
    </div>
  )
}