const User = require("../models/user");
const {check, validationResult} = require("express-validator");
const jwt = require("jsonWebToken");
const expressJwt = require("express-jwt");

exports.signup = (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty(errors)){
        return res.status(422).json({
            error : errors.array()[0].msg
            // //Assignment
            // msg : errors.array()[0].msg,
            // param : errors.array()[0].param
            //--------------------------------
        });
    }

    const user = new User(req.body);
    user.save((error,user) => {
        if(error){
            return res.status(400).json({
                error : "Not able to save user in the database"
            });
        }
        res.json({
            name : user.name,
            email : user.email,
            id : user._id
        });
    });
}
exports.signin = (req,res) => {
    const {email,password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        var msg_arr = [];
        errors.array.forEach(element => {
            msg_arr.push(element.message);
        })
        return res.status(422).json({
            errors : msg_arr
        })
    }
    User.findOne({email}, (err,user) => {
        if(err || !user)
        {
            return res.status(400).json({
                error : "User email does not exist in the database"
            })
        }
        if(!user.authenticate(password))
        {
            return res.status(401).json({
                error : "Email and Password do not match"
            })
        }
        const token = jwt.sign({_id : user._id},process.env.SECRET);
        res.cookie("token",token,{expire : new Date() + 9999})

        const {_id, name, email, role} = user;
        return res.json({
            token,
            user : { _id, name , email, role}
        });
    });
}
exports.signout = (req,res) => {
    res.clearCookie("token");
    res.json({
        message : "User Signout Success"
    })
}

// Protected Routes
exports.isSignedIn = expressJwt({
    secret : process.env.SECRET,
    userProperty : "auth"
})



//Custom Middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker)
    {
        return res.status(403).json({
            error : "Access Denied"
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0)
    {
        return res.status(401).json({
            error : "You're not Admin. Access Denied!"
        })
    }
    next();
}