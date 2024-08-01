import { Router } from "express";
import registerUser from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
const router = Router()
import getUsers from "../controllers/getUsers.controller.js";

router.route("/register").post(
    upload.fields([
        {
            name: "profilePic",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/getUser").get(getUsers)


export default router