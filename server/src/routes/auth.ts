import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth';
import User from '../models/User';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();

// ---------- GET /api/auth  (current user) ----------
router.get('/', auth, async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user!.id).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ---------- POST /api/auth/register ----------
router.post(
    '/register',
    validate(registerSchema),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { firstName, lastName, email, password } = req.body;
            let username = req.body.username;
            if (!username && email) {
                username = email.split('@')[0];
            }

            // Check if user exists
            const existing = await User.findOne({ email });
            if (existing) {
                res.status(400).json({ message: 'User already exists' });
                return;
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const user = new User({
                firstName,
                lastName,
                username,
                email,
                password: hashedPassword,
            });
            await user.save();

            // Create token
            const payload = { user: { id: user.id } };
            jwt.sign(
                payload,
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error((err as Error).message);
            res.status(500).json({ message: 'Server Error', error: (err as Error).message });
        }
    }
);

// ---------- POST /api/auth/login ----------
router.post(
    '/login',
    validate(loginSchema),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                res.status(400).json({ message: 'Invalid Credentials' });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(400).json({ message: 'Invalid Credentials' });
                return;
            }

            const payload = { user: { id: user.id } };
            jwt.sign(
                payload,
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error((err as Error).message);
            res.status(500).json({ message: 'Server Error', error: (err as Error).message });
        }
    }
);

export default router;
