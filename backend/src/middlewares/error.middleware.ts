import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('[API Error]:', err);

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(e => ({ field: e.path.join('.'), message: e.message }));
    const errorDetails = formattedErrors.map(e => `${e.field ? `${e.field}: ` : ''}${e.message}`).join(', ');
    res.status(400).json({
      success: false,
      message: errorDetails || 'Validation Error',
      errors: formattedErrors,
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
