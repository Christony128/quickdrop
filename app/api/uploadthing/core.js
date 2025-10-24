import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const fileRouter = {
  mediaUploader: f({
    image: { maxFileSize: "10MB" },
    maxFileCount:1,
  }).onUploadComplete(async ({ file }) => {
    console.log("File uploaded:", file.name);
  }),
};