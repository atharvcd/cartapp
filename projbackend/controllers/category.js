const Category = require("../models/category");
exports.getCategoryById = (req,res,next,id) => {
    Category.findById(id).exec((err,category) => {
        if(err){
            return res.status(400).json({
                error : "Cannot find category in Database"
            })
        }
        req.category = category;
        next();
    })
}

exports.createCategory = (req,res) => {
    const category = new Category(req.body);
    category.save((err,ctr) => {
        if(err){
            return res.status(400).json({
                error : "Unable to save category in the database"
            })
        }
        return res.json(ctr);
    })
}

exports.getCategory = (req,res) => {
    return res.json(req.category);
}

exports.getAllCategory = (req,res) => {
    Category.find({}).exec((err,categories) => {
        if(err || !categories){
            return res.status(400).json({
                error : "No category found in the database"
            })
        }
        return res.json(categories);
    })
}

exports.updateCategory = (req,res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err,updatedCategory) => {
        if(err){
            return res.status(400).json({
                error : "Failed to update Category"
            })
        }
        return res.json(updatedCategory);
    })
}

exports.removeCategory = (req,res) => {
    //console.log(req.category);
    const category = req.category;
    category.remove((err,ctr) => {
        if(err){
            console.log(req.category);
            return res.status(400).json({
                error : `Failed to delete the category`
            })
        }
        console.log(req.category);
        return res.json({
            message : `Successfully Deleted category ${req.category.name}`        
        });
    })
}