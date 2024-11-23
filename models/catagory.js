import mongoose from "mongoose";



const catagorySchema = new mongoose.Schema({


    name:{
        type:String,
        enum:['women','men','kids'],
        required:true
    },

    image:{
        type:String,
        required:true
    }



},
{timeStamp:true}
)

const Catagory = mongoose.model('Catagory',catagorySchema)

export default Catagory


