import nextConnect from "next-connect";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
import * as fs from "fs";
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});
const name = String(Date.now())

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

apiRoute.use(
  upload.array("theFiles"),
  async (req: NextApiRequest, res: NextApiResponse, next) => {
    const {
      filename: image,
      path,
      destination,
    } = (req as NextApiRequest & { files: any[] }).files?.[0];
    console.log([path, image, destination]);
    await sharp(path)
      .webp()
      .toFile("public\\uploads\\" + `${name}.webp`);
    fs.unlinkSync(path);
    next();
  }
);

apiRoute.post(async (req, res) => {
  const file = (req as NextApiRequest & { files: any[] }).files?.[0];
  const prisma = new PrismaClient();
  const {size,} = fs.statSync("public\\uploads\\" + `${name}.webp`);
  const posts = await prisma.files.create({
    data: {
      // filename: file.filename,
      filename: `${name}.webp`,
      originalname: file.originalname,
      // path: file.path,
      path: "public\\uploads\\" + `${name}.webp`,
      // mimetype: file.mimetype,
      mimetype: 'image/webp',
      // size: file.size,
      size: size,
    },
  });
  res.status(200).json({ data: "success" });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
