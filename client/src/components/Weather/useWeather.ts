import { useEffect, useState } from 'react';

export type WeatherData = { temperature: number } | null;

export function useWeather(location?: string) {
    const [data, setData] = useState<WeatherData>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            if (!location) return;
            setLoading(true); setError(null);
            try {
                const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=cs&format=json`;
                const geoRes = await fetch(geoUrl);
                if (!geoRes.ok) throw new Error('Geocoding failed');
                const geo = await geoRes.json();
                const first = geo.results?.[0];
                if (!first) throw new Error('Lokace nenalezena');

                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${first.latitude}&longitude=${first.longitude}&current_weather=true`;
                const wRes = await fetch(weatherUrl);
                if (!wRes.ok) throw new Error('Počasí nenalezeno.');
                const w = await wRes.json();
                const cw = w.current_weather;
                if (!cw) throw new Error('No current weather');

                if (!cancelled) setData({ temperature: cw.temperature });
            }
            catch (e: any) {
                if (!cancelled) setError(e?.message || 'Chyba při načítání počasí');
            }
            finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [location]);

    return { data, loading, error };
}
