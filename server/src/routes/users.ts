import { Router } from 'express';
import { requireDb } from '../db.js';

export const usersRouter = Router();

usersRouter.get('/:firebaseUid', async (req, res) => {
  try {
    const sql = requireDb();
    const rows = await sql`
      SELECT id, firebase_uid, client_id, first_name, last_name, email, phone,
             country, balance, loyalty_points, phone_verified, created_at
      FROM users WHERE firebase_uid = ${req.params.firebaseUid}
    `;
    if (!rows.length) {
      res.status(404).json({ error: 'Utilisateur introuvable' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' });
  }
});

usersRouter.post('/', async (req, res) => {
  const { firebaseUid, clientId, firstName, lastName, email, phone, country } = req.body;
  if (!firebaseUid || !clientId || !firstName || !email) {
    res.status(400).json({ error: 'Champs obligatoires manquants' });
    return;
  }
  try {
    const sql = requireDb();
    const rows = await sql`
      INSERT INTO users (firebase_uid, client_id, first_name, last_name, email, phone, country)
      VALUES (${firebaseUid}, ${clientId}, ${firstName}, ${lastName ?? ''}, ${email}, ${phone ?? null}, ${country ?? 'Cameroun'})
      ON CONFLICT (firebase_uid) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        phone = EXCLUDED.phone,
        country = EXCLUDED.country,
        updated_at = NOW()
      RETURNING *
    `;
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' });
  }
});
