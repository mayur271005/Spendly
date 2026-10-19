import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema(
  {
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true 
    },  
    amount: {
      type: Number,
      required: true,  
      min: [0.01, "Amount must be a positive number"], 
    },  
    type: {
      type: String,
      enum: ["income", "expense"],  
        required: true,
    },
    category: {
      type: String,
      required: true, 
      trim: true,   
    },
    description: {
      type: String,
      trim: true,   
    },
    date: {
      type: Date,
      default: Date.now, 
    },
  },
  { timestamps: true }
);


transactionSchema.index({ user: 1, date: -1 });


const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;