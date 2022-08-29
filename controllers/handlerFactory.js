const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAll = function(Model, populateOptions) {
    return catchAsync(async function(req, res) {
        let query = Model.find({ user: req.user._id });

        if (populateOptions) query = query.populate(populateOptions);

        const documents = await query;

        let jsonData = {
            status: "success"
        };

        if (documents.length === 0) {
            jsonData.message = "No data available yet.";
        } else {
            jsonData.numOfResults = documents.length;
            jsonData.data = documents;
        }

        res.status(200).json(jsonData);
    });
};

exports.getOne = function(Model, populateOptions) {
    return catchAsync(async function(req, res, next) {
        const _id = req.params.id;
        const userId = req.user._id;

        let query = Model.findOne({
            _id,
            user: userId
        });

        if (populateOptions) query = query.populate(populateOptions);

        const document = await query;

        if (!document) return next(new AppError(400, "No data found"))

        res.status(200).json({
            status: "success",
            data: document
        });
    })
};

exports.createOne = function(Model) {
    return catchAsync(async function(req, res) {
        const newDocument = await Model.create(req.body);

        res.status(200).json({
            status: "success",
            data: newDocument
        });
    })
};

exports.deleteOne = function(Model) {
    return catchAsync(async function(req, res, next) {
        const _id = req.params.id;
        const userId = req.user._id;

        const document = await Model.findOneAndDelete({
            _id,
            user: userId
        });

        if (!document) return next(new AppError(400, "No data found"));

        res.status(204).json({
            status: "success",
            data: null
        })
    })
};

exports.updateOne = function(Model) {
    return catchAsync(async function(req, res, next) {
        const _id = req.params.id;
        const userId = req.user._id;

        const document = await Model.findOneAndUpdate({
            _id,
            user: userId
        }, req.body, {
            new: true,
            runValidators: true
        });

        if (!document) return next(new AppError(400, "No data found"))

        res.status(200).json({
            status: "success",
            data: document
        })
    })
};