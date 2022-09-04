const mongoose = require("mongoose");

const { PAYMENT_METHODS, DELIVERY_STATUS, CURRENT_TIME } = require("../appConfig");

const orderSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: {
                values: DELIVERY_STATUS,
                message: "Please input valid delivery status."
            }
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "An order must belong to an user."]
        },
        shippingCost: {
            type: mongoose.Schema.ObjectId,
            ref: "ShippingCost",
            required: [true, "An order must have a shipping cost"]
        },
        subTotal: Number,
        total: Number,
        tax: Number,
        discount: {
            type: Number,
            default: 0
        },
        grandTotal: Number,
        paymentMethod: {
            type: String,
            enum: {
                values: PAYMENT_METHODS,
                message: "Please input valid payment method."
            }
        },
        creditCard: {
            type: mongoose.Schema.ObjectId,
            ref: "CreditCard"
        },
        orderDate: {
            type: Date,
            default: Date.now(),
            set: function(orderDate) {
                const offset = new Date().getTimezoneOffset() * 60 * 1000;

                return orderDate - offset
            }
        },
        shippingAddress: {
            type: mongoose.Schema.ObjectId,
            ref: "Address",
            required: [true, "An order must have shipping address"]
        },
        isCanceled: {
            type: Boolean,
            default: false
        },
        isExpedited: Boolean
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

orderSchema.virtual("orderItems", {
    ref: "OrderItem",
    foreignField: "order",
    localField: "_id"
});

orderSchema.pre(/^find/, function(next) {
    this.populate({
        path: "shippingAddress creditCard shippingCost",
        select: "-_id"
    });

    this.populate({
        path: "user",
        select: "-passwordResetToken -passwordResetExpires"
    })

    next();
});

// orderSchema.pre("save", function(next) {
//     this.status = DELIVERY_STATUS[0];

//     next();
// });

// orderSchema.pre(/^find/, async function(next) {
//     this.orders = await this.find().clone();

//     for (const order of this.orders) {
//         const orderDate = new Date(order.orderDate).getTime();
//         const timeDifference = CURRENT_TIME - orderDate;
    
//         console.log(timeDifference)
    
//         if (!order.isCanceled && order.isExpedited) {
//             switch (timeDifference) {
//                 case (timeDifference < 1 * 60 * 1000):
//                     order.status = DELIVERY_STATUS[1]
//                     break;
//                 case timeDifference <= 2 * 60 * 1000:
//                     order.status = DELIVERY_STATUS[2]
//                     break;
//                 case (timeDifference > 2 * 60 * 1000):
//                     console.log("here")
//                     order.status = DELIVERY_STATUS[3]
//                     break;
//                 default:
//                     break;
//             }
//         };
    
//         if (!order.isCanceled && !order.isExpedited) {
//             switch (timeDifference) {
//                 case timeDifference < 10 * 60 * 1000:
//                     order.status = DELIVERY_STATUS[1]
//                     break;
//                 case timeDifference < 20 * 60 * 1000:
//                     order.status = DELIVERY_STATUS[2]
//                     break;
//                 case timeDifference < 30 * 60 * 1000:
//                     order.status = DELIVERY_STATUS[3]
//                     break;
//                 default:
//                     break;
//             }
//         };

//         if (timeDifference > 2 * 60 * 1000){
//             this.order = await this.findOne();
//             this.order.status = DELIVERY_STATUS[3]
//         }
    
//         console.log(order.status)
//     }

//     next();
// });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;