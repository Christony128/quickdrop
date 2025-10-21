import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const fileRouter = {
  mediaUploader: f({
    image: { maxFileSize: "4MB" },
  }).onUploadComplete(async ({ file }) => {
    console.log("Uploaded file:", file);
  }),
};
