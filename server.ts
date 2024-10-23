import { config } from "./config/config";
import connectDB from "./config/db";
import app from "./src/app"

const startServer=async ()=>{
    await connectDB()

    const PORT = config.port || 3000;

    app.listen(PORT,()=>{
        console.log(`LocalHost Running on the Port ${PORT}`);
    })
}

startServer()