import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    const uploadOnCloudinary = async function (filepath){
        try {
            if (filepath) {
              const response = await cloudinary.uploader.upload(filepath)
                console.log("file is uploaded successfully! ",response.url)
                return response.url
            }
            else {
                return null
            }
        } catch (error) {
            fs.unlinkSync(filepath)
            return null
        }
    }
   
    export default uploadOnCloudinary