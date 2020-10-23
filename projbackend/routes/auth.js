var express = require('express');
var router = express.Router();
const {signup, signin, signout, isSignedIn} = require("../controllers/auth");
const {check, validationResult} = require('express-validator');

router.post('/signup',[
    check("name").isLength({min : 3}).withMessage("Name should have at least 3 characters!"),
    check("email").isEmail().withMessage("Email is required!"),
    check("password").isLength({min : 3}).withMessage("Password should have at least 3 characters!")
],
signup);

router.post('/signin',[
    check("email").isEmail().withMessage("Email is Required!"),
    check("password").isLength({min : 3}).withMessage("Password should have at least 3 characters")
],
signin);
router.get('/signout',signout);

router.get('/testroute', isSignedIn, (req,res) => {
    res.json({
        auth : req.auth
    })
})
module.exports = router;