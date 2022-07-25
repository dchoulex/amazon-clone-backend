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