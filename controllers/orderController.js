const factory = require("./handlerFactory");
const Order = require("./../models/orderModel");
const OrderItem = require("./../models/orderItemModel");
const Cart = require("./../models/cartModel");
const Product = require("./../models/productModel");
const ShippingCost = require("./../models/shippingCostModel");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const { TAX } = require("../appConfig");

exports.getOrder = factory.getOne(Order);

exports.getAllOrders = catchAsync(async function(req, res) {
    const isCanceled = req.query.isCanceled === "true";

    const orders = await Order.find({ 
        user: req.user._id,
        isCanceled
    });

    const jsonData = {
        status: "success"
    };

    if (orders.length === 0) {
        jsonData.message = "No data available yet.";
    } else {
        jsonData.results = orders.length;
        jsonData.data = orders;
    }

    res.status(200).json(jsonData);
});

exports.orderItems = catchAsync(async function(req, res, next) {
    const user = req.user;
    const userId = req.user._id;
    const { isExpedited, shippingAddress, paymentMethod } = req.body;
    const discount = req.body.discount ? req.body.discount : 0;

    checkIsInputValid(shippingAddress, paymentMethod, next);

    const carts = await Cart.find({ 
        user: userId,
        isSaved: false
    }).populate({
        path: "product",
        select: "+stock"
    });

    await checkIsOrderValid(carts, res, next);

    //Calculate grand total
    const subTotal = await getItemsSubTotal(carts);

    const tax = (subTotal * TAX) % 1 === 0 ? Math.trunc(subTotal * TAX) : Math.trunc(subTotal * TAX) + 1;

    const subTotalAfterTax = subTotal + tax;

    const shippingCostData = await ShippingCost.findOne({ region: user.region });

    let shippingCost;

    if (subTotal >= 2000 && !isExpedited) {
        shippingCost = 0;
    } else {
        shippingCost = isExpedited ? shippingCostData.expeditedShippingCost : shippingCostData.standardShippingCost;
    };

    const total = shippingCost + subTotalAfterTax;

    const grandTotal = total - discount;

    //Create order
    const orderData = {
        user: userId,
        shippingCost: shippingCostData._id,
        subTotal: subTotalAfterTax,
        tax,
        total,
        shippingAddress,
        isExpedited,
        paymentMethod,
        discount,
        grandTotal
    };

    const newOrder = await Order.create(orderData);

    await createOrderItem(newOrder._id, carts, next);

    res.status(200).json({
        status: "success",
        data: newOrder
    });
});

async function createOrderItem(orderId, carts) {
    for (const cartItem of carts) {
        const priceWhenOrdered = cartItem.product.price;
        const amount = cartItem.amount;

        const subTotal = priceWhenOrdered * amount;

        await updateProductInfo(cartItem.product._id, amount);

        const orderItemData = {
            order: orderId,
            product: cartItem.product,
            priceWhenOrdered,
            amount,
            subTotal
        };

        await OrderItem.create(orderItemData);

        await Cart.findByIdAndDelete(cartItem._id);
    }
};

async function updateProductInfo(productId, amount, next) {
    const product = await Product.findById(productId).select("+stock +totalSold");

    if (product.stock < amount) return next(new AppError(400, `There is not enough stock for ${product.name}`));

    product.stock -= amount;

    product.totalSold += amount;

    await product.save();
}

function checkIsInputValid(shippingAddress, paymentMethod, next) {
    if (!shippingAddress) {
        next(new AppError(400, "Please input your address."))
    };

    if (!paymentMethod) {
        next(new AppError(400, "Please input valid payment method."))
    };
}

async function checkIsOrderValid(carts, res, next) {
    //Check if there are any items in cart.
    if (carts.length === 0) {
        return next(new AppError(400, "No cart item available. Please put item in your cart before order."));
    };

    //Check if the stock enough for order.
    const notEnoughStockItems = [];

    for (const cartItem of carts) {
        if (cartItem.product.stock < cartItem.amount) {
            notEnoughStockItems.push(cartItem.product.name);
        }
    };

    if (notEnoughStockItems.length === 0) return true;

    let itemString;

    if (notEnoughStockItems.length === 1) {
        itemString = notEnoughStockItems[0];
    } else if (notEnoughStockItems.length === 2) {
        itemString = notEnoughStockItems.join(" and ");
    } else {
        const lastItem = notEnoughStockItems.pop();

        itemString = notEnoughStockItems.join(", ") + " and " + lastItem;
    }
    
    return res.status(400).json({
        status: "fail",
        message: `Sorry, there is not enough stock for ${itemString}.`,
        data: notEnoughStockItems
    });
};

async function getItemsSubTotal(carts) {
    let subTotal = 0;

    for (const cartItem of carts) {
        const cartItemSubTotal = cartItem.amount * cartItem.product.price;

        subTotal += cartItemSubTotal;
    };

    return subTotal;
};

exports.cancelOrder = catchAsync(async function(req, res, next) {
    const order = await Order.findById(req.params.id);

    if (order.isCanceled) return next(new AppError(400, "Order have been canceled."));

    const orderItems = await OrderItem.find({ order: order._id });

    for (const orderItem of orderItems) {
        const product = await Product.findById(orderItem.product).select("+stock +totalSold");

        product.stock += orderItem.amount;
        product.totalSold -= orderItem.amount;

        await product.save();
    };

    order.isCanceled = true;
    
    await order.save();

    res.status(204).json({
        status: "success",
        data: null
    })
});