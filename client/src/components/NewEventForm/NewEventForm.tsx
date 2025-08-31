import { useState } from 'react';
import './form.css';

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

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSent(false);

        if (!state.title.trim()) {
            setError('Název je povinný');
            return;
        }
        const timestamps = state.dates
            .map((d) => d && Date.parse(d))
            .filter((n): n is number => !Number.isNaN(n));
        if (timestamps.length === 0) {
            setError('Přidejte alespoň jedno datum');
            return;
        }

        const payload = {
            name: state.name || 'Team building',
            location: state.location || undefined,
            title: state.title,
            dates: timestamps,
        };

        try {
            const res = await fetch('/api/events', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Server vrátil chybu');
            setSent(true);
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
                    onChange={(e) =>
                        update('title', e.target.value)}
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
