import Imagekit from "imagekit";
import config from "../config/config.js";

let imagekit = null;
if (config.IMAGEKIT_PUBLIC_KEY && config.IMAGEKIT_PRIVATE_KEY && config.IMAGEKIT_URL_ENDPOINT) {
    try {
        imagekit = new Imagekit({
            publicKey: config.IMAGEKIT_PUBLIC_KEY,
            privateKey: config.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: config.IMAGEKIT_URL_ENDPOINT
        });
    } catch (err) {
        console.warn("ImageKit initialization error:", err.message);
    }
}

async function uploadFile(file, fileName){
    try {
        if (!imagekit) {
            throw new Error("ImageKit is not configured. Missing IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY or IMAGEKIT_URL_ENDPOINT.");
        }
        const fileBuffer = file?.buffer || file;
        const result = await imagekit.upload({
            file: fileBuffer,
            fileName: fileName,
        });
        return result;
    } catch (error) {
        console.error("ImageKit upload error:", error);
        throw error;
    }
}

export default {
    uploadFile
};