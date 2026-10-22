import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import cookieParser from "cookie-parser";

const app=express();
app.use(cors(
    {
        origin: ["http://localhost:5173",
            "http://localhost:3000",
        ],
        credentials:true,
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/transaction',transactionRoutes);
app.use('/api/analytics',analyticsRoutes);

app.get("/health",(req,res)=>{
    res.status(200).json({message:"Server is running"});
})

export default app;