import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';

class AuthService {
    generateToken(userId) {
        return jwt.sign(
            { id: userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );
    }

    async register({ name, email, password }) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new ApiError(409, 'A user with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
            select: { id: true, name: true, email: true, createdAt: true },
        });

        const token = this.generateToken(user.id);
        return { user, token };
    }

    async login({ email, password }) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const token = this.generateToken(user.id);
        return {
            user: { id: user.id, name: user.name, email: user.email },
            token,
        };
    }

    async logout() {
        return { message: 'Logged out successfully' };
    }
}

export default new AuthService();
