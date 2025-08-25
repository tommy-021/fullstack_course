import type { EventProps } from './components/Event/types.ts';

export const eventsData: EventProps[] = [
    {
        location: 'Praha',
        id: '1',
        title: 'Squash',
        dates: [
            {
                timestamp: new Date('2025-09-20').getTime(),
                records: [
                    { name: 'Pavel', answer: 'yes' },
                    { name: 'Josef', answer: 'no' },
                    { name: 'Martin', answer: 'if-needed' },
                ],
            },
            {
                timestamp: new Date('2025-09-21').getTime(),
                records: [
                    { name: 'Pavel', answer: 'yes' },
                    { name: 'Josef', answer: 'no' },
                    { name: 'Martin', answer: 'yes' },
                ],
            },
        ],
    },
    {
        location: 'Brno',
        id: '2',
        title: 'Padel',
        dates: [
            {
                timestamp: new Date('2025-10-01').getTime(),
                records: [
                    { name: 'Eva', answer: 'yes' },
                    { name: 'Jan', answer: 'no' },
                    { name: 'Petr', answer: 'if-needed' },
                ],
            },
            {
                timestamp: new Date('2025-10-02').getTime(),
                records: [
                    { name: 'Eva', answer: 'yes' },
                    { name: 'Jan', answer: 'no' },
                    { name: 'Petr', answer: 'yes' },
                ],
            },
        ],
    },
];
