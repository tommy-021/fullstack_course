import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation/Navigation';
import { EventsPage } from './components/Events/EventsPage';
import { NewEventForm } from './components/NewEventForm/NewEventForm';
import './App.css';

export default function App() {
    return (
        <BrowserRouter>
            <div className="app-shell">
                <Navigation />
                <div className="page-container">
                    <Routes>
                        <Route path="/" element={<Navigate to="/events" replace />} />
                        {/* Nest everything under /events so parent can pass data to detail */}
                        <Route path="/events/*" element={<EventsPage />} />
                        <Route path="/events/new" element={<NewEventForm />} />
                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/events" replace />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}
