"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadController = void 0;
const ocrService_1 = require("../services/ocrService");
const ocrService = new ocrService_1.OcrService();
const uploadController = async (req, res) => {
    try {
        const files = req.files;
        if (!files?.front || !files?.back) {
            res.status(400).json({ message: "front and back images are required" });
            return;
        }
        const frontBuffer = files.front[0].buffer;
        const backBuffer = files.back[0].buffer;
        const parsedData = await ocrService.processAadhaar(frontBuffer, backBuffer);
        if (!parsedData.name || !parsedData.aadhaarNumber) {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
exports.uploadController = uploadController;
