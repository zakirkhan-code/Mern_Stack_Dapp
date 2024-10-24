import {config as conf} from "dotenv"
conf()
const _config ={
    port:process.env.PORT,
    DataBaseURL:process.env.MONGOOSE_CONNECTION,
    env:process.env.NODE_ENV,
}

export const config = Object.freeze(_config)