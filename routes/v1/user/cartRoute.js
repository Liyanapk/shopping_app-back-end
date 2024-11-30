import express from "express";

import { addToCart, deleteCart, listCart, payment, updateCartQuantity } from "../../../controller/v1/cartController.js";
import { userAuth } from "../../../middleware/authCheck.js";


const router = express.Router()


router.use(userAuth)
router.post('/',addToCart)
router.delete('/:id',deleteCart)
router.get('/',listCart)
router.patch('/:id',updateCartQuantity)
router.post('/create-checkout-session',payment)

export default router