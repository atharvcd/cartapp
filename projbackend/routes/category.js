const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const {createCategory, getCategoryById, getCategory, getAllCategory, updateCategory, removeCategory} = require("../controllers/category");
const {getUserById} = require("../controllers/user");
const {isSignedIn, isAdmin, isAuthenticated} = require("../controllers/auth");


//params
router.param("userId",getUserById);
router.param("categoryId",getCategoryById);

//actual Routes

//create Routes
router.post(
    "/category/create/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createCategory
);

//Read Routes
router.get("/categories",getAllCategory);
router.get("category/:categoryId",isSignedIn,isAdmin,getCategory);

//Update Routes
router.put(
    "/category/:categoryId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateCategory
);

//Delete Routes
router.delete(
    "/category/:categoryId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    removeCategory
)

module.exports = router;

