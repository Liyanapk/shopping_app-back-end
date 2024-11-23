import User from "../../models/user.js";
import httpError from "../../utils/httpError.js";
import bcrypt from 'bcrypt'

export const sighnUpUser =async( req, res, next)=>{


    try {

        const { first_name, last_name, email, phone, address, password }=req.body

         if( !first_name || !last_name || !email || !phone ||!email || !address || !password){
            return next(new httpError("All feild are required!",404))
         }

          //email

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(new httpError("Invalid email format!", 400));
        }

        //password

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            return next(new httpError("Password must be at least 6 characters long, include a letter, a number, and a special character.", 400));
        }

        //phone 

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return next(new httpError("Phone number must be a 10-digit number.", 400));
        }

        const userExist = await User.findOne({ $or : [{email},{phone}] })
        if(userExist){
            return next(new httpError("User with this email or phone number already exist!",400))
        }
        
        //hashed password
        const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALT_VALUE))


        //profile-image path
        
        let profilePicturePath
        if(req.file){
            profilePicturePath = req.file.path.slice(8)
        }
        

        const newUser = new User({

            first_name,
            last_name,
            email,
            phone,
            address,
            password : hashPassword,
            profile_image: profilePicturePath,

        })
        
        await newUser.save()
        res.status(200).json(
            {
                status:true,
                massage:"Sighn Up completed ",
                data: newUser,
                access_token:null
            }
        )


    } catch (error) {
        return next(new httpError("Internal server Error",500))
        
    }



}



//update user


export const updateUser = async(req, res, next)=>{
    try {

        const { id }= req.params

        if(!id){
           return next(new httpError(" ID required!",404))
        }
   
   
       const{ first_name, last_name, email, phone, address, password } = req.body
   
   
       const updatedData = {
           first_name,
           last_name,
           email,
           phone,
           address,
           password 
       }
   
   
   //email
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (req.body.email && !emailRegex.test(email)) {
       return next(new httpError("Invalid email format!", 400));
   }
   
  
   
           const userExist = await User.findOne({ $or : [{email},{phone}], _id:{ $ne:id }})
           if(userExist){
               return next(new httpError("User with this email or phone number already exist!",400))
           }
   
           // validate and hash password 
     if (req.body.password) {
       const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
       if (!passwordRegex.test(password)) {
           return next(new httpError("Password must be at least 6 characters long, include a letter, a number, and a special character.", 400));
       }
   
       const saltRounds = process.env.SALT_VALUE ? parseInt(process.env.SALT_VALUE) : 10;
       const hashedPassword = await bcrypt.hash(password, saltRounds);
       updatedData.password = hashedPassword;
   }
   
            //phone 
   
           const phoneRegex = /^\d{10}$/;
           if (req.body.phone && !phoneRegex.test(phone)) {
               return next(new httpError("Phone number must be a 10-digit number.", 400));
           }



           const updateUser = await User.findOneAndUpdate(
             
            {_id:id},
            { $set: updatedData },
            {new:true, runValidators:true}
           )

          


           res.status(200).json({
            status:true,
            message:"User Updated Successfully",
            data:updateUser,
            access_token:null
           })
   
        
    } catch (error) {
        console.log(error)
        return next(new httpError("Internal server error",500))
       
        
    }


    
}


//login and order list cart controlling