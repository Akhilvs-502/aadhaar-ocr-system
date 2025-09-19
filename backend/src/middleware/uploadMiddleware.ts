


import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // note: fileSize (not filesize)
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
});

export default upload;
