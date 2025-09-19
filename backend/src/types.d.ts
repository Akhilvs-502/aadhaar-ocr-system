import { Request } from "express";

// types/multer.d.ts
import { Request } from 'express';
import { File } from 'multer';

export interface MulterFiles {
  front?: File[];
  back?: File[];
}

// Extend Express Request
export interface MulterRequest extends Request {
  files?: MulterFiles;
}
