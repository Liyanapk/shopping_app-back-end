import express from "express";
import { addToCart, deleteCart, listCart, oneCart } from "../../../controller/v1/cartController.js";
import { userAuth } from "../../../middleware/authCheck.js";


const router = express.Router()


router.use(userAuth)
router.post('/',addToCart)
router.get('/:id',oneCart)
router.delete('/:id',deleteCart)
router.get('/',listCart)

export default router