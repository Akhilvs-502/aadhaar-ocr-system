import { Request, Response } from "express";
import { OcrService } from "../services/ocrService";
import { MulterFiles, MulterRequest } from "../types";

const ocrService = new OcrService();

export const uploadController = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as MulterFiles;
    if (!files?.front || !files?.back) {
      res.status(400).json({ message: "front and back images are required" });
      return;
    }

    const frontBuffer = files.front[0].buffer;
    const backBuffer = files.back[0].buffer;

    const parsedData = await ocrService.processAadhaar(frontBuffer, backBuffer);

    if(!parsedData.name || !parsedData.aadhaarNumber){

      res.status(400).json({
        message: "validation failed",
        errors: [
          !parsedData.name ? "Name not found" : null,
          !parsedData.aadhaarNumber ? "Aadhaar number not found" : null,
        ],
      });
      return;
    }

    res.status(200).json({
      message: "ocr successful",
      data: parsedData,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
