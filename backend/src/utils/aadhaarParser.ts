


export class AadhaarParser {
    static parse(text: string) {
        const data: any = {};

        // Aadhaar number
        const aadhaarMatch = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);
        if (aadhaarMatch) data.aadhaarNumber = aadhaarMatch[0].replace(/\s+/g, "");

        // DOB / YOB
        const dobMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);
        if (dobMatch) data.dob = dobMatch[0];
        else {
            const yobMatch = text.match(/Year of Birth\s*:? (\d{4})/i);
            if (yobMatch) data.yob = yobMatch[1];
        }

        // Gender
        if (/male/i.test(text)) data.gender = "Male";
        else if (/female/i.test(text)) data.gender = "Female";

        // Name
        const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].match(/(DOB|Year of Birth)/i) && i > 0) {
                data.name = lines[i - 1];
                break;
            }
        }

        // Address
        data.address = this.extractAddress(text);

        return data;
    }

    private static cleanAddress(raw: string): string {
        // Normalize common OCR errors and symbols
        let cleaned = raw
            .toUpperCase()
            .replace(/0/g, "O")
            .replace(/1/g, "I")
            .replace(/RN/g, "M")
            .replace(/[|«§»“”‘’]/g, " ") // remove weird symbols
            .replace(/\s+/g, " ")         // collapse multiple spaces
            .replace(/\s,/g, ",")         // remove space before comma
            .replace(/,\s*/g, ", ")       // standardize comma spacing
            .trim();

        // Remove any remaining non-address characters
        cleaned = cleaned.replace(/[^A-Z0-9\s,\/\-]/g, " ");

        // List of known junk words
        const junkWords = ["SRR", "NT", "LT", "AE", "RY", "SVE", "AHI", "RE", "RI", "PER", "TT", "RR", "=", "--"];

        // List of valid short forms to keep
        const validShortForms = ["ST", "RD", "LN", "DR", "PO"];

        // Split into tokens and filter
        const tokens = cleaned.split(/[\s,]+/).filter(token => {
            if (junkWords.includes(token)) return false;                // remove junk
            if (validShortForms.includes(token)) return true;          // keep valid short forms
            if (/^\d+[A-Z]*$/.test(token)) return true;               // keep numbers like 12, 45A
            if (token.length >= 3) return true;                        // keep words of length >= 3
            return false;                                               // remove everything else
        });

        return tokens.join(", ");
    }


    private static trimAfterPincode(line: string): string {
        return line.replace(/(\b\d{6}\b).*/, "$1");
    }

    private static extractAddress(text: string): string | null {
        const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

        const start = lines.findIndex(l => /address/i.test(l));
        const pin = lines.findIndex(l => /\b\d{6}\b/.test(l));

        if (start === -1 || pin === -1) return null;

        lines[pin] = this.trimAfterPincode(lines[pin]);

        return this.cleanAddress(lines.slice(start, pin + 1).join(", "));
    }
}
