mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema({
    sender:{
        type:String,
        },
    receiver:{
        type:String,
        
    },
    amount:{
        type:Number,
    },
    senderName:{
        type:String,
    },
    receiverName:{
        type:String,
    }
   


    
    

    },{timestamps:true})
    mongoose.models={}

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;