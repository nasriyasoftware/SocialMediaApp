import express from "express"
const router = express.Router()
import { verifyToken } from "../middleware/auth.js"
import {
    getUser,
    getUserFriends,
    addRemoveFriends,
} from "../controllers/users.js"

/* Read */
router.get("/:id" , verifyToken , getUser)
router.get("/:id/friends" , verifyToken , getUserFriends)
/* Update */
router.patch("/:id/:friendId" , verifyToken , addRemoveFriends)









export default router