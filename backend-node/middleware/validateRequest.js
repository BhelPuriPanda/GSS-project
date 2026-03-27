const AppError = require('../utils/AppError');

const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            const errors = error.errors.map(err => err.message).join(', ');
            next(new AppError(`Validation Error: ${errors}`, 400));
        }
    };
};

module.exports = validateRequest;
