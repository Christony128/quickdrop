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
        
        <div className="relative w-full h-96">
          <img
            src={upload.url}
            alt={upload.name}
            fill="true"
            className="object-contain rounded-lg"
          />
        </div>
        
        <div className="mt-6 space-y-2">
          <p><strong>Type:</strong> {upload.fileType}</p>
          <p><strong>Size:</strong> {(upload.fileSize / 1024 / 1024).toFixed(2)} MB</p>
          <p><strong>Uploaded:</strong> {new Date(upload.createdAt).toLocaleDateString()}</p>
        </div>
        
        <a 
          href={upload.url} 
          target="_blank" 
          className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Open Original
        </a>
      </div>
    </div>
  )
}