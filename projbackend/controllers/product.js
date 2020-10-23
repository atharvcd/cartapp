const Product = require('../models/product');
const {check, validationResult} = require("express-validator");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req,res,id,next) => {
    Product.findById(id)
    .populate("category")
    .exec((err,product) => {
        if(err){
            return res.status(400).json({
                error : "Product not found in the database"
            })
        }
        req.product = product;
        next();
    })    
}

exports.createProduct = (req, res) => {

    // Assignment
    //---------------------------------------
    //const errors = validationResult(req);
    // if(!errors.isEmpty())
    // {
    //     var msg_arr = [];
    //     errors.array.forEach(element => {
    //         msg_arr.push(
    //             {
    //                 "msg" :element.message, 
    //                 "param" : element.param
    //             }
    //         );
    //     });
    //     return res.status(422).json({
    //         errors : msg_arr
    //     });
    // }
    //---------------------------------------

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err,fields,file) => {
        if(err){
            return res.status(400).json({
                error : "problem with image"
            })
        }

        //Destructure the fields
        const {name, description, price, category, stock} = fields;
        if(!name || !description || !price || !category || !stock)
        {
            return res.status(400).json({
                error : "Please include all the fields"
            })
        }
        
        let product = new Product(fields);
        
        //Handle File here
        if(file.photo)
        {
            if(file.photo.size > 3000000)
            {
                return res.status(400).json({
                    error : "File size too big!"
                })
            }
        }

        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;
        //Save product in Database

        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error : "Saving product in database failed"
                })
            }
            return res.json(product);
        });
    })
}

exports.getProduct = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

//Performance optimization for bulky files using middleware
//getProduct request won't get the file.
//Rather the file will be served in background which enhances the performance.
exports.photo = (req,res,next) => {
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.removeProduct = (req,res) => {
    const product = req.product;
    product.remove((err,deletedProduct) => {
        if(err){
            return res.status(400).json({
                error : "Failed to delete the product",
                deletedProduct
            })
        }
        return res.json(prod);
    })
}

exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err,fields,file) => {
        if(err){
            return res.status(400).json({
                error : "problem with image"
            })
        }
      
        let product = req.product;
        product = _.extend(product,fields);
        
        //Handle File here
        //Will this work if the admin doesn't select any file. Or if the admin keeps the fields empty
        //then will the same field in the database be replaced by empty string. 
        //Do we need some sort of validation?
        if(file.photo)
        {
            if(file.photo.size > 3000000)
            {
                return res.status(400).json({
                    error : "File size too big!"
                })
            }
        }

        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;
        //Save product in Database

        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error : "Updation of product in database failed"
                })
            }
            return res.json(product);
        });
    })
}

exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
    .select('-photo')
    .limit(limit)
    .populate("category")
    .sort([[sortBy,"asc"]])
    .exec((err,products) => {
        if(err){
            return res.status(400).json({
                error : "NO Product Found"
            })
        }
        return res.json(products);
    })
}


exports.getAllUniqueCategories = (req,res) => {
    Product.distinct("category",{},(err,categories) => {
        if(err){
            return res.status(400).json({
                error : "No Category Found"
            })
        }
        return res.json(categories);
    })
}

exports.updateStock = (req,res,next) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
                updateOne : {
                    filter : { _id : prod._id },
                    update : {$inc : {stock : -prod.count, sold : +prod.count} }
                }
            }
        }
    )
    Product.bulkWrite(myOperations,{},(err,products) => {
        if(err){
            return res.status(400).json({
                error : "Bulk Operation Failed"
            });
        }
        next();
    })
}