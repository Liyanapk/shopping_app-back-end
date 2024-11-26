import express from "express";
import { addToCart, deleteCart, oneCart } from "../../../controller/v1/cartController.js";
import { userAuth } from "../../../middleware/authCheck.js";


const router = express.Router()


router.use(userAuth)
router.post('/',addToCart)
router.get('/:id',oneCart)
router.delete('/:id',deleteCart)


export default router