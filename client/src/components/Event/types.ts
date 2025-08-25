export type UserRecord = {
    name: string;
    answer: 'yes' | 'no' | 'if-needed';
};

export type DateRecord = {
    timestamp: number;
    records: UserRecord[];
};

// props komponenty Event_pokus
export type EventProps = {
    location?: string;
    id: string;
    title: string;
    dates: DateRecord[];
};
