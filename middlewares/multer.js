import multer from 'multer'

const multerUpload = multer({
    limits: {
        fileSize: 1024 * 1024 * 10
    },
})

const singleUpload = multerUpload.single('photo');

// const attachmentMulter = multerUpload.array("files" , 5);


const storage = multer. diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public")
    },
    filename:( req , file, callback) => {
        callback( null, file.originalname)
    }
})

const upload = multer({storage})

export { singleUpload, upload };
