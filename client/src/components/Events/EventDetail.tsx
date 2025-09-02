import type { PollingEvent } from './types';
import { Event as EventTable } from '../Event/Event';
import { WeatherPanel } from '../Weather/WeatherPanel';

export function EventDetail({ event }: { event?: PollingEvent }) {
    if (!event) {
        return <div role="alert">Událost nebyla nalezena.</div>;
    }
    return (
        <div className="event-detail">
            <EventTable
                id={event.id}
                title={event.title}
                dates={event.dates}
                location={event.location}
            >
                <WeatherPanel location={event.location} />
            </EventTable>
        </div>
    );
}
