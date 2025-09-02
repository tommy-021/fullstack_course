import { Router } from 'express';
import { db } from '../data';
// import type { PollingEvent } from '../types';

export const eventsRouter = Router();

// GET /api/events
eventsRouter.get('/', (_req, res) => {
    res.json(db);
});
