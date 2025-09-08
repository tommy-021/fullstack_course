import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './form.css';
import { createEvent } from '../../apiClient';
import type { CreateEventRequest } from '../../apiClient';

type NewEventFormState = {
    name: string;
    title: string;
    location: string;
    dates: string[];
};

export function NewEventForm() {
    const [state, setState] = useState<NewEventFormState>({ name: '', title: '', location: '', dates: [''] });
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();

    const canAddMore = state.dates.length < 10;

    function update<K extends keyof NewEventFormState>(key: K, value: NewEventFormState[K]) {
        setState((s) => ({ ...s, [key]: value }));
    }

    function updateDate(idx: number, value: string) {
        setState((s) => ({ ...s, dates: s.dates.map((d, i) => (i === idx ? value : d)) }));
    }

    function addDate() {
        if (canAddMore) setState((s) => ({ ...s, dates: [...s.dates, ''] }));
    }

    function removeDate(idx: number) {
        setState((s) => ({ ...s, dates: s.dates.filter((_, i) => i !== idx) }));
    }

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setSent(false);

        if (!state.title.trim()) {
            setError('Název je povinný');
            return;
        }
        const timestamps: number[] = state.dates
            .map((d) => d.trim())
            .filter((d) => d.length > 0)
            .map((d) => Date.parse(d))
            .filter((n): n is number => !Number.isNaN(n));

        if (timestamps.length === 0) {
            setError('Přidejte alespoň jedno datum');
            return;
        }

        const payload: CreateEventRequest = {
            ...(state.name ? { name: state.name } : {}),
            location: state.location || undefined,
            title: state.title,
            dates: timestamps,
        };

        try {
            await createEvent(payload);
            setSent(true);
            navigate('/events');
        }
        catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            }
            else {
                setError('Odeslání se nezdařilo');
            }
        }
    }

    return (
        <form className="event-form" onSubmit={onSubmit}>
            <h2>Nová událost</h2>
            {error && <div role="alert" className="error">{error}</div>}
            {sent && <div role="status" className="success">Odesláno</div>}
            <div>
                <label>Název *:</label>
                <input
                    value={state.title}
                    onChange={(e) => update('title', e.target.value)}
                    placeholder="Např. Super akce"
                    required
                />
            </div>
            <div>
                <label>Jméno organizátora (volitelné)</label>
                <input
                    value={state.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Team building"
                />
            </div>
            <div>
                <label>Místo (volitelné)</label>
                <input
                    value={state.location}
                    onChange={(e) => update('location', e.target.value)}
                    placeholder="Praha"
                />
            </div>
            <fieldset>
                <legend>Termíny (1–10)</legend>
                {state.dates.map((d, i) => (
                    <div key={i} className="date-row">
                        <input type="date" value={d} onChange={(e) => updateDate(i, e.target.value)} />
                        <button type="button" onClick={() => removeDate(i)} aria-label={`remove-date-${i}`}>Odstranit</button>
                    </div>
                ))}
                <button type="button" onClick={addDate} disabled={!canAddMore}>Přidat datum</button>
            </fieldset>
            <button type="submit">Odeslat</button>
        </form>
    );
}
