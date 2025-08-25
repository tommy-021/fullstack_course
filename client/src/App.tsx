import './App.css';
import { Event } from './components/Event/Event.tsx';
import { eventsData } from './data.ts';

function App() {
    return (
        <div className="demo">
            {eventsData.map((event) => (
                <Event
                    key={event.id} // vždycky unikátní klíč
                    id={event.id}
                    title={event.title}
                    location={event.location}
                    dates={event.dates}
                />
            ))}
        </div>
    );
}

export default App;
