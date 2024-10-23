import {config as conf} from "dotenv"
conf()
const _config ={
    port:process.env.PORT,
    DataBaseURL:process.env.MONGOOSE_CONNECTION,
}

export const config = Object.freeze(_config)