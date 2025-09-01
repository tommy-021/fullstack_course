import { Link } from 'react-router-dom';
import type { EventsListProps } from './types';
// import './events.css';

export function EventsList({ data }: EventsListProps) {
    return (
        <ul className="events-list">
            {data.map((ev) => (
                <li key={String(ev.id)} className="events-list-item">
                    <Link to={`/events/${encodeURIComponent(ev.id)}`}>{ev.title}</Link>
                </li>
            ))}
            {data.length === 0 && <li className="no-data">Žádné události</li>}
        </ul>
    );
}
