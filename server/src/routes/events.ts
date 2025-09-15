import { Router } from 'express';
import { getEvents, getEvent as getEventDb, addEvent } from '../db/events';

export const eventsRouter = Router();

// GET /api/events
eventsRouter.get('/', (_req, res) => {
    const items = getEvents();
    res.json({ items });
});

// GET /api/events/:id
eventsRouter.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' }); // 400 Bad Request

    const ev = getEventDb(id);
    if (!ev) return res.status(404).json({ error: 'Not found' }); // 404 Not Found
    res.json(ev);
});

// Základní validace payloadu z formuláře
function isCreatePayload(b: any): b is {
    title: string;
    location?: string;
    dates: number[];
} {
    return (
        b
        && typeof b.title === 'string'
        && b.title.trim().length > 0
        && Array.isArray(b.dates)
        && b.dates.every((n: unknown) => typeof n === 'number')
    );
}

// POST /api/events
// přidá novou událost do DB
eventsRouter.post('/', (req, res) => {
    const body = req.body;

    if (!isCreatePayload(body)) {
        return res.status(400).json({ error: 'Invalid payload' });
    }

    try {
        const newEvent = {
            id: 0, // DB nastaví skutečné ID
            title: body.title.trim(),
            location: body.location || undefined,
            dates: body.dates.map((ts: number) => ({ timestamp: ts, records: [] })),
        };

        const newId = addEvent(newEvent);
        const created = getEventDb(Number(newId));

        return res.status(201).json(created ?? { ...newEvent, id: Number(newId) });
    }
    catch {
        return res.status(500).json({ error: 'Internal server error' });
    }
});
