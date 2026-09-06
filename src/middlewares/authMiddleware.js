import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Unauthorized: Access token is missing or malformed');
        }

        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new ApiError(401, 'Unauthorized: Token expired. Please login again');
            }
            throw new ApiError(401, 'Unauthorized: Invalid token');
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true },
        });

        if (!user) {
            throw new ApiError(401, 'Unauthorized: User no longer exists');
        }

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        next(error);
    }
};
