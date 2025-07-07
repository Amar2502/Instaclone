import multer from 'multer';
const storage = multer.memoryStorage(); // store in memory if you're using base64
const upload = multer({ storage });

export default upload;