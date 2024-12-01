import Order from "../../models/order.js";
import httpError from "../../utils/httpError.js";



export const placeOrder = async(req, res, next)=>{


        try {

            const{ user, payment, items, } = req.body

            if(! user || !payment || ! items || items.length === 0){
               return next (new httpError ("All Feilds are required!",400))
            }
        
            const newOrder = new Order({
        
                user,
                payment,
                items
            })
            await newOrder.save()

            res.status(200).json({
                status:true,
                message:'order created successfully',
                data:newOrder,
                access_token:null
            })
        
            
        } catch (error) {
            console.log(error)

            return next(new httpError('Issue while creating order',400))
            
        }
   


}


//get orderof One user


export const getOrder = async(req, res, next) =>{

        try {

            const { id } = req.params

            if(! id){
                return next(new httpError('order Id needed',400))
            }
            const orders = await Order.find({ user : id  })
            .populate('user','first_name last_name email')
            .populate('items.product','name price image')
          
           

            res.status(200).json({
                status:true,
                message:'order retreived successfully',
                data:orders,
                access_token:null
            })
            
        } catch (error) {
            console.log(error)

            return next(new httpError('failed to retrive order',400))
            
        }



}