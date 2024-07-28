import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//creating middlewares (middleware is used for checking purposes)
app.use(cors()) //checks whom to give access of backend
app.use(express.json({limit: "16kb"})) //check the limit of the size of json recieved from user
app.use(express.urlencoded()) //encode the url to fetch data from url
app.use(cookieParser()) //allow us to do crud operation on user's brower cookie

export default app