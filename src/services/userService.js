import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';

class UserService {
    async getAllUsers() {
        return await prisma.user.findMany({
            select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getUserById(id) {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) throw new ApiError(400, 'Invalid user ID format');

        const user = await prisma.user.findUnique({
            where: { id: numericId },
            select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
        });

        if (!user) throw new ApiError(404, `User with ID ${numericId} not found`);
        return user;
    }

    async updateUser(id, updateData) {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) throw new ApiError(400, 'Invalid user ID format');

        const existingUser = await prisma.user.findUnique({ where: { id: numericId } });
        if (!existingUser) throw new ApiError(404, `User with ID ${numericId} not found`);

        if (updateData.email && updateData.email !== existingUser.email) {
            const emailTaken = await prisma.user.findUnique({ where: { email: updateData.email } });
            if (emailTaken) throw new ApiError(409, 'Email is already in use by another account');
        }

        return await prisma.user.update({
            where: { id: numericId },
            data: {
                name: updateData.name ?? existingUser.name,
                email: updateData.email ?? existingUser.email,
            },
            select: { id: true, name: true, email: true, updatedAt: true },
        });
    }

    async deleteUser(id) {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) throw new ApiError(400, 'Invalid user ID format');

        const existingUser = await prisma.user.findUnique({ where: { id: numericId } });
        if (!existingUser) throw new ApiError(404, `User with ID ${numericId} not found`);

        await prisma.user.delete({ where: { id: numericId } });
        return { message: `User with ID ${numericId} deleted successfully` };
    }

    async getProfile(userId) {
        return await this.getUserById(userId);
    }
}

export default new UserService();
