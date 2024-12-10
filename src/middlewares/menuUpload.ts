import { Request } from "express";
import multer from "multer";
import { BASE_URL } from "../global";

// define storage configuration of menu picture

const storage = multer.diskStorage({
  destination: (
    request: Request,
    file: Express.Multer.File,
    cb: (eror: Error | null, destination: string) => void
  ) => {
    cb(null, `${BASE_URL}/public/menu_picture`);
    // define location of uploud picture, make sure that you have create a public folder in root folder.
    // then create folder "menu-picture" inside of "public folder"
  },
  filename: (
    request: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
  cb(null, `${new Date().getTime().toString()}-${file.originalname}`)
  },
});

const uploadFile = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export default uploadFile;
