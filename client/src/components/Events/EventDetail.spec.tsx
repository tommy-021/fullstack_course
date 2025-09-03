import { render, screen, waitFor, cleanup, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { EventsPage } from './EventsPage';
import type { PollingEvent } from './types';

const data: PollingEvent[] = [
    {
        id: '1',
        title: 'Tým building',
        location: 'Praha',
        dates: [
            {
                timestamp: 1726514405258,
                records: [
                    { name: 'Honza', answer: 'yes' },
                    { name: 'Jana', answer: 'no' },
                ],
            },
            {
                timestamp: 1726600861177,
                records: [{ name: 'Jana', answer: 'no' }],
            },
        ],
    },
    {
        id: '2',
        title: 'Bez lokace',
        dates: [
            { timestamp: 1726514405258, records: [{ name: 'Petr', answer: 'if-needed' }] },
        ],
    },
];

describe('EventDetail ', () => {
    afterEach(() => {
        cleanup();
        (global.fetch as jest.Mock | undefined)?.mockClear?.();
    });

    test('renderuje detail + tabulku + aktuální teplotu (id=1)', async () => {
        global.fetch = jest.fn(async (url: string) => {
            if (url.includes('/api/events/1')) {
                return { ok: true, json: async () => data[0] } as Response;
            }
            if (url.includes('geocoding-api')) {
                return {
                    ok: true,
                    json: async () => ({ results: [{ latitude: 50.0755, longitude: 14.4378 }] }),
                } as Response;
            }
            if (url.includes('api.open-meteo.com')) {
                return {
                    ok: true,
                    json: async () => ({ current_weather: { temperature: 22.3 } }),
                } as Response;
            }
            return { ok: false, json: async () => ({}) } as Response;
        }) as jest.Mock;

        render(
            <MemoryRouter initialEntries={['/events/1']}>
                <Routes>
                    <Route path="/events/*" element={<EventsPage />} />
                </Routes>
            </MemoryRouter>,
        );

        // Název události
        expect(await screen.findByText('Tým building')).toBeInTheDocument();

        // Počasí – zkontroluj přesnou teplotu
        await waitFor(() =>
            expect(screen.getByTestId('weather')).toHaveTextContent('22.3°C'),
        );

        // Tabulka existuje a obsahuje očekávané hodnoty
        const table = screen.getByRole('table');
        expect(within(table).getByText('Jméno')).toBeInTheDocument();
        expect(within(table).getByText('Honza')).toBeInTheDocument();
        expect(within(table).getAllByText(/^no$/i)).toHaveLength(2);
    });

    test('zobrazí chybový stav, když API počasí (geocoding/forecast) selže (id=1)', async () => {
        global.fetch = jest.fn(async (url: string) => {
            if (url.includes('/api/events/1')) {
                return { ok: true, json: async () => data[0] } as Response; // detail OK
            }
            // Počasí selže
            return { ok: false, json: async () => ({}) } as Response;
        }) as jest.Mock;

        render(
            <MemoryRouter initialEntries={['/events/1']}>
                <Routes>
                    <Route path="/events/*" element={<EventsPage />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByText('Tým building')).toBeInTheDocument();
        await waitFor(() =>
            expect(screen.getByRole('alert')).toHaveTextContent(/počasí se nepodařilo/i),
        );
    });

    test('zobrazí „Událost nebyla nalezena“ pro neexistující ID (404)', async () => {
        global.fetch = jest.fn(async (url: string) => {
            if (url.includes('/api/events/404')) {
                return { ok: false, status: 404, json: async () => ({}) } as Response;
            }
            return { ok: true, json: async () => ({}) } as Response;
        }) as jest.Mock;

        render(
            <MemoryRouter initialEntries={['/events/404']}>
                <Routes>
                    <Route path="/events/*" element={<EventsPage />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByRole('alert')).toHaveTextContent(/Událost nenalezena/i);
    });

    test('když událost (id=2) nemá location, WeatherPanel se nenačítá', async () => {
        global.fetch = jest.fn(async (url: string) => {
            if (url.includes('/api/events/2')) {
                return { ok: true, json: async () => data[1] } as Response; // detail bez location
            }
            // jakékoliv počasí by se volat nemělo
            return { ok: true, json: async () => ({}) } as Response;
        }) as jest.Mock;

        render(
            <MemoryRouter initialEntries={['/events/2']}>
                <Routes>
                    <Route path="/events/*" element={<EventsPage />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByText('Bez lokace')).toBeInTheDocument();
        expect(screen.queryByTestId('weather')).toBeNull();
        // bezpečnostní aserce: žádné volání na open-meteo/geocoding
        expect((global.fetch as jest.Mock).mock.calls.some(([u]) => String(u).includes('open-meteo'))).toBe(false);
        expect((global.fetch as jest.Mock).mock.calls.some(([u]) => String(u).includes('geocoding-api'))).toBe(false);
    });
});
