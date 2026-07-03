import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requireDb } from './db.js';
import { packagesRouter } from './routes/packages.js';
import { usersRouter } from './routes/users.js';
import { paymentsRouter } from './routes/payments.js';
import { notificationsRouter } from './routes/notifications.js';

dotenv.config({ path: '../.env' });
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    const sql = requireDb();
    await sql`SELECT 1 AS ok`;
    res.json({ status: 'ok', database: 'neon' });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      database: 'unavailable',
      message: error instanceof Error ? error.message : 'Erreur DB',
    });
  }
});

app.use('/api/users', usersRouter);
app.use('/api/packages', packagesRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/notifications', notificationsRouter);

app.listen(PORT, () => {
  console.log(`Misterdil API → http://localhost:${PORT}`);
});
