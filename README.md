Quickdrop  
Demo Video: https://youtu.be/OtnVDvOAuWQ?si=hnQa3bGuYK7EIioW  
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
Prisma- https://www.prisma.io/docs/getting-started/
First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Drag or drop an image to the dropzone, choose the expiry time and press upload.

The image will be visible along with other uploaded files at the bottom of the page, click on an image to access its page. The page features attributes of the image like the size in mb, the time remaining till expiry in seconds and the link to the original image (this will not expire as long as the actual uploadthing service still has it). When the landing page is reloaded, it will delete all records of stored files that are past the expiry and display only the valid ones.
