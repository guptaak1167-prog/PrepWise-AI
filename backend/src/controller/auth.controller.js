const UserModel=require('../models/usermodel.js');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const tokenBlackListModel=require('../models/blacklist')
/**
 * @name registerUserController
 * @description register a new user,expects username,email and password in request body
 * @access public
 * */

async function registerUserController(req,res)
  {
    const {username,email,password}=req.body;
    if(!username || !email || !password){
      return res.status(400).json({message:"please enter the username password and gmail properly"});
    }
    const isUserAlreadyExist=await UserModel.findOne({
      $or:[{username},{email}]
    })//if any of them match then return true

    if(isUserAlreadyExist){
      return res.status(400).json({message:"user exists"});
    }
    const hash=await bcrypt.hash(password,10);//10 size of hashed password

    const user=await UserModel.create({
      username,//threat as object so that the property automatic goes
      email:email,//username ans email both is correct
      password:hash
    })
    const token=jwt.sign({
      id:user._id,username:user.username
    },process.env.JWT_SECRET,
    {expiresIn:'1d'}
    )
    res.cookie("token",token);
    res.status(201).json({message:"User registered successfully",user:{id:user._id,username:user.name,email:user.email}//can frontend requires data of the user to so which user is registred
    }
  )

};
/**
 * @name loginUserController
 * @description login a user,expects email and password in request body
 * @access public
 *
*/
async function loginUserController(req,res){
  const {email,password}=req.body;
  if(!email || !password){
    return res.status(400).json({message:"please enter the email and password properly"});
  }
  const user=await UserModel.findOne({email});
  if(!user){
    return res.status(400).json({message:"user not found"});
  }
  const isPasswordValid=await bcrypt.compare(password,user.password);//first argument treated as entered password while user.password is stored

  if(!isPasswordValid){
    return res.status(400).json({message:"Invalid email or password"});
  }

  const token=jwt.sign({
      id:user._id,username:user.username
    },process.env.JWT_SECRET,
    {expiresIn:'1d'}
    )
  res.cookie("token",token);

  res.status(200).json({message:"User loggedIn succesfully",user:{id:user._id,username:user.name,email:user.email}})

}


async function logoutUserController(req,res){
  const token=req.cookies.token;
  if(token){
    if (token) {
      await tokenBlackListModel.create({ token });
    }
  }
  res.clearCookie("token");//used to clear the cookies from the browser
  res.status(200).json({message:"user logged out successfully"});
}


// async function getMeController(req,res){
//   const user=await UserModel.findById(req.user.id);//is is not _id this id is added into req during the middleare execturion
//   return res.status(200).json({
//     message:"user details fetched successfully ",
//     user:{
//       id:user._id,
//       username:user.username,
//       email:user.username
//     }
//   })
// }
async function getMeController(req, res) {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      message: 'User details fetched successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Get Me Error:', error);

    return res.status(500).json({
      message: 'Failed to fetch user details',
    });
  }
}

module.exports={
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController
}
