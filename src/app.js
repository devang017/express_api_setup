import express from 'express';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { ApiError } from './utils/apiError.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

// Mount all API endpoints under /api
app.use('/api', apiRouter);

// Catch-all for undefined routes (404) - Compatible with Express 4 & 5
app.use((req, res, next) => {
    next(new ApiError(404, `Cannot find ${req.method} ${req.originalUrl} on this server`));
});

// Central Error Handler (must be registered last)
app.use(errorHandler);

export default app;
