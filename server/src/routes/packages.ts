import { Router } from 'express';
import { requireDb } from '../db.js';

export const packagesRouter = Router();

packagesRouter.get('/user/:userId', async (req, res) => {
  try {
    const sql = requireDb();
    const rows = await sql`
      SELECT p.*, sf.transport, sf.storage, sf.insurance, sf.taxes, sf.total AS fee_total
      FROM packages p
      LEFT JOIN shipping_fees sf ON sf.package_id = p.id
      WHERE p.user_id = ${req.params.userId}
      ORDER BY p.declared_at DESC
    `;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' });
  }
});

packagesRouter.get('/:id', async (req, res) => {
  try {
    const sql = requireDb();
    const packages = await sql`SELECT * FROM packages WHERE id = ${req.params.id}`;
    if (!packages.length) {
      res.status(404).json({ error: 'Colis introuvable' });
      return;
    }
    const photos = await sql`SELECT * FROM package_photos WHERE package_id = ${req.params.id}`;
    const tracking = await sql`
      SELECT * FROM tracking_events WHERE package_id = ${req.params.id} ORDER BY occurred_at ASC
    `;
    const fees = await sql`SELECT * FROM shipping_fees WHERE package_id = ${req.params.id}`;
    res.json({ ...packages[0], photos, tracking, fees: fees[0] ?? null });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' });
  }
});

packagesRouter.post('/', async (req, res) => {
  const { userId, trackingNumber, storeName, description, declaredValue, estimatedWeight } =
    req.body;
  if (!userId || !trackingNumber || !storeName) {
    res.status(400).json({ error: 'Champs obligatoires manquants' });
    return;
  }
  try {
    const sql = requireDb();
    const rows = await sql`
      INSERT INTO packages (user_id, tracking_number, store_name, description, declared_value, estimated_weight)
      VALUES (${userId}, ${trackingNumber}, ${storeName}, ${description ?? null}, ${declaredValue ?? 0}, ${estimatedWeight ?? null})
      RETURNING *
    `;
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' });
  }
});

packagesRouter.patch('/:id/status', async (req, res) => {
  const { status, location, note } = req.body;
  if (!status) {
    res.status(400).json({ error: 'Statut requis' });
    return;
  }
  try {
    const sql = requireDb();
    const rows = await sql`
      UPDATE packages SET status = ${status}, updated_at = NOW()
      WHERE id = ${req.params.id}
      RETURNING *
    `;
    await sql`
      INSERT INTO tracking_events (package_id, status, location, note)
      VALUES (${req.params.id}, ${status}, ${location ?? null}, ${note ?? null})
    `;
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' });
  }
});
