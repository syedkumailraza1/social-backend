import dotenv from "dotenv"
import connectDB from "./db/index.js"
import app from "./app.js"

const port = process.env.PORT || 3000

connectDB().then(()=>{
    app.listen(port, ()=>{
        console.log(`Server is running on port http://localhost:${port}`)
    })
}).catch((err)=>{
    console.log('error in db connection:', err);
})