const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");

const Cart = require("./../models/cartModel");

exports.getAllCartItems = factory.getAll(Cart, { path: "product" });
exports.deleteCartItem = factory.deleteOne(Cart);
exports.updateCartItem = factory.updateOne(Cart);

exports.addCartItem = catchAsync(async function(req, res, next) {
    const userId = req.user._id;
    const { productId } = req.params;
    const { amount } = req.body;

    if (amount < 1) return next(new AppError(404, "Item amount must be more or equal to 1"));

    const cartItem = await Cart.findOne({
        user: userId,
        product: productId
    });

    const jsonData = { status: "success" };
    let newCartItem;

    if (cartItem) {
        const cartId = cartItem._id;

        const newAmount = amount + cartItem.amount;

        newCartItem = await Cart.findByIdAndUpdate(cartId, { amount: newAmount }, {
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