export const validate = (schema) => (req, res, next) => {
    // safeParse validates req.body without throwing unhandled exceptions
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const issues = result.error.issues || result.error.errors || [];
        const formattedErrors = issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors,
        });
    }

    req.validated = result.data;
    next(); // Data is valid, proceed to controller!
};
