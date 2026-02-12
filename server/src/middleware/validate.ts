import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Express middleware factory: validates request body against a Zod schema.
 * On validation failure, responds with 400 and structured error messages.
 */
export const validate =
    (schema: z.ZodSchema) =>
    (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.issues.map((issue: z.ZodIssue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }));
            res.status(400).json({ success: false, errors });
            return;
        }
        req.body = result.data;
        next();
    };
