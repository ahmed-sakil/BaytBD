import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxies (e.g. Nginx, Cloudflare, AWS ALB, Render, Railway)
app.set('trust proxy', 1);

// Permissive multi-origin CORS configuration with credentials support
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Dynamically reflect origin to allow Vercel, custom domains, and local interfaces
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Health Check endpoints
const healthCheck = (req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    organization: 'BaytBD Group of Companies',
  });
};
app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

// API Routes (Mounted under /api and root for seamless client compatibility)
app.use('/api', routes);
app.use(routes);

// Serve frontend static build if available
const frontendDist = process.env.FRONTEND_DIST_PATH || path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(frontendDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.status(200).send('BaytBD API Gateway operational. Frontend build not present at this directory.');
});

// Error handling
app.use(errorHandler);

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`BaytBD Backend running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  console.log(`Health check endpoint: /api/health`);
  console.log(`=========================================`);
});
