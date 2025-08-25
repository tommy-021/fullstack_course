import * as React from 'react';
import { EventProps, UserRecord } from './types';

type VotesMap = Record<string, Record<number, UserRecord['answer']>>;

export const Event: React.FC<EventProps> = ({ location, title, dates }) => {
    const allNames = React.useMemo(() => {
        const names = new Set<string>();
        dates.forEach((date) => {
            date.records.forEach((record) => names.add(record.name));
        });
        return Array.from(names);
    }, [dates]);

    const votes = React.useMemo(() => {
        const map: VotesMap = {};
        allNames.forEach((name) => {
            map[name] = {};
            dates.forEach((date) => {
                const record = date.records.find((r) => r.name === name);
                if (record) {
                    map[name][date.timestamp] = record.answer;
                }
            });
        });
        return map;
    }, [allNames, dates]);

    return (
        <div>
            <h1>{title}</h1>
            {location && (
                <p>
                    Místo:
                    {' '}
                    {location}
                </p>
            )}

            {dates.length === 0 && <p>Žádná data</p>}

            {dates.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Jméno</th>
                            {dates.map((d) => (
                                <th key={d.timestamp}>
                                    {new Date(d.timestamp).toLocaleDateString('cs-CZ')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {allNames.map((name) => (
                            <tr key={name}>
                                <td>{name}</td>
                                {dates.map((d) => {
                                    const vote = votes[name]?.[d.timestamp] ?? '-';
                                    return <td key={d.timestamp}>{vote}</td>;
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
