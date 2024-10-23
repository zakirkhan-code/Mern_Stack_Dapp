import express from 'express'

const app = express()

app.get('/',(req,res,next)=>{
    res.json({massage:"Hello express serverr"});
})

export default app;