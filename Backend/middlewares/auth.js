import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({
    path:'../.env'
})
const isAuth=async(req,res,next)=>{
    try {
        const token= req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:"Unauthorized Request please login",
                success:false
            })
        }
        const decoded=await jwt.verify(token,process.env.jwt_Secret);
        if(!decoded){
            return res.status(401).json({
                message:"Invalid token please login again",
                success:false
            })
        }
        req.user=decoded.id;
        next()
    } catch (error) {
        res.status(500).json({
            message:error.message,
            success:false
         })
    }
}
export default isAuth