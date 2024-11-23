import mongoose from 'mongoose'


export const dbconnect = async()=>{
    
    try {
        
        const connect=await mongoose.connect (process.env.MONGO_URL) 
        console.log(`database is connected ${connect.connection.host}`);
        
        
    } catch (error) {
        
        process.exit(1)
        
    }
}