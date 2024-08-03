import { Router } from "express";
import { RefreshAccessToken, registerUser, userLogin, userLogout } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
const router = Router()
import getUsers from "../controllers/getUsers.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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

router.route ("/login").post(userLogin)

router.route("/logout").post(verifyJWT, userLogout)

router.route("/refresh-token").post(RefreshAccessToken)


export default router