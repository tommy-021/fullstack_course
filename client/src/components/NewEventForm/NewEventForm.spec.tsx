import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { NewEventForm } from './NewEventForm';

describe('NewEventForm', () => {
    const user = userEvent.setup();

    // Ztišíme React Router “Future Flag” warningy v konzoli
    const originalWarn = console.warn;
    beforeAll(() => {
        console.warn = (...args: any[]) => {
            const msg = String(args[0] ?? '');
            if (msg.includes('React Router Future Flag Warning')) return;
            originalWarn(...args);
        };
    });
    afterAll(() => {
        console.warn = originalWarn;
    });

    afterEach(() => {
        (global.fetch as jest.Mock | undefined)?.mockClear?.();
    });

    test('validace: když není žádné datum, zobrazí chybu', async () => {
        render(
            <MemoryRouter>
                <NewEventForm />
            </MemoryRouter>,
        );

        // vyplníme název (label není asociovaný, použijeme placeholder)
        await user.type(screen.getByPlaceholderText('Např. Super akce'), 'Test akce');

        // necháme prázdné datum (výchozí prázdný řádek) a odešleme
        await user.click(screen.getByRole('button', { name: /odeslat/i }));

        expect(await screen.findByRole('alert')).toHaveTextContent(/přidejte alespoň jedno datum/i);
    });

    test('odeslání: úspěšný POST zobrazí stav "Odesláno" (a v appce by navigovalo na /events)', async () => {
        global.fetch = jest.fn(async () => ({
            ok: true,
            json: async () => ({ id: 123 }),
        })) as jest.Mock;

        render(
            <MemoryRouter>
                <NewEventForm />
            </MemoryRouter>,
        );

        // vyplnit název
        await user.type(screen.getByPlaceholderText('Např. Super akce'), 'Test akce');

        // vyplnit alespoň 1 datum (vezmeme první input[type="date"])
        const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
        await user.type(dateInput, '2024-09-16');

        await user.click(screen.getByRole('button', { name: /odeslat/i }));

        await waitFor(() =>
            expect(screen.getByRole('status')).toHaveTextContent(/odesláno/i),
        );

        // Pozn.: v reálné aplikaci teď proběhne navigate('/events'),
        // ale bez Router contextu na konkrétní route to tu neřešíme.
    });
});
