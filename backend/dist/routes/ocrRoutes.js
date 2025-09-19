"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const ocrController_1 = require("../controller/ocrController");
const router = express_1.default.Router();
router.post('/upload', uploadMiddleware_1.default.fields([{ name: 'front' }, { name: 'back' }]), ocrController_1.uploadController);
exports.default = router;
