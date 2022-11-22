import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.JWT_SECRET_KEY;

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    SECRET,
    {
      expiresIn: "30d",
    }
  );
};


export const isAuth = (req,res,next) => {
  const authorization = req.headers.authorization;

  if(authorization){
    const token = authorization.slice(7,authorization.length)
    jwt.verify(token,SECRET,(err,decode)=>{
      if(err){
        res.status(401).send({message:'Invalid Token'})
      }
      else {
        req.user = decode;
        next()
      }
    })
  }else{
    res.status(401).send({message:"No Token"})
  }
}