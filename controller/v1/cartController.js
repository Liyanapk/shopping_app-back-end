import { model } from "mongoose";
import User from "../../models/user.js";
import httpError from "../../utils/httpError.js";
import Stripe from 'stripe'; 




//add cart

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { product, quantity } = req.body;



    // Validate product and quantity
    if (!product || quantity === undefined) {
      return next(
        new httpError("To add to cart, both product and quantity are required!", 400)
      );
    }

    // Ensure quantity is a valid number
    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return next(new httpError("Quantity must be a valid number greater than 0", 400));
    }

    if (!userId) {
      return next(new httpError("Please log in!", 400));
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return next(new httpError("User not found!", 404));
    }

    // Check if the product already exists in the cart
    const existingProductIndex = user.cart.findIndex((item) => item.product.equals(product));

    if (existingProductIndex >= 0) {
      return next(new httpError("Product already exists in the cart!", 400));
    } else {
      // Add the new product to the cart
      user.cart.push({ product, quantity: parsedQuantity });
    }

    // Save the updated user document
    await user.save();

    // Populate the cart with product details for the response
    const populatedCart = await User.findById(userId).populate("cart.product");

    res.status(200).json({
      status: true,
      message: "Added to cart successfully",
      data: populatedCart.cart,
      access_token: null,
    });
  } catch (error) {
    console.error(error);
    return next(new httpError("Internal server error", 500));
  }
};









//delete cart item

export const deleteCart = async (req, res, next) => {
  try {

    //cart id
    const { id } = req.params;

    if (!id) {
      return next(new httpError("No cart item ID found!", 400));
    }

    const userId = req.user?.id;

    if (!userId) {
      return next(new httpError("Please log in!", 400));
    }

    const updatedCart = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { cart: { _id: id } } },
      { new: true }
    ).populate("cart.product");

    if (!updatedCart) {
      return next(new httpError("User not found or no cart item found!", 400));
    }

    res.status(200).json({
      status: true,
      message: "Cart item deleted successfully",
      data: updatedCart.cart,
      access_token: null
    });

  } catch (error) {
    console.error("Internal server error:", error);
    return next(new httpError("Internal server error", 500));
  }
};








//  export const listCart = async (req, res, next) => {

//     try {

//       // Pagination
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 4;
//       const skip = (page - 1) * limit;

//       // Filtering
//       const filter = {};
//       if (req.query.searchTerm) {
//         const searchTerm = req.query.searchTerm.trim();
//         const isNumeric = !isNaN(searchTerm);

//         if (isNumeric) {
//           const numericValue = parseFloat(searchTerm);

//           if (req.query.operator === "gt") {
//             filter["cart.price"] = { $gt: numericValue };
//           } else if (req.query.operator === "lt") {
//             filter["cart.price"] = { $lt: numericValue };
//           } else {
//             filter["cart.price"] = numericValue;
//           }
//         } else {
//           filter["cart.name"] = { $regex: searchTerm, $options: "i" };
//         }
//       }

//        // Sorting
//     const sort = {};
//     if (req.query.sortBy) {
//       const [field, order] = req.query.sortBy.split(":");
//       sort[`cart.${field}`] = order === "desc" ? -1 : 1;
//     }
//     if (Object.keys(sort).length === 0) {
//         // default sort
//       sort["cart._id"] = 1; 
//     }


//       // total items count
//       const total = await User.aggregate([
//         { $unwind: "$cart" },
//         { $match: filter },
//         { $count: "total" },
//       ]);

//       const totalItems = total.length > 0 ? total[0].total : 0;

//       // fetch the paginated and sorted cart items
//       const allCart = await User.aggregate([
//         { $unwind: "$cart" },
//         { $match: filter },
//         { $sort: sort },
//         { $skip: skip },
//         { $limit: limit },
//         {
//           $project: {
//             _id: 0,
//             cart: 1,
//           },
//         },
//       ]);


//       res.status(200).json({
//         status: true,
//         message: "Cart retrieved successfully",
//         data: allCart,
//         access_token: null,
//         totalPages: Math.ceil(totalItems / limit),
//         currentPage: page,
//         totalItems: totalItems,
//       });
//     } catch (error) {
//       console.error(error);
//       return next(new httpError("Server Error", 500));
//     }
//   };



//list cart


export const listCart = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(new httpError("Please log in!", 400));
    }

    const user = await User.findById(userId).populate("cart.product");

    if (!user) {
      return next(new httpError("User not found!", 400));
    }

    const cartItems = user.cart;

    res.status(200).json({
      status: true,
      message: "Cart retrieved successfully",
      data: cartItems,
      access_token: null,
      totalItems: cartItems.length,
    });
  } catch (error) {
    console.error(error);
    return next(new httpError("Server Error", 500));
  }
};





//cart quantity update


const stripe = new Stripe("sk_test_51QPzKEKlPIuU4563yMWRGP0Cna2295G5VKt6lbwzXMbHbjfbQF0GMdY7N8zqg0H8D6zDfS5NCOEfmsROtEkYBfCK007Z8904NV");

export const updateCartQuantity = async (req, res, next) => {
  try {

    //cart id
    const { id } = req.params;
    const { quantity } = req.body;

    if (!id) {
      return next(new httpError("No cart item ID found!", 400));
    }

    if (quantity === undefined || quantity <= 0) {
      return next(new httpError("Quantity must be a valid number greater than 0", 400));
    }

    const userId = req.user?.id;

    if (!userId) {
      return next(new httpError("Please log in!", 400));
    }


    const user = await User.findById(userId);

    if (!user) {
      return next(new httpError("User not found!", 404));
    }


    const cartItem = user.cart.find(item => item._id.toString() === id);

    if (!cartItem) {
      return next(new httpError("Cart item not found!", 404));
    }


    cartItem.quantity = quantity;


    await user.save();

    const populatedCart = await User.findById(userId).populate("cart.product");

    res.status(200).json({
      status: true,
      message: "Cart item quantity updated successfully",
      data: populatedCart.cart,
      access_token: null,
    });

  } catch (error) {

    return next(new httpError("Internal server error", 500));
  }
};




//payment 




export const payment = async (req, res, next) => {
  try {
    const { product } = req.body;

    const lineItems = product.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name, 
        },
        unit_amount: item.product.price * 100, 
      },
      quantity: item.quantity,
    }));


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items:lineItems,
       mode:"payment",
        success_url:"http://localhost:3000/success",
        cancel_url:"http://localhost:3000/cancel"      
    })


    res.json({id:session.id})


  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
};