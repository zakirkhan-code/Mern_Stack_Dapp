import {config as conf} from "dotenv"
conf()
const _config ={
    port:process.env.PORT,
    DataBaseURL:process.env.MONGOOSE_CONNECTION,
    env:process.env.NODE_ENV,
    jwt_secrets: process.env.JWT_SECRETS,
}

export const config = Object.freeze(_config)