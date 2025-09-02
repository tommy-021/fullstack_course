import '../src/App.css';
import { Event } from '../src/components/Event/Event.tsx';
import { eventsData } from '../src/data.ts';

function App_exercise_05() {
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

export default App_exercise_05;
