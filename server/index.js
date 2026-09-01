import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import leavesRouter from './routes/leaves.js';
import usersRouter from './routes/users.js';
import integrationsRouter from './routes/integrations.js';
import auditRouter from './routes/audit.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for local dev and production
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Log request helper
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/leaves', leavesRouter);
app.use('/api/users', usersRouter);
app.use('/api/integrations', integrationsRouter);
app.use('/api', auditRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    system: 'Intelligent Leave Priority System Backend',
    version: '2.4.0',
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend build assets from dist in production / standalone mode
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Fallback to index.html for client-side React SPA routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API Endpoint Not Found' });
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // Fallback response if dist/index.html isn't built yet
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Intelligent Leave Priority System API</title></head>
          <body style="font-family: sans-serif; padding: 2rem; background: #0f172a; color: #f8fafc;">
            <h1>Intelligent Leave Priority System Backend Running</h1>
            <p>API is healthy on port ${PORT}. Please run <code>npm run build</code> to compile Vite frontend assets.</p>
          </body>
        </html>
      `);
    }
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  INTELLIGENT LEAVE PRIORITY SYSTEM BACKEND SERVER     `);
  console.log(`  Running on http://localhost:${PORT}                  `);
  console.log(`  API Status: http://localhost:${PORT}/api/health      `);
  console.log(`=======================================================`);
});
