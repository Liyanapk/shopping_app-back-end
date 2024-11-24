import express from 'express';
import dotenv from "dotenv";
import { notFound,errorMiddleware } from './middleware/errorMiddleware.js';
import {dbconnect} from "./config/dbconfig.js"
import userrouter from './routes/v1/user/userRoute.js'
import catagoryrouter from './routes/v1/user/categoryRoute.js'
import productrouter from './routes/v1/user/productRoute.js'
import cartrouter from './routes/v1/user/cartRoute.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4001


dbconnect()
app.use(express.json())

app.use(express.static('uploads'));

app.use('/api/v1/user',userrouter)
app.use('/api/v1/catagory',catagoryrouter)
app.use('/api/v1/product',productrouter)
app.use('/api/v1/cart',cartrouter)




app.use(notFound)
app.use(errorMiddleware)



app.listen (PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    
})