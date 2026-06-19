const express = require('express');
const path = require('path');
const mime = require('mime');

const app = express();

// Request logger
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

// Body parsers – required for JSON POST/PUT bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register AVIF MIME type (force to avoid duplicate mapping errors)
mime.define({ 'image/avif': ['avif'] }, true);

// Simple CORS middleware – allows all origins and necessary methods/headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// API routes
console.log('Carregando rotas /api ...');
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Main page (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin page
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Global error handler – prevents the server from crashing on unexpected errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (!res.headersSent) {
    res.status(500).send('Internal Server Error');
  } else {
    next(err);
  }
});

// 404 handler
app.use((req, res) => {
  console.log('404 atingido em:', req.method, req.url);
  res.status(404).send('Rota não encontrada');
});

// Start server with automatic fallback if the chosen port is already in use
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Servidor funcionando em http://localhost:${port}`);
  });
  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`Port ${port} already in use – trying ${nextPort}`);
      startServer(nextPort);
    } else {
      console.error('Server error:', err);
    }
  });
}

const PORT = process.env.PORT || 3003;
startServer(PORT);
