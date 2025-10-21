import { generateReactHelpers } from "@uploadthing/react"
import { fileRouter } from "../api/uploadthing/core"

export const { useUploadThing } = generateReactHelpers({
  router: fileRouter,
})