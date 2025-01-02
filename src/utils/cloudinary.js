import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
// import path from 'path';
// import { fileURLToPath } from 'url';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
      if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath); // Remove the locally saved temporary file if it exists
      }
      console.error("Failed to upload file:", error);
      return null;
  }
}

// const testUpload = async () => {
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);
//   const testFilePath = path.join(__dirname, 'test-image.jpg'); // Corrected path to your test image file

//   try {
//       const response = await cloudinary.uploader.upload(testFilePath, {
//           resource_type: "auto"
//       });
//       console.log("File uploaded successfully:", response.url);
//   } catch (error) {
//       console.error("Failed to upload file:", error);
//   }
// };


// // Run the test upload
// testUpload();

export {uploadOnCloudinary}
