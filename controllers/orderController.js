const Order = require("./../models/orderModel");
const OrderItem = require("./../models/orderItemModel");
const Cart = require("./../models/cartModel");
const Product = require("./../models/productModel");
const ShippingCost = require("./../models/shippingCostModel");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const { TAX, DELIVERY_STATUS, CURRENT_TIME } = require("../appConfig");

exports.getOrderDetails = catchAsync(async function(req, res) {
    const userId = req.user._id;
    const orderId = req.params.id;

    const order = await Order.findOne({
        _id: orderId,
        user: userId
    });

    await updateOrderStatus(order);

    const orderItems = await OrderItem.find({ 
        order: orderId, 
        user: userId
    });

    const jsonData = {
        order,
        orderItems
    };

    res.status(200).json({
        status: "success",
        data: jsonData
    });
});

exports.getAllOrders = catchAsync(async function(req, res) {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId });

    const jsonData = {
        status: "success",
        numOfResults: orders.length,
        data: []
    };

    if (orders.length === 0) {
        jsonData.message = "No data available yet.";
    };

    for (const order of orders) {
        await updateOrderStatus(order);
    };

    if (orders.length > 0) {
        for (const order of orders) {
            const orderItems = await OrderItem.find({ order: order._id });

            jsonData.data.push({
                order,
                orderItems
            });
        };
    };

    res.status(200).json(jsonData);
});

async function updateOrderStatus(order) {
    const timeDifference = CURRENT_TIME - order.orderDate;

    if (order.isExpedited) {
        switch(true) {
            case timeDifference < 1 * 60 * 1000:
                order.status = DELIVERY_STATUS[0];
                break;
            case timeDifference < 2 * 60 * 1000:
                order.status = DELIVERY_STATUS[1];
                break;
            case timeDifference < 3 * 60 * 1000:
                order.status = DELIVERY_STATUS[2];
                break;
            case timeDifference >= 3 * 60 * 1000:
                order.status = DELIVERY_STATUS[3];
                break;
            default:
                break;
        }
    };

    if (!order.isExpedited) {
        switch(true) {
            case timeDifference < 5 * 60 * 1000:
                order.status = DELIVERY_STATUS[0];
                break;
            case timeDifference < 10 * 60 * 1000:
                order.status = DELIVERY_STATUS[1];
                break;
            case timeDifference < 15 * 60 * 1000:
                order.status = DELIVERY_STATUS[2];
                break;
            case timeDifference >= 20 * 60 * 1000:
                order.status = DELIVERY_STATUS[3];
                break;
            default:
                break;
        }
    };

    await order.save();
};

exports.orderBack = catchAsync(async function(req, res, next) {
    const userId = req.user._id;
    const orderId = req.params.id;

    await Order.findOneAndUpdate(
        {
            _id: orderId,
            user: userId
        }, 
        {
            status: DELIVERY_STATUS[0],
            isCanceled: false
        }
    );

    res.status(200).json({
        status: "success",
        message: "Successfully order back."
    })
});

exports.orderItems = catchAsync(async function(req, res, next) {
    const userId = req.user._id;
    const { isExpedited, shippingAddress, paymentMethod, creditCard } = req.body;

    const discount = req.body.discount ? req.body.discount : 0;

    if (!shippingAddress) return next(new AppError(400, "Please input your address."))

    if (!paymentMethod) return next(new AppError(400, "Please input a valid payment method."));

    const carts = await Cart.find({ 
        user: userId,
        isSaved: false
    }).populate({
        path: "product",
        select: "+stock"
    });

    if (carts.length === 0) {
        return next(new AppError(400, "No cart item available. Please put item in your cart before order."));
    };

    await checkIsOrderValid(carts, res, next);

    const shippingCostData = await ShippingCost.findOne({ prefecture: shippingAddress.prefecture });

    //Calculate grand total
    const subTotal = await getItemsSubTotal(carts);

    const tax = (subTotal * TAX) % 1 === 0 ? Math.trunc(subTotal * TAX) : Math.trunc(subTotal * TAX) + 1;

    const subTotalAfterTax = subTotal + tax;

    let shippingCost;

    if (subTotal >= 2000 && !isExpedited) {
        shippingCost = 0;
    } else {
        shippingCost = isExpedited ? shippingCostData.expeditedShippingCost : shippingCostData.standardShippingCost;
    };

    const total = shippingCost + subTotalAfterTax;

    const grandTotal = total - discount;

    if (paymentMethod === "Credit Card" && !creditCard){
        return next(new AppError(400, "Please input your credit card info to continue payment using credit card."));
    } 

    //Create order
    const orderData = {
        user: userId,
        shippingCost: shippingCostData._id,
        subTotal: subTotalAfterTax,
        tax,
        total,
        shippingAddress: shippingAddress._id,
        isExpedited,
        paymentMethod,
        discount,
        grandTotal,
        creditCard
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

// function checkIsInputValid(shippingAddress, paymentMethod, next) {
//     if (!shippingAddress) return next(new AppError(400, "Please input your address."))

//     if (!paymentMethod) return next(new AppError(400, "Please input a valid payment method."));
// };

async function checkIsOrderValid(carts, res, next) {
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

    if (order.isCanceled) return next(new AppError(400, "This order has been canceled."));

    const orderItems = await OrderItem.find({ order: order._id });

    for (const orderItem of orderItems) {
        const product = await Product.findById(orderItem.product).select("+stock +totalSold");

        product.stock += orderItem.amount;
        product.totalSold -= orderItem.amount;

        await product.save();
    };

    order.isCanceled = true;
    order.status = "Canceled";
    
    await order.save();

    res.status(204).json({
        status: "success",
        data: null
    })
});