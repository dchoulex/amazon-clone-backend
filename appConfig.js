exports.TAX = 0.1;
exports.NUMBER_REGEX = /^[0-9]*$/;
exports.PREFECTURES = ["Hokkaido", "Tohoku", "Kanto", "Chubu", "Kinki", "Chugoku", "Shikoku", "Kyushu"];
exports.PAYMENT_METHODS = ["Credit Card", "Convenience Store", "ATM", "Amazon Points"];
exports.DELIVERY_STATUS = ["Ordered", "Shipped",  "Out for Delivery", "Delivered", "Canceled"];

const offset = new Date().getTimezoneOffset() * 60 * 1000;
exports.CURRENT_TIME = Date.now() - offset;