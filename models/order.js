import mongoose, { model } from "mongoose";



const orderSchema = new model.Schema({

    product:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },

    status:{
        type:String,
        enum:['pending','paid'],
        required:true
    }



})

const Order = mongoose.model('Order',orderSchema)
export default Order