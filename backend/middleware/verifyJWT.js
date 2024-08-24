import jwt from "jsonwebtoken";

export const verifyJWT = async (req,res,next) => {
    const token = req.headers["authorization" || "Authorization"]
    if(!token) return res.status(403).json({message : "Token is required"})
        const token1 = token.split(" ")[1];
    // console.log(token1)


    jwt.verify(token1 ,process.env.ACCESS_TOKEN_SECRET,(err,user) => {
        if(err) return res.status(403).json({message : "Token is invalid"})
        req.user = user.username;
        req.roles = user.roles;
        next();
    })


}