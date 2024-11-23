import express from "express";
import { addCatagory, getCategory } from "../../../controller/v1/categoryController.js";
import { upload } from "../../../middleware/multer/multer.js";




const router = express.Router()


router.post('/',upload.single('image'),addCatagory)
router.get('/',getCategory)





export default router