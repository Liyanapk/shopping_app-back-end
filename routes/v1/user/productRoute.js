import express from "express";
import { addProduct, listProduct, oneProduct } from "../../../controller/v1/productController.js";
import { upload } from "../../../middleware/multer/multer.js";





const router=express.Router()



router.post('/',upload.single('image'),addProduct)
router.get('/',listProduct)
router.get('/:id',oneProduct)

export default router