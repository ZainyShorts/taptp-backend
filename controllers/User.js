const asyncHandler = require("express-async-handler");
const User = require('../model/User');
const Transaction = require('../model/Transaction');
const { organizations } = require("../constants/constants");
const generateToken = require('../config/generateToken')
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
const { otpTemplate } = require("../Template/otp");

const signup = asyncHandler(async (req,res)=>{
    const { username ,email,password} = req.body;
    if (req.method == "POST") {
      try {
            const splitter = email.split('@')
            let u = await User.create({
              username,
              email,
              password: CryptoJS.AES.encrypt(
                password,
                process.env.JWTSECRET
                ).toString(),
                rollno:splitter[0]
              });
              u.save()
              console.log(u)
              res.status(200).json({ msg: "Account created", success:true });
            
      } catch {
        res.status(200).json({success:false, msg: "You missed something" });
      }
    } else return res.status(200).json({success:false, error: "Bad Request" }); 
})

const signin = asyncHandler(async(req,res)=>{


    const { email,password } = req.body;
    if(!email || !password)
    {
      res.json({
        success: false,
        msg: "Enter email and password"
      });
    }
    const user = await User.findOne({ email });
    if(!user)
    {
      res.json({
        success: false,
        msg: "User not found"
      });
    }
    try{
  
        const bytes  = CryptoJS.AES.decrypt(user.password,  process.env.JWTSECRET)
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if(password != originalText)
        {
          res.json({
            success: false,
            msg: "Invalid Credentials"
          });
        }
        else{
          res.status(200).json({
            success: true,
            msg:"success",
            token: generateToken(user._id),
          });
        }
     
  
  }
    catch(e)
    {
      return res.json({success:false,msg:'Network Error'});
    }
  })

const otp = asyncHandler(async(req,res)=>{
    try {
        const { email , otp , username,password } = req.body

        if(!username)
          return res.status(200).send({ msg:"Enter username", success: false });
        else if(!email || !email.includes("@"))
          return res.status(200).send({ msg:"Enter email", success: false });
        else if(!password)
          return res.status(200).send({ msg:"Enter password", success: false });
        else{

        const isAccExits = await User.findOne({email})
       
          if(isAccExits)
          {
            return res.status(200).send({ msg:"Account already exits with this email", success: false });
          }
          const splitter = email.split('@')
          const checkMail  =  '@'+splitter[1]

          if(!organizations.includes(checkMail)){
              return res.status(200).send({ msg:"Can not create account with this email", success: false });
          }

        const transporter = nodemailer.createTransport({
          port: 465,
          host: "smtp.gmail.com",
          service: "Gmail",
          auth: {
            user: process.env.NODE_MAILER_USER,
            pass: process.env.NODE_MAILER_PASS,
          },
          secure: true,
        });
    
          await transporter.sendMail({
            from: process.env.NODE_MAILER_USER,
            to: email,
            subject: `OTP Verification`,
            html: otpTemplate(username,otp),
          });
        
    
          return res.json({success:true});
        }

      } catch (error) {
        return res.json({success:false});
      }
})

const getBalance = asyncHandler(async(req,res)=>{
    try{
        const user = await User.findOne({_id:req.user})
        return res.json({success:true,balance:user.balance,limit:user.limit})
    }catch(e){
        return res.json({success:false})
    }
})

const upgradeBalance = asyncHandler(async(req,res)=>{
    try{
        console.log('amount')
        const { amount } = req.body
        console.log(amount)
        await User.updateOne(
            {_id:req.user},
            {
                $inc:{
                    balance:amount,
                    limit:-amount
                }
            }
            )
        return res.json({success:true})
    }catch(e){
        return res.json({success:false})
    }
})

const sendMoney = asyncHandler(async(req,res)=>{
  const { amount , ac } = req.body

  const receiver = await User.findOne({rollno:ac})

  if(!receiver){
    return res.json({success:false,msg:"user not found."})
  }
  if(receiver.block){
    return res.json({success:false,msg:"User account is blocked 😔"})
  }
  const sender = await User.findOne({_id:req.user})
  await User.updateOne({rollno:ac},{$inc:{balance:amount}})
  await User.updateOne({_id:req.user},{$inc:{balance:-amount}})
  await Transaction.create({
    sender:sender._id,
    receiver:receiver._id,
    senderName:sender.username,
    receiverName:receiver.username,
    amount:amount
  })
  return res.json({success:true,msg:"Transaction successful ✅"})
})

const getTransactions = asyncHandler(async(req,res)=>{
 
  const transactions = await Transaction.find({
    $or: [
      { sender: req.user }, // Replace with the appropriate key from req.user
      { receiver: req.user }
    ]
  });



  return res.json({success:true,transactions})
})

const getId = asyncHandler(async(req,res)=>{
  return res.json({success:true,id:req.user})
})

const getCardStatus = asyncHandler(async(req,res)=>{
  const user = await User.findOne({_id:req.user})
  return res.json({success:true,block:user.block})
})

const getCardChangeStatus = asyncHandler(async(req,res)=>{
  const user = await User.updateOne({_id:req.user},{block:req.query.status})
  return res.json({success:true,block:user.block})
})

const sendTagMoney = asyncHandler(async(req,res)=>{
  const { rollno  , otp } = req.body

  const amount = parseInt(req.body.amount)
  
  
  const sender = await User.findOne({rollno:rollno})


  if(!sender){
    return res.json({success:false,msg:"user not found."})
  }

  if(sender.block){
    return res.json({success:false,msg:"User account is blocked 😔"})
  }

  if(sender.otp != otp){
    return res.json({success:false,msg:"Invalid Otp "})
  }

  if(sender.balance<amount){
    return res.json({success:false,msg:"Insufficent funds 😔"})
  }

  const receiver = await User.findOne({_id:req.user})
  await User.updateOne({rollno:rollno},{$inc:{balance:-amount}})
  await User.updateOne({_id:req.user},{$inc:{balance:amount}})
  await Transaction.create({
    sender:sender._id,
    receiver:receiver._id,
    senderName:sender.username,
    receiverName:receiver.username,
    amount:amount
  })
  return res.json({success:true,msg:"Transaction successful ✅"})
})







module.exports = {
    signup,
    signin,
    otp,
    getBalance,
    upgradeBalance,
    sendMoney,
    getTransactions,
    getId,
    getCardStatus,
    getCardChangeStatus,
    sendTagMoney
    
};
