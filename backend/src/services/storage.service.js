import Imagekit from "imagekit";
import config from "../config/config.js";

const imagekit = new Imagekit({
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(file, fileName){
    try {
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