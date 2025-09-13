

import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { uploadController } from '../controller/ocrController.js';









const router=express.Router();


router.post('/upload',
    upload.fields([{name:'front'},{name:'back'}]),uploadController)

export default router;


