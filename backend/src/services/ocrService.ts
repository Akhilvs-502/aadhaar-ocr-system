import Tesseract from "tesseract.js";
import sharp from "sharp";
import { AadhaarParser } from "../utils/aadhaarParser.js"; // use .js after compilation

export class OcrService {
  private async preprocessImage(inputBuffer: Buffer): Promise<Buffer> {
    return sharp(inputBuffer)
      .grayscale()
      .threshold(160)
      .toBuffer();
  }

  async processAadhaar(frontBuffer: Buffer, backBuffer: Buffer) {
    frontBuffer = await this.preprocessImage(frontBuffer);
    backBuffer = await this.preprocessImage(backBuffer);

 
    const frontResult = await Tesseract.recognize(frontBuffer, "eng", {
      // @ts-ignore
      tessedit_char_whitelist:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,./:- ",
    });

    const backResult = await Tesseract.recognize(backBuffer, "eng", {
      // @ts-ignore
      tessedit_char_whitelist:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,./:- ",
    });

    return {
      ...AadhaarParser.parse(frontResult.data.text),
      ...AadhaarParser.parse(backResult.data.text),
    };
  }
}
