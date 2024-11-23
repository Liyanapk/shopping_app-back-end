import Catagory from "../../models/catagory.js";
import httpError from "../../utils/httpError.js";



export const addCatagory =async (req, res, next)=>{
     
    try {
        
        const { name } = req.body

          //profile-image path
        
          let imagePath;
          if(req.file){
            imagePath = req.file.path.slice(8)
          }
          

        if(!name || !imagePath){
            return next(new httpError("All fields are required!",400))
        }
       
        const categoryExsist = await Catagory.findOne( { name } )
        if(categoryExsist){
            return next(new httpError("Catagory with this name already exist",400))
        }
        
        const newCatagory =  new Catagory({
            name,
            image:imagePath,
        })
        await newCatagory.save()
        res.status(200).json({
            status:true,
            message:"catagory created successfully",
            data:newCatagory,
            access_token:null

        })

        
    } catch (error) {

        return next(new httpError( "Internal server error",500))
        
    }


  
}


//get category


export const getCategory = async( req, res, next) =>{

    try {
       
        //pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

        //filtering
        const filter={};
        if(req.query.searchTerm){

            filter.$or=[
                { name : { $regex: req.query.searchTerm, $options: 'i' } },
                
            ]
        }

        //sorting
        const sort = {};
        if(req.query.sortBy){
            const [field,order] = req.query.sortBy.split(':');
            sort [field] = order === 'desc' ? -1 : 1;
        }
        

    


        //result
        const total = await Catagory.countDocuments(filter);

        const allCatagory = await Catagory.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .select('-__v -createdAt -updatedAt' );


        //response send
        res.status(200).json({
            status:true,
            message: 'Catagory retrieved successfully',
            data: allCatagory,
            access_token:null,
            totalPages: Math.ceil(total/limit),
            currentPage: page,
            totalItems: total,
          });

        

    } catch (error) {
        console.log(error)
        return next (new httpError(" Server Error " ,500 ));
    }

}
