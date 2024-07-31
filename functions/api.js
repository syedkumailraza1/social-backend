import express from "express"
// import route from "../src/app.js"
import Serverless from "serverless-http"

const app = express()

const route= app.get("/",(req,res)=>{
    res.send("Hello from express")
})

app.use("/.netlify/functions/api",route)



export const handler = Serverless(app)