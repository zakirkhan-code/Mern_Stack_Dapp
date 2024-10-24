import { v2 as cloudinary } from "cloudinary";
import { config } from "./config";


cloudinary.config({
    name_cloud:config.cloud_name,
    key_api : config.api_key,
    secret_api: config.api_secret,
});

export default cloudinary