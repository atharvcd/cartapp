const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const { getUserById, getUser, updateUser, userPurchaseList } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userId",getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

router.put("/user/:userId",
[
    check('name').isLength({min : 3}).withMessage("Name should have at least 3 characters"),
    check('lastname').isLength({min : 3}).withMessage("Last name should have at least 3 characters"),
    check("email").isEmail().withMessage("Email is Required!"),
    check("password").isLength({min : 3}).withMessage("Password should have at least 3 characters")
],
isSignedIn, isAuthenticated, updateUser);

router.get("/user/:userId/orders",isSignedIn, isAuthenticated, userPurchaseList)

/*
//Assignment
router.get("/users",getAllUsers);
*/
module.exports = router;