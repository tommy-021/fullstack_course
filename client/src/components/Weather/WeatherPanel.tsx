import { useWeather } from './useWeather';

export function WeatherPanel({ location }: { location?: string }) {
    const { data, loading, error } = useWeather(location);

    if (!location) return null;
    if (loading) return <div data-testid="weather">Načítám počasí…</div>;
    if (error) return (
        <div role="alert">
            Počasí se nepodařilo načíst:
            {error}
        </div>
    );
    if (!data) return null;

    return (
        <div data-testid="weather">
            Aktuální počasí ve městě
            {' '}
            {location}
            :
            {' '}
            {data.temperature}
            °C
        </div>
    );
}
