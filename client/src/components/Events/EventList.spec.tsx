import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EventsList } from './EventsList';
import type { PollingEvent } from './types';

describe('EventsList', () => {
    const data: PollingEvent[] = [
        { id: '1', title: 'Tým building', location: 'Praha', dates: [] },
        { id: '2', title: 'Planning', dates: [] },
    ];

    test('vykreslí seznam událostí jako odkazy', () => {
        render(
            <MemoryRouter>
                <EventsList data={data} />
            </MemoryRouter>,
        );

        // oba názvy událostí se zobrazí
        expect(screen.getByText('Tým building')).toBeInTheDocument();
        expect(screen.getByText('Planning')).toBeInTheDocument();

        // odkazy mají správné href
        expect(screen.getByRole('link', { name: 'Tým building' })).toHaveAttribute(
            'href',
            '/events/1',
        );
        expect(screen.getByRole('link', { name: 'Planning' })).toHaveAttribute(
            'href',
            '/events/2',
        );
    });

    test('zobrazí placeholder když není žádná událost', () => {
        render(
            <MemoryRouter>
                <EventsList data={[]} />
            </MemoryRouter>,
        );

        expect(screen.getByText(/žádné události/i)).toBeInTheDocument();
    });
});
