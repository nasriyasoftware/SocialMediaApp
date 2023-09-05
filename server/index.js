import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import helmet from "helmet"
import morgan from "morgan";
import path from "path";
import authRoutes from "./Routes/auth.js"
import userRoutes from "./Routes/user.js"
import postRoutes from "./Routes/posts.js"
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js"
import { createPost } from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js";
/* data for testing */
/* import {users , posts} from "./data/index.js"
import User from "./models/User.js"
import Post from "./models/Post.js" */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({limit:"30mb" , extended:true}))
app.use(bodyParser.urlencoded({limit: "30mb" , extended:true}))
app.use(cors()) 
app.use("/assets" , express.static(path.join(__dirname,'public/assets')))


/* File Storage */
const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,"public/assets")
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})
const upload = multer({storage:storage})
/* Routes With Files */

app.post("/auth/register" , upload.single("picturePath")  , register);
app.post("/posts" , verifyToken , upload.single("picturePath") , createPost);
/* Routes */
app.use('/auth' , authRoutes)
app.use('/users' , userRoutes)
app.use('/posts' , postRoutes)

/* Mongoose Setup */


const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL , {
    useNewUrlParser:true,
    useUnifiedTopology:true

}).then(()=>{
    /* User.insertMany(users)
    Post.insertMany(posts) */
    app.listen(PORT , () => console.log(`connected at PORT ${PORT} `))
}).catch(err => console.log(`not connected because of ${err}`))