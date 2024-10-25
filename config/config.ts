import {config as conf} from "dotenv"
conf()
const _config ={
    port : process.env.PORT,
    DataBaseURL : process.env.MONGOOSE_CONNECTION,
    env : process.env.NODE_ENV,
    jwt_secrets : process.env.JWT_SECRETS,
    cloudinary_cloud_name : process.env.CLOUD_NAME,
    cloudinary_api_key:process.env.API_KEY,
    cloudinary_api_secret : process.env.API_SECRET,
}

export const config = Object.freeze(_config)