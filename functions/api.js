import express from "express"
// import route from "../src/app.js"
import Serverless from "serverless-http"

const app = express()

const router = express.Router()

router.get("/", (req,res)=>{
    res.send("Hello from express")
})

app.use("/.netlify/functions/api",router)



module.exports.handler = Serverless(app)