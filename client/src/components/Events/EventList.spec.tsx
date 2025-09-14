import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EventsList } from './EventsList';

describe('EventsList (API)', () => {
    afterEach(() => {
        (global.fetch as jest.Mock | undefined)?.mockClear?.();
    });

    test('načte a vykreslí seznam událostí + správné odkazy', async () => {
        global.fetch = jest.fn(async (url: string) => {
            if (url.includes('/api/events')) {
                return {
                    ok: true,
                    json: async () => ({
                        items: [
                            { id: 1, title: 'Super akce', dates: [] },
                            { id: 'abc def', title: 'Planning', dates: [] },
                        ],
                    }),
                } as Response;
            }
            return { ok: false, json: async () => ({}) } as Response;
        }) as jest.Mock;

        render(
            <MemoryRouter>
                <EventsList />
            </MemoryRouter>,
        );

        // loading stav
        expect(screen.getByText(/načítám události/i)).toBeInTheDocument();

        // data
        await waitFor(() => {
            expect(screen.getByText('Super akce')).toBeInTheDocument();
            expect(screen.getByText('Planning')).toBeInTheDocument();
        });

        // odkazy
        expect(screen.getByRole('link', { name: 'Super akce' }))
            .toHaveAttribute('href', '/events/1');
        expect(screen.getByRole('link', { name: 'Planning' }))
            .toHaveAttribute('href', '/events/abc%20def');
    });

    test('zobrazí placeholder při prázdném seznamu', async () => {
        global.fetch = jest.fn(async () => ({
            ok: true,
            json: async () => ({ items: [] }),
        })) as jest.Mock;

        render(
            <MemoryRouter>
                <EventsList />
            </MemoryRouter>,
        );
        expect(await screen.findByText(/žádné události/i)).toBeInTheDocument();
    });

    test('zobrazí chybu, když API selže', async () => {
        global.fetch = jest.fn(async () => ({
            ok: false,
            status: 500,
            json: async () => ({}),
        })) as jest.Mock;

        render(
            <MemoryRouter>
                <EventsList />
            </MemoryRouter>,
        );
        expect(await screen.findByRole('alert')).toHaveTextContent(/nepodařilo se načíst/i);
    });
});
