import app from "./src/app"

const start=()=>{

    const PORT = process.env.PORT || 3000;

    app.listen(PORT,()=>{
        console.log(`LocalHost Running on the Port ${PORT}`);
    })
}

start()