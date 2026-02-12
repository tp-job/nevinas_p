import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
    user: { id: string };
}

// Extend Express Request to include `user`
declare global {
    namespace Express {
        interface Request {
            user?: { id: string };
        }
    }
}

const auth = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header('x-auth-token');

    if (!token) {
        res.status(401).json({ message: 'No token, authorization denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as AuthPayload;
        req.user = decoded.user;
        next();
    } catch {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default auth;
