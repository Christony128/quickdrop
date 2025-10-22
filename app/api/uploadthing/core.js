import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const fileRouter = {
  mediaUploader: f({
    image: { maxFileSize: "10MB" },
  }).onUploadComplete(async ({ file }) => {
    console.log("File uploaded:", file.name);
  }),
};