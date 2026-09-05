import type { Response } from 'express';

/** Standard API error shape */
function sendError(res: Response, status: number, message: string, error?: string): void {
    res.status(status).json({
        success: false,
        message,
        ...(error != null && { error }),
    });
}

/** 404 with consistent shape */
export function send404(res: Response, message: string): void {
    sendError(res, 404, message);
}
