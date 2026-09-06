import authService from '../services/authService.js';

class AuthController {
    async register(req, res, next) {
        try {
            const result = await authService.register(req.validated);
            res.status(201).json({ success: true, message: 'User registered successfully', data: result });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const result = await authService.login(req.validated);
            res.status(200).json({ success: true, message: 'Login successful', data: result });
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const result = await authService.logout();
            res.status(200).json({ success: true, message: result.message });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
