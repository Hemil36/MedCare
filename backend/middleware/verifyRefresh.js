import jwt from 'jsonwebtoken';
export const verifyRefresh = async (req, res) => {

    const cookie = req.cookies.jwt;
    // console.log(cookie)

    if (!cookie) {
        return res.status(403).json({ message: "Token is required" });
    }

    jwt.verify(cookie, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
       
        if(err)
        {
            return res.status(403).json({ message: "Refresh Token Expired" });
        }

        return res.status(200).json({})
    });


}