// src/components/Events/EventDetail.spec.tsx
import { render, screen, waitFor, cleanup, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { EventsPage } from './EventsPage';
import type { PollingEvent } from './types';

const mockData: PollingEvent[] = [
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

    test('renderuje detail + tabulku + aktuální teplotu', async () => {
        global.fetch = jest.fn(async (url: string) => {
            if (url.includes('geocoding-api')) {
                return {
                    ok: true,
                    json: async () => ({ results: [{ latitude: 50.0755, longitude: 14.4378 }] }),
                } as Response;
            }
            if (url.includes('api.open-meteo.com')) {
                return {
                    ok: true,
                    json: async () => ({ current_weather: { temperature: 22.3 } }), // pouze teplota
                } as Response;
            }
            return { ok: false, json: async () => ({}) } as Response;
        }) as jest.Mock;

        render(
            <MemoryRouter initialEntries={['/events/1']}>
                <Routes>
                    <Route path="/events/*" element={<EventsPage data={mockData} />} />
                </Routes>
            </MemoryRouter>,
        );

        // Název události
        expect(await screen.findByText('Tým building')).toBeInTheDocument();

        // Počasí – zobrazuje číslo s °C (žádný vítr netestujeme)
        await waitFor(() =>
            expect(screen.getByTestId('weather')).toHaveTextContent(/\d+(\.\d+)?°C/),
        );

        // Tabulka existuje a obsahuje očekávané hodnoty
        const table = screen.getByRole('table');
        expect(within(table).getByText('Jméno')).toBeInTheDocument();
        expect(within(table).getByText('Honza')).toBeInTheDocument();
        expect(within(table).getAllByText(/^no$/i)).toHaveLength(2);
    });

    test('zobrazí chybový stav, když API (geocoding/forecast) selže', async () => {
        global.fetch = jest.fn(async () => ({ ok: false, json: async () => ({}) })) as jest.Mock;

        render(
            <MemoryRouter initialEntries={['/events/1']}>
                <Routes>
                    <Route path="/events/*" element={<EventsPage data={mockData} />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByText('Tým building')).toBeInTheDocument();
        await waitFor(() =>
            expect(screen.getByRole('alert')).toHaveTextContent(/počasí se nepodařilo/i),
        );
    });

    test('zobrazí „Událost nebyla nalezena“ pro neexistující ID', async () => {
        render(
            <MemoryRouter initialEntries={['/events/404']}>
                <Routes>
                    <Route path="/events/*" element={<EventsPage data={mockData} />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByRole('alert')).toHaveTextContent(/událost nebyla nalezena/i);
    });

    test('když událost nemá location, WeatherPanel se nenačítá', async () => {
        global.fetch = jest.fn(async () => ({ ok: true, json: async () => ({}) })) as jest.Mock;

        render(
            <MemoryRouter initialEntries={['/events/2']}>
                <Routes>
                    <Route path="/events/*" element={<EventsPage data={mockData} />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByText('Bez lokace')).toBeInTheDocument();
        expect(screen.queryByTestId('weather')).toBeNull();
        expect(screen.queryByRole('alert')).toBeNull();
    });
});
