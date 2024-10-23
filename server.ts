import { config } from "./config/config";
import app from "./src/app"

const start=()=>{

    const PORT = config.port || 3000;

    app.listen(PORT,()=>{
        console.log(`LocalHost Running on the Port ${PORT}`);
    })
}

start()