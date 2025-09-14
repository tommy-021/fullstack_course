import { Routes, Route, useParams } from 'react-router-dom';
import { EventsList } from './EventsList';
import { EventDetail } from './EventDetail';
import type { PollingEvent } from './types';
import { useEffect, useState } from 'react';

export function EventsPage() {
    return (
        <Routes>
            <Route path="/" element={<EventsList />} />
            <Route path=":id" element={<EventDetailLoader />} />
        </Routes>
    );
}

function EventDetailLoader() {
    const { id } = useParams();
    const [data, setData] = useState<PollingEvent | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        if (!id) return;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`http://localhost:4000/api/events/${encodeURIComponent(id)}`);
                if (!res.ok) throw new Error(res.status === 404 ? 'Událost nenalezena' : 'Chyba při načítání detailu');
                const json = await res.json();
                if (!cancelled) setData(json);
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
    }, [id]);

    if (loading) return <div>Načítám…</div>;
    if (error) return <div role="alert">{error}</div>;
    if (!data) return <div role="alert">Událost nebyla nalezena.</div>;

    return <EventDetail event={data} />;
}
