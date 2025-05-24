import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARTY_NAME,
    api_key: process.env.CLOUDINARTY_API_KEY,
    api_secret: process.env.CLOUDINARTY_API_SECRET
});

const uploadFile = async (localFilePath) => {
    try {
        if (!localFilePath) return ("File not found")

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        console.log("file uploaded successfully", response.url);
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
        
}

export { uploadFile }