import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { PollingEvent } from './types';
import { listEvents } from '../../apiClient';

export function EventsList() {
    const [data, setData] = useState<PollingEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const items = await listEvents();
                if (!cancelled) setData(items);
            }
            catch (e: unknown) {
                if (!cancelled) setError(e instanceof Error ? e.message : 'Chyba při načítání');
            }
            finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) return <div>Načítám události…</div>;
    if (error) return (
        <div role="alert">
            Nepodařilo se načíst:
            {error}
        </div>
    );

    return (
        <ul className="events-list" aria-label="events-list">
            {data.map((ev) => (
                <li key={String(ev.id)} className="events-list-item">
                    <Link to={`/events/${encodeURIComponent(String(ev.id))}`}>{ev.title}</Link>
                </li>
            ))}
            {data.length === 0 && <li className="no-data">Žádné události</li>}
        </ul>
    );
}
