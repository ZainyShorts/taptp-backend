
const { signup, signin,otp,getBalance,upgradeBalance,sendMoney,getId,getTransactions,getCardStatus,sendTagMoney,
  getCardChangeStatus} = require('./controllers/User')
const bodyParser = require('body-parser');
const express = require("express");
const cors = require('cors');
require('dotenv').config();
const { protect } = require('./middleware/authMiddleware')
const connectDB = require('./config/db')
connectDB()


connectDB()
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // to accept json data
app.use(cors({
  origin: '*' // Replace with your Next.js frontend URL
}));






app.post('/signup',signup)
app.post('/signin',signin)
app.post('/otp',otp)
app.get('/getBalance',protect,getBalance)
app.post('/upgradeBalance',protect,upgradeBalance)
app.post('/sendMoney',protect,sendMoney)
app.get('/getTransactions',protect,getTransactions)
app.get('/getId',protect,getId)
app.get('/getCardStatus',protect,getCardStatus)
app.get('/getCardChangeStatus',protect,getCardChangeStatus)
app.post('/sendTagMoney',protect,sendTagMoney)

  app.get("/", (req, res) => {
    res.send("TapTap Server Running");
  });

const PORT = 4001;

app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);
