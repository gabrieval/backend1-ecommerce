import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Handlebars
app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
      eq: (a, b) => a === b,
      multiply: (a, b) => (a * b).toFixed(2)
    }
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Expose io to routes
app.set('io', io);

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// View Routes
app.use('/', viewsRouter);

// 404
app.use((req, res) => {
  res.status(404).render('error', { message: 'Página no encontrada' });
});

// WebSocket
io.on('connection', (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);
  socket.on('disconnect', () => console.log(`❌ Cliente desconectado: ${socket.id}`));
});

// MongoDB + Server start
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    httpServer.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    process.exit(1);
  });
