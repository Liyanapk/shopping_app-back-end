import express from "express";
import { getOrder, placeOrder } from "../../../controller/v1/orderController.js";






const router=express.Router()



router.post('/',placeOrder)
router.get('/:id',getOrder)



export default router