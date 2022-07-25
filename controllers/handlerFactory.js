const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAll = function(Model) {
    return catchAsync(async function(req, res) {
        const documents = await Model.find();

        res.status(200).json({
            message: "success",
            results: documents.length,
            data: documents
        })
    })
};

exports.getOne = function(Model, populateOptions) {
    return catchAsync(async function(req, res, next) {
        let query = Model.findById(req.params.id);

        if (populateOptions) query = query.populate(populateOptions);

        const document = await query;

        if (!document) return next(new AppError(404, "No data found"))

        res.status(200).json({
            message: "success",
            data: document
        });
    })
};

exports.createOne = function(Model) {
    return catchAsync(async function(req, res) {
        const newDocument = await Model.create(req.body);

        res.status(200).json({
            message: "success",
            data: newDocument
        });
    })
};

exports.deleteOne = function(Model) {
    return catchAsync(async function(req, res) {
        const document = await Model.findByIdAndDelete(req.params.id);

        if (!document) return next(new AppError(404, "No data found"));

        res.status(204).json({
            status: "success",
            data: null
        })
    })
};

exports.updateOne = function(Model) {
    return catchAsync(async function(req, res, next) {
        
        const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!document) return next(new AppError(404, "No data found"))

        res.status(200).json({
            status: "success",
            data: document
        })
    })
};