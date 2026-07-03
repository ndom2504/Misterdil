import { Router } from 'express';
import { requireDb } from '../db.js';

export const notificationsRouter = Router();

notificationsRouter.get('/user/:userId', async (req, res) => {
  try {
    const sql = requireDb();
    const rows = await sql`
      SELECT * FROM notifications WHERE user_id = ${req.params.userId}
      ORDER BY created_at DESC
    `;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' });
  }
});

notificationsRouter.patch('/:id/read', async (req, res) => {
  try {
    const sql = requireDb();
    const rows = await sql`
      UPDATE notifications SET read = TRUE WHERE id = ${req.params.id} RETURNING *
    `;
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' });
  }
});
