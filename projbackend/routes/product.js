const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const {getProductById, createProduct, getProduct, photo, removeProduct, 
        updateProduct, getAllProducts, getAllUniqueCategories} = require("../controllers/product");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");


//Params
router.param("userId",getUserById);
router.param("productId",getProductById);


//Actual routes
//create route
router.post(
    "/product/create/:userId",
    //Assignment
    //-----------------------------------------------------------------------------------------------------------
    // [
    //     check("name").isLength({min : 3}).withMessage("Name should have at least 3 characters"),
    //     check("description").isLength({min : 5}).withMessage("Description should have at least 5 characters"),
    //     check("price").isNumeric.withMessage("Price should be a Number")
    // ],
    //-----------------------------------------------------------------------------------------------------------
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createProduct
);

//read route
router.get("/product/:productId",getProduct);
router.get("/product/photo/:productId",photo);

//update route
router.put(
    "/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateProduct
);

//delete route
router.delete(
    "/product/:productId/:userId",
     isSignedIn, isAuthenticated, 
     isAdmin, 
     removeProduct
);

//listing route
router.get("/products",getAllProducts);
router.get("/products/categories",getAllUniqueCategories);
module.exports = router;