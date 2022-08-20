import jwt from "jsonwebtoken"
import {User} from './../resources/user/user.model.mjs'


const newToken= user=>{
    console.log(user.id)
    return jwt.sign({id:user._id}, 'learneverything',{
        expiresIn:'100d'
    })
}
export const verifyToken = token =>
    new Promise((resolve, reject) => {
    jwt.verify(token,'learneverything', (err, payload) => {
        if (err) return reject(err)
        resolve(payload)
    })
})
export const signUP= async (req,res)=>{
    if(!req.body.email || !req.body.password)
    return res.status(400).json({message:"must have email and password"})
    try{
    const newuser = await User.create({...req.body})
    const token=newToken(newuser)
    return res.status(201).json({token:token})
    }catch(err){
        return res.status(400).json({message:"email muust be uniqe"})
    }
}

export const signIN=async (req, res)=>{
    if(!req.body.email || !req.body.password)
    return res.status(400).json({message:"must have email and password"})
    try{
        const user=await User.findOne({
            email:req.body.email
        })
        .select("email password")
        .exec()
        if(!user)
        return res.status(400).json({message:"no such user"})
        
        const match=await user.checkPassword(req.body.password)
        if(!match)
        return res.status(400).json({message:"wrong email or password"})
        const token= newToken(user)
        return res.status(201).json({token:token})
    }catch(err){
        return res.status(500).end()
    }
}

//middleware
export const protect = async(req, res, next)=>{
    // console.log(req.body)
    const bearer= req.headers.authorization;
    console.log(bearer)
    if(!bearer || !bearer.startsWith("Bearer "))
    return res.status(401).json({mesage:"wrong auth"})
    const token = bearer.split('Bearer ')[1].trim()
    try{
        let payload = await verifyToken(token);
        let user = await User.findById(payload.id)
        .select("-password")
        .lean()
        .exec();
        if(!user){
        console.log("no user")
        return res.status(400).json({message:"bad token"});    
        }
        req.user=user
        next()
    }catch(err){
        console.log(err.message);
        return res.status(401).end()
    }

}