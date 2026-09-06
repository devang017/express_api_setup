import userService from '../services/userService.js';

class UserController {
    async getProfile(req, res, next) {
        res.status(200).json({ success: true, message: "User fetched successfully.", data: req.user });
    }

    async list(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json({ success: true, message: "Users fetched successfully.", data: users });
        } catch (error) { next(error); }
    }

    async getById(req, res, next) {
        try {
            const user = await userService.getUserById(req.params.id);
            res.status(200).json({ success: true, message: "User fetched successfully.", data: user });
        } catch (error) { next(error); }
    }

    async update(req, res, next) {
        try {
            const updated = await userService.updateUser(req.params.id, req.validated);
            res.status(200).json({ success: true, message: 'Updated successfully', data: updated });
        } catch (error) { next(error); }
    }

    async remove(req, res, next) {
        try {
            const result = await userService.deleteUser(req.params.id);
            res.status(200).json({ success: true, message: result.message });
        } catch (error) { next(error); }
    }

}

export default new UserController();
