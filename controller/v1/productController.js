import Product from "../../models/product.js";
import httpError from "../../utils/httpError.js";




//add product


export const addProduct = async(req, res, next)=>{


    try {

        const{ name, price, description, catagory } =req.body


        let imagePath;
        if(req.file){
            imagePath=req.file.path.slice(8)
        }

        

        if(! name || ! price || ! description || ! catagory || ! imagePath ){
            return next(new httpError("All feilds are required!",400))
        }
        
        if( price <= 0 ){
            return next(new httpError("price should be a valid price",404))
        }

        const newProducts = await Product({
            name,
            price,
            description,
            catagory,
            image:imagePath
        })

        await newProducts.save()


        res.status(200).json({
            status:true,
            message:"Product created successfully",
            data:newProducts
        })




    } catch (error) {
        return next(new httpError("Internal server Error",500))
        
    }
}



//list product


export const listProduct = async( req, res, next) =>{

    try {
       
        //pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

      // Filtering
        const filter = {};
        if (req.query.searchTerm) {
            const searchTerm = req.query.searchTerm.trim(); 
            const isNumeric = !isNaN(searchTerm); 

         if (isNumeric) {
        
        const numericValue = parseFloat(searchTerm);

        
        if (req.query.operator === 'gt') {
            filter.price = { $gt: numericValue };
        } else if (req.query.operator === 'lt') {
            filter.price = { $lt: numericValue };
        } else {
           
            filter.$or = [{ price: numericValue }];
        }
    } else {
        
        filter.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
        ];
    }
}


        //sorting
        const sort = {};
        if(req.query.sortBy){
            const [field,order] = req.query.sortBy.split(':');
            sort [field] = order === 'desc' ? -1 : 1;
        }
        

    


        //result
        const total = await Product.countDocuments(filter);

        const allProduct = await Product.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .select('-__v -createdAt -updatedAt' );


        //response send
        res.status(200).json({
            status:true,
            message: 'Product retrieved successfully',
            data: allProduct,
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


//get one product



export const oneProduct = async(req, res, next)=>{


    try {

        const { id } =req.params

        if(! id){
            return next (new httpError("No ID found",400))
        }


        const getProduct = await Product.findOne( { _id:id})

        if(! getProduct){
            return next(new httpError("No product found",400))
        }
       
        await getProduct.save()

       


        res.status(200).json({
            status:true,
            message:"product retreived successfully",
            data:getProduct,
            access_token:null
        })
        
    } catch (error) {
        console.log(error)
        return next(new httpError("Internal server error",500))
        
    }
}