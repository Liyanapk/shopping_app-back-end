import mongoose, { model } from "mongoose";



const orderSchema =  new mongoose.Schema({

    user:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    payment:{

        status:{
            type:String,
            enum:['pending','paid','failed'],
            required:true
        },

        paymentId:{
            type: String,
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
          },

        amount:{
            type:Number,
            required:true
        }
        
    },

    items:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },

            quantity: {
                type: Number,
                default:1
              }

        }
    ]


},

{ timestamps: true } 


)

const Order = mongoose.model('Order',orderSchema)
export default Order