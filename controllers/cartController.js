const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");

const Cart = require("./../models/cartModel");

exports.deleteCartItem = factory.deleteOne(Cart);
exports.updateCartItem = factory.updateOne(Cart);

exports.getAllCartItems = catchAsync(async function(req, res) {
    // const isSaved = req.query.isSaved === "true";

    // const carts = await Cart.find({ 
    //     user: req.user._id,
    //     isSaved
    // }).populate({ path: "product" });

    const carts = await Cart.find({
        user: req.user._id
    }).populate({ path: "product" });

    const jsonData = {
        status: "success"
    };

    if (carts.length === 0) {
        jsonData.message = "No data available yet.";
    } else {
        jsonData.numOfResults = carts.length;
        jsonData.data = carts;
    };

    res.status(200).json(jsonData)
});

exports.addCartItem = catchAsync(async function(req, res, next) {
    const userId = req.user._id;
    const { amount, productId } = req.body;

    if (amount < 1) return next(new AppError(400, "Item amount must be more or equal to 1"));

    const cartItem = await Cart.findOne({
        user: userId,
        product: productId
    });

    const jsonData = { status: "success" };
    let newCartItem;

    if (cartItem) {
        const cartId = cartItem._id;

        const newAmount = amount + cartItem.amount;

        newCartItem = await Cart.findByIdAndUpdate(cartId, { 
            amount: newAmount, 
            isSaved: false
        }, 
        {
            new: true,
            runValidators: true
        });
        
        jsonData.message = "Changed cart item amount.";
    } else {
        const cartData = {
            amount,
            product: productId,
            user: userId
        }

        newCartItem = await Cart.create(cartData);

        jsonData.message = "Successfully add item to cart";
    };

    jsonData.data = newCartItem;

    res.status(200).json(jsonData);
});

exports.toggleSaveCartItem = catchAsync(async function(req, res, next) {
    const cartId = req.params.id;
    const isSaved = req.query.isSaved === "true";
    
    const cart = await Cart.findById(cartId).select("+isSaved");

    if (!cart) return next(new AppError(400, "No data found."));
    
    if (cart.isSaved === isSaved) return next(new AppError(400, `Cart item has been ${isSaved ? "saved." : "put back to cart."}`));

    const newCartItem = await Cart.findByIdAndUpdate(cartId, { isSaved }, {
        new: true
    });

    res.status(200).json({
        message: "success",
        data: newCartItem
    });
});

exports.checkoutCartItems = catchAsync(async function(req, res, next) {
    const { checkoutCartItems } = req.body;
    const userId = req.user._id;

    if (checkoutCartItems.length === 0) return next(new AppError(400, "You must input at least 1 item to checkout."));

    await Cart.deleteMany({
        user: userId,
        isSaved: false
    });

    for (const cartItem of checkoutCartItems) {
        const cartData = {
            amount: cartItem.amount,
            product: cartItem.productId,
            user: userId
        };

        await Cart.create(cartData);
    };

    res.status(200).json({
        status: "success",
        message: "Successfully updated checkout cart items."
    })
});