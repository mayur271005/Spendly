import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import app from "./app.js";
dotenv.config();




const PORT=process.env.PORT || 5000;

const startServer=async()=>{
    try{
        await connectDB();
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        }); 
    } catch (error) {
        console.error("Error starting server:", error);
    }
}
startServer();
