import { Router } from 'express';
import { db } from '../data';

export const eventsRouter = Router();

// GET /api/events
eventsRouter.get('/', (_req, res) => {
    res.json(db);
});

// GET /api/events/:id
eventsRouter.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' }); // 400 Bad Request - špatný formát dat (např. id není číslo, payload nemá title)
    const ev = db.items.find((e) => e.id === id);
    if (!ev) return res.status(404).json({ error: 'Not found' }); // 404 Not Found - událost podle ID neexistuje
    res.json(ev);
});

// Pomocná proměnná pro generování ID (naváže na nejvyšší existující id)
let nextId = Math.max(...db.items.map((e) => e.id), 0) + 1;

// Základní validace payloadu z formuláře
function isCreatePayload(b: any): b is {
    title: string;
    location?: string;
    dates: number[]; } {
    return (
        b
        && typeof b.title === 'string'
        && b.title.trim().length > 0
        && Array.isArray(b.dates)
        && b.dates.every((n: unknown) => typeof n === 'number')
    );
}

// POST /api/events
// přidá novou událost ... kam skutečně uloží???
eventsRouter.post('/', (req, res) => {
    const body = req.body;

    if (!isCreatePayload(body)) {
        return res.status(400).json({ error: 'Invalid payload' });
    }

    try {
        const newEvent = {
            id: nextId++,
            title: body.title.trim(),
            location: body.location || undefined,
            dates: body.dates.map((ts: number) => ({ timestamp: ts, records: [] })),
        };

        db.items.push(newEvent);
        return res.status(201).json(newEvent);
    }
    catch {
        return res.status(500).json({ error: 'Internal server error' });
    }
});
