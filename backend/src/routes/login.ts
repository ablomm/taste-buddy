const jwt = require("jsonwebtoken");

const getUser = async (username:any, password:any) => {
    return { userId: "123", password, username };
  };

module.exports = async (req:any , res:any) => {
    
        const { username, password } = req.body;

        const user = await getUser(username, password);

        const token = jwt.sign(user, "tastebuddy", { expiresIn:"1h"});

        res.cookie("token", token, {
          httpOnly: true,
        })

        return res.redirect('/');
}