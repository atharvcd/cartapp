const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productCartSchema = new mongoose.Schema(
    {
        product : {
            type : ObjectId,
            ref : "Product"
        },
        name : String,
        price : Number,
        count : Number
    }
)


const orderSchema = new mongoose.Schema(
    {
        products : [productCartSchema],
        transaction_id : {},
        amount : {
            type : Number
        },
        address : String,
        status : {
            type : String,
            default : "Received",
            enum : ["Cancelled", "Delivered", "Shipped", "Processing", "Received"]
        },
        updated : Date,
        user : {
            type : ObjectId,
            ref : "User"
        }
    },
    {timestamps : true}
);

const ProductCart = mongoose.model("ProductCart",productCartSchema);
const Order = mongoose.model("Order",orderSchema);

module.exports = {Order, ProductCart};