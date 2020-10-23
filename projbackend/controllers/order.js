const {Order, ProductCart} = require("../models/order");

exports.getOrderById = (req,res,next,id) => {
	Order.findById(id)
	.populate("products.product","name price")
	.exec((err,order) => {
		if(err){
			return res.status(400).json({
				error : "Order not found in Database"
			})
		}
		req.order = order;
		next();
	})
}

exports.getOrder = (req,res) => {
	return res.json(req.order);
}


exports.createOrder = (req,res) => {
	req.body.order.user = req.profile;

	const order = new Order(req.body.order);
	order.save((err,ord) => {
		if(err){
            return res.status(400).json({
                error : "Unable to save category in the database"
            })
        }
        return res.json(ctr);
	})
}

exports.getAllOrders = (req,res) => {
	Order.find()
	.populate("user","_id name lastName")
	.exec((err,orders) => {
		if(err){
			return res.status.json({
				error : "No orders found in the Database"
			})
		}
		return res.json(orders);
	})
}

exports.getOrderStatus = (req,res) => {
	return res.json(Order.schema.path("status").enumValues);
}

exports.updateStatus = (req,res) => {
	Order.update(
		{ _id : req.body.orderId},
		{$set: {status : req.body.status}},
		(err,order) => {
			if(err){
				return res.status(400).json({
					error : "Cannot update order in status"
				})
			}
			return res.json(order)
		}
	)
}