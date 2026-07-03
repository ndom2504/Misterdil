import { Router } from 'express';
import { requireDb } from '../db.js';

export const paymentsRouter = Router();

paymentsRouter.get('/user/:userId', async (req, res) => {
  try {
    const sql = requireDb();
    const rows = await sql`
      SELECT * FROM payments WHERE user_id = ${req.params.userId}
      ORDER BY created_at DESC
    `;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' });
  }
});

paymentsRouter.post('/', async (req, res) => {
  const { userId, packageId, amount, method, externalId } = req.body;
  if (!userId || !packageId || !amount || !method) {
    res.status(400).json({ error: 'Champs obligatoires manquants' });
    return;
  }
  try {
    const sql = requireDb();
    const rows = await sql`
      INSERT INTO payments (user_id, package_id, amount, method, status, external_id)
      VALUES (${userId}, ${packageId}, ${amount}, ${method}, 'paid', ${externalId ?? null})
      RETURNING *
    `;
    await sql`
      UPDATE packages SET payment_status = 'paid', updated_at = NOW()
      WHERE id = ${packageId}
    `;
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' });
  }
});
