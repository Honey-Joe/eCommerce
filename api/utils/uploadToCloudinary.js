// utils/uploadToCloudinary.js
const cloudinary = require('./cloudinary');

const uploadToCloudinary = async (files, folder) => {
  return Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
            public_id: file.originalname.split('.')[0],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              url: result.secure_url,
              originalname: file.originalname,
              mimetype: file.mimetype,
            });
          }
        ).end(file.buffer);
      });
    })
  );
};

module.exports = uploadToCloudinary;
