const jwt = require("jsonwebtoken");

const getUser = async (username: any) => {
    return { userId: "123", password: "asd", username };
  };

module.exports = async (req:any , res:any) => {
        
    
        const { username, password } = req;

        console.log(username)

        const user = await getUser(username);

        console.log(user)

        const token = jwt.sign(user, "tastebuddy", { expiresIn:"1h"})

        console.log(token)

        res.cookie("token", token, {
          httpOnly: true,
        })

        console.log("successful!")
        return res.redirect('/SignUpPage');
}