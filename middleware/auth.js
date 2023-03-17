

// import  jwt  from "jsonwebtoken";
// export const auth = (request, response, next)=>{

//     try{
//         const token = request.header("x-auth-token");
//     // console.log("token" , token);
//     jwt.verify(token, process.env.SECRET_KEY);
//     next();

//     }catch(err){
//         response.status(401).send({message : err.message});
//     }
    
// }; 


import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getUserByEmail } from '../services/users.services.js';

dotenv.config();

export const auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await getUserByEmail(decoded.email);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export default auth;
