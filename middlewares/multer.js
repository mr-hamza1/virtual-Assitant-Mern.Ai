import multer from 'multer'


const storage = multer.memoryStorage(); // not diskStorage

const upload = multer({ storage });

export { upload };
