import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const fileRouter = {
  mediaUploader: f({
    image: { maxFileSize: "4MB" },
  }).onUploadComplete(async ({ file }) => {
    console.log("File uploaded:", file);
    
    try {
      const prismaModule = await import('../../lib/prisma.js');
      const prisma = prismaModule.default;
      
      await prisma.upload.create({
        data: {
          name: file.name,
          url: file.url,
          fileType: file.type || 'image',
          fileSize: file.size
        }
      });
      
      console.log("Saved to database");
    } catch (error) {
      console.error("Database save failed:", error.message);
    }
  }),
};