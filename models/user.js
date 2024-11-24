import mongoose from "mongoose";


const userSchema = new mongoose.Schema({


    first_name:{
        type:String,
        required:true
    },

    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    profile_image:{
        type:String,
        default:null,
    },

    address:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

    cart: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
          },
          quantity: {
            type: Number,
            default:1
          }
        }
      ]
      
},
{timestamps: true}

)


const User = mongoose.model('User',userSchema)
export default User