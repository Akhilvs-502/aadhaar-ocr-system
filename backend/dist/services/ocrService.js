"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrService = void 0;
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const sharp_1 = __importDefault(require("sharp"));
const aadhaarParser_js_1 = require("../utils/aadhaarParser.js"); // use .js after compilation
class OcrService {
    async preprocessImage(inputBuffer) {
        return (0, sharp_1.default)(inputBuffer)
            .grayscale()
            .threshold(160)
            .toBuffer();
    }
    async processAadhaar(frontBuffer, backBuffer) {
        frontBuffer = await this.preprocessImage(frontBuffer);
        backBuffer = await this.preprocessImage(backBuffer);
        const frontResult = await tesseract_js_1.default.recognize(frontBuffer, "eng", {
            // @ts-ignore
            tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,./:- ",
        });
        const backResult = await tesseract_js_1.default.recognize(backBuffer, "eng", {
            // @ts-ignore
            tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,./:- ",
        });
        return {
            ...aadhaarParser_js_1.AadhaarParser.parse(frontResult.data.text),
            ...aadhaarParser_js_1.AadhaarParser.parse(backResult.data.text),
        };
    }
}
exports.OcrService = OcrService;
