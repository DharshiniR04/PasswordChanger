const express = require('express');
const dotenv = require('dotenv');
const cors=require('cors');
const connectDB = require('./config/db');
const User=require('./model/users');
const bcrypt=require('bcrypt');

dotenv.config();

connectDB();

const app = express();
app.use(cors({
    origin: "https://password-changer-client.vercel.app", 
    methods: ["POST", "GET","PATCH"],
    credentials: true
  }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://password-changer-client.vercel.app/"); 
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });
app.use(cors());
app.use(express.json());

app.get("/",async(req,res)=>{
    res.json("WELCOME TO EVENTLINK PASSWORD RECOVERY SERVER");
})

app.patch("/api/passwordRecovery",async(req,res)=>{
    const{email,password}=req.body;
    try{
       const user=await User.findOne({email});
       const hashedPassword = await bcrypt.hash(password, 10);
       if(!(user)){
          res.status(200).json({message:"User Not Found"});
          return;
       }
       await User.updateOne({email:email},{$set:{password:hashedPassword}});
       res.status(200).json({message:"Updated Successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Server Error"});
    }
})

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Password Recovery Server is running on the port ${PORT}`));
