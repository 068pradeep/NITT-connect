const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const sendEmail = require('../utility/nodemailer');

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const generateOTP = () => {
  // Generate a random 5-digit number
  const otp = Math.floor(10000 + Math.random() * 90000);
  return otp;
};

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
  //console.log("Here");
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const otp = generateOTP();
  const text= `Hello ${name} this is chat-bot application for the registration enter the otp ${otp}`;
 

const user = await User.create({
    name,
    email,
    password,
    pic,
    otp:otp,
  });
  
  setTimeout(async () => {
    const user = await User.findOne({ email });
    console.log(user);
    console.log(user.isVerify);
    if (user && user.isVerify==='false') {
        //console.log(result.isVerify);
        // console.log(user);
        // console.log(user.isVerify);
        await User.deleteOne({ email });
        console.log(`Unverified user with email ${user.email} has been deleted.`);
    }
}, 2* 60000);

  if (user) {
    const data = await sendEmail(email,text);
    if(!data){
       console.log("some error while sending mail");
    }
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});


const verifyOtp = asyncHandler(async(req,res)=>{
  try {
    console.log(req);
    console.log(req.params);
     let {id}= req.params;

     const {otp} = req.body;
     console.log(id);
     console.log(otp);
     const user = await User.findOne({_id:id});
    console.log(user);
     if(!user){
      console.log("inside if condtion");
      return res.status(403).json(
        {
          message:"User id is not correct User is not authenticate",
          success:false
        }
      );
     }

     if(user.otp !== otp){
      res.status(403).json(
        {
          message:"User otp is not correct User is not authenticate",
          success:false
        }
      )
     }
    //  const newUser = new User({
    //   ...user,isVerify:true,otp:""
    //  });
    const updateInfo = await User.updateOne({ _id: id }, { $set: { isVerify: true } });
     if(updateInfo){
      res.status(200).json({
        message:"user verification succesfull",
        success:true
      })
     }
     else{
      res.status(200).json({
        message:"user verification fail",
        success:false
      })
     }

  } catch (error) {
    console.log("Some error while verify otp",error);
  }
})

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

module.exports = { allUsers, registerUser, authUser,verifyOtp };
