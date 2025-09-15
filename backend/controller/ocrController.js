import Tesseract from "tesseract.js";
import sharp from "sharp";

export const uploadController = async (req, res) => {
  try {
    console.log("uploading........");

    async function preprocessImage(inputBuffer) {
      return await sharp(inputBuffer)
        .grayscale()
        .threshold(160) // adjust value if too dark/light
        .toBuffer();
    }

    if (!req.files.front || !req.files.back) {
      return res
        .status(400)
        .json({ message: "front and back images are required" });
    }
    let frontBuffer = req.files.front[0].buffer;
    let backBuffer = req.files.back[0].buffer;

    frontBuffer = await preprocessImage(frontBuffer);
    backBuffer = await preprocessImage(backBuffer);

    const frontResult = await Tesseract.recognize(frontBuffer, "eng", {
      tessedit_char_whitelist:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,./:- ",
    });

    const backResult = await Tesseract.recognize(backBuffer, "eng", {
      tessedit_char_whitelist:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,./:- ",
    });

    function parseAadhaar(text) {
      let data = {};

      // Aadhaar Number (12 digits, may have spaces)
      let aadhaarMatch = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);
      if (aadhaarMatch)
        data.aadhaarNumber = aadhaarMatch[0].replace(/\s+/g, "");

      // DOB or Year of Birth
      let dobMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);
      if (dobMatch) data.dob = dobMatch[0];
      else {
        let yobMatch = text.match(/Year of Birth\s*:? (\d{4})/i);
        if (yobMatch) data.yob = yobMatch[1];
      }

      // Gender
      if (/male/i.test(text)) data.gender = "Male";
      else if (/female/i.test(text)) data.gender = "Female";

      // Name (trickier – often appears above DOB)
      let lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/(DOB|Year of Birth)/i) && i > 0) {
          data.name = lines[i - 1]; // previous line is likely the name
          break;
        }
      }

      function cleanAddress(raw) {
        // First, replace common errors
        let cleaned = raw
          .toUpperCase()
          .replace(/0/g, "O")
          .replace(/1/g, "I")
          .replace(/RN/g, "M") // Note: using uppercase because we converted to upper
          .replace(/rn/g, "m")
          .replace(/[|«§»“”‘’]/g, " ") // remove junk symbols
          .replace(/\s+/g, " ") // collapse spaces
          .replace(/\s,/g, ",") // remove space before comma
          .replace(/,\s*/g, ", ") // standardize comma spacing
          .trim();

        // Remove any non-address characters (keep letters, digits, spaces, commas, slashes, hyphens)
        cleaned = cleaned.replace(/[^A-Z0-9\s,\/\-]/g, " ");

        // Now, split into tokens by space and comma
        let tokens = cleaned
          .split(/[\s,]+/)
          .filter((token) => token.length > 0);

        // Filter out junk tokens (less than 2 characters, unless it's 'PO' or part of 'S/O')
        // Also, we can have a blacklist of junk words
        const junkWords = [
          "SRR",
          "NT",
          "LT",
          "AE",
          "RY",
          "SVE",
          "AHI",
          "RE",
          "RI",
          "PER",
          "A",
          "TT",
          "RR",
          "=",
        ];
        tokens = tokens.filter((token) => {
          // Keep tokens that are at least 2 characters, unless they are 'PO'
          if (token.length === 1 && token !== "A" && token !== "I")
            return false;
          if (junkWords.includes(token)) return false;
          return true;
        });

        // Reassemble the tokens with comma and space
        return tokens.join(", ");
      }

      function trimAfterPincode(line) {
        return line.replace(/(\b\d{6}\b).*/, "$1");
      }

      function extractAddress(text) {
        const lines = text
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);

        let start = lines.findIndex((l) => /address/i.test(l));

        let pin = lines.findIndex((l) => /\b\d{6}\b/.test(l));

        if (start === -1 || pin === -1) return null;

        console.log("start found-end", start, pin, lines[pin]);
        // Clean the pincode line so junk after pincode is removed
        lines[pin] = trimAfterPincode(lines[pin]);

        const rawBlock = lines.slice(start, pin + 1).join(", ");
        return cleanAddress(rawBlock);
      }

      data.address = extractAddress(text);
      console.log(data, "data");

      return data;
    }

    let parsedData = {
      ...parseAadhaar(frontResult.data.text),
      ...parseAadhaar(backResult.data.text),
    };

    res.status(200).json({
      message: "ocr successful",
      data: parsedData,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

