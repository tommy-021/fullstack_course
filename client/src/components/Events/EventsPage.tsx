import { Routes, Route, useParams } from 'react-router-dom';
import type { EventsListProps, PollingEvent } from './types';
import { EventsList } from './EventsList';
import { EventDetail } from './EventDetail';

export function EventsPage({ data }: EventsListProps) {
    return (
        <div>
            <Routes>
                <Route path="/" element={<EventsList data={data} />} />
                <Route path=":id" element={<EventDetailLoader data={data} />} />
            </Routes>
        </div>
    );
}

function EventDetailLoader({ data }: { data: PollingEvent[] }) {
    const { id } = useParams();
    const event = data.find((e) => String(e.id) === String(id));
    return <EventDetail event={event} />;
}
