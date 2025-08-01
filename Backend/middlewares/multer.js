// middlewares/uploadCloudinary.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Default folder
    let folder = 'misc';
    // Logic to determine folder
    if (req.uploadTarget === 'profile') {
      folder = 'user_profiles';
    } else if (req.uploadTarget === 'post') {
      folder = 'blog_posts';
    }
    return {
      folder,
      allowed_formats: ['jpeg', 'png', 'jpg'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    };
  },
});

const upload = multer({ storage });

export default upload;
