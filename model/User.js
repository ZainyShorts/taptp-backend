mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username:{
        type:String,
        },
    email:{
        trim:true,
        unique:true,
        type:String,
        
    },
    rollno:{
        type:String,
    },
    password:{
        trim:true,
        type:String,
    },
    balance:{
        type:Number,
        default:0
    },
    limit:{
        type:Number,
        default:50000
    },
    type:{
        type:String,
        required: true
    },
    block:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String,
        default:'8426'
    }
   


    
    

    },{timestamps:true})
    mongoose.models={}

const User = mongoose.model("User", UserSchema);

module.exports = User;