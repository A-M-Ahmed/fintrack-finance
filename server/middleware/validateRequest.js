export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (e) {
        // ZodError
        if (e.errors) {
            const message = e.errors.map(err => err.message).join(', ');
            return res.status(400).json({ message });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
