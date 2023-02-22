import nextConnect from "next-connect";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const apiRoute = nextConnect({
  onError(error, req: NextApiRequest, res: NextApiResponse) {
    res
      ?.status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array("theFiles"));

apiRoute.post( async(req, res) => {
    const file = (req as NextApiRequest & { files: any[] }).files?.[0]
  console.log();
  const prisma = new PrismaClient()
  const posts = await prisma.files.create({
    data:{
        filename:file.filename,
        originalname:file.originalname,
        path:file.path,
        mimetype:file.mimetype,
        size:file.size,
    }
  })
  res.status(200).json({ data: "success" });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
