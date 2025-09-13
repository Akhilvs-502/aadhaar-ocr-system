



import multer from 'multer';

const storage = multer.memoryStorage();

const upload=multer({
    storage,
    limits:{filesize:2 * 1024 * 1024},
    fileFilter:(req,file,cb)=>{
        if(!file.mimetype.startsWith("image/")){
            cb(new Error("only image is allowed"),false)
        }else{
            cb(null,true)
        }
    }
})

export default upload;