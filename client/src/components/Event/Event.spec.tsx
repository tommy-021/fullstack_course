import { render, screen } from '@testing-library/react';
import { Event } from './Event';
import { eventsData } from '../../data'; // cesta podle tvého projektu

describe('Komponenta Event – testy pro eventsData', () => {
    eventsData.forEach((event) => {
        describe(`Event id=${event.id} (${event.title})`, () => {
            test('zobrazuje název události', () => {
                render(<Event {...event} />);
                expect(screen.getByText(event.title)).toBeInTheDocument();
            });

            test('zobrazuje místo konání, pokud je zadáno', () => {
                render(<Event {...event} />);
                if (event.location) {
                    expect(screen.getByText(new RegExp(event.location, 'i'))).toBeInTheDocument();
                }
                else {
                    expect(screen.queryByText(/Místo:/i)).not.toBeInTheDocument();
                }
            });

            test('zobrazuje hlavičky tabulky s daty termínů', () => {
                render(<Event {...event} />);
                event.dates.forEach((date) => {
                    const formattedDate = new Date(date.timestamp).toLocaleDateString('cs-CZ');
                    expect(screen.getByText(formattedDate)).toBeInTheDocument();
                });
            });

            test('zobrazuje všechna jména účastníků', () => {
                render(<Event {...event} />);
                const allNames = Array.from(new Set(event.dates.flatMap((d) => d.records.map((r) => r.name))));
                allNames.forEach((name) => {
                    expect(screen.getByText(name)).toBeInTheDocument();
                });
            });

            test('zobrazuje správně hlasování účastníků', () => {
                render(<Event {...event} />);
                event.dates.forEach((date) => {
                    date.records.forEach((record) => {
                        expect(screen.getAllByText(record.answer)[0]).toBeInTheDocument();
                    });
                });
            });

            test('zobrazuje zprávu "Žádná data", pokud nejsou žádné termíny', () => {
                render(<Event id="empty" title="Prázdná událost" dates={[]} />);
                expect(screen.getByText(/Žádná data/i)).toBeInTheDocument();
            });
        });
    });
});
