

import Tessaract from 'tesseract.js'



export const uploadController =async (req, res) => {


    try {
        console.log("uploading........");
        
        if (!req.files.front || !req.files.back) {
            return res.status(400).json({ message: "front and back images are required" })
        }
        const frontBuffer = req.files.front[0].buffer;
        const backBufffer = req.files.back[0].buffer

        const frontResult = await Tessaract.recognize(frontBuffer, 'eng')
        const backResult = await Tessaract.recognize(backBufffer, 'eng')



        res.status(200).json({
            message: "ocr successful",
            data: {
                front: frontResult.data.text,
                back: backResult.data.text
            }
        })

    }

    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }


}