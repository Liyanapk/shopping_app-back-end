import express from "express";
import { addToCart, deleteCart, listCart, updateCartQuantity } from "../../../controller/v1/cartController.js";
import { userAuth } from "../../../middleware/authCheck.js";


const router = express.Router()


router.use(userAuth)
router.post('/',addToCart)
router.get('/:id',listCart)
router.delete('/:id',deleteCart)
router.patch('/:id',updateCartQuantity)


export default router