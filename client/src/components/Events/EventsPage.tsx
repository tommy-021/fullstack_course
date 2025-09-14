import { Routes, Route, useParams } from 'react-router-dom';
import { EventsList } from './EventsList';
import { EventDetail } from './EventDetail';
import type { PollingEvent } from './types';
import { useEffect, useState } from 'react';
import { getEvent } from '../../apiClient';

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

        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
            setError('Chybný identifikátor události');
            return;
        }

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const ev = await getEvent(numericId);
                if (!cancelled) setData(ev);
            }
            catch (e: unknown) {
                if (!cancelled) {
                    setError(e instanceof Error ? e.message : 'Chyba při načítání');
                }
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
