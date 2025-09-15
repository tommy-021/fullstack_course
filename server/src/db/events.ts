import Database from 'better-sqlite3';

const db = new Database('events.db', { verbose: console.log });

type UserRecord = {
    name: string;
    answer: 'yes' | 'no' | 'if-needed';
};

type DateRecord = {
    timestamp: number;
    records: UserRecord[];
};

type PollingEvent = {
    id: number;
    title: string;
    location?: string;
    dates: DateRecord[];
};

export const createSchema = () => {
    db.exec(`
CREATE TABLE IF NOT EXISTS \`events\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`title\` VARCHAR(255) NOT NULL,
  \`location\` VARCHAR(255) NULL);

CREATE TABLE IF NOT EXISTS \`event_dates\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`timestamp\` INTEGER NOT NULL,
  \`event_id\` INTEGER NOT NULL);

CREATE TABLE IF NOT EXISTS \`records\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`name\` VARCHAR(255) NOT NULL,
  \`answer\` VARCHAR(45) NOT NULL CHECK (answer IN ('yes','no','if-needed')),
  \`event_date_id\` INTEGER NOT NULL);
`);
};

export const addEvent = (NewEvent: PollingEvent) => {
    const query = db.prepare(`INSERT INTO events (title, location) VALUES (?, ?);`);
    const newEventDb = query.run(NewEvent.title, NewEvent.location || '');
    const newEventId = newEventDb.lastInsertRowid;

    const addDateQuery = db.prepare(`INSERT INTO event_dates (timestamp, event_id) VALUES (?, ?)`);

    NewEvent.dates.forEach((d) => {
        addDateQuery.run(d.timestamp, newEventId);
    });
    return newEventId;
};

export const getEvents = () => {
    const query = db.prepare<[], PollingEvent>(
        `SELECT e.* FROM events e;`,
    );

    const events: PollingEvent[] = query.all();
    events.forEach((e: PollingEvent) => {
        const queryDates = db.prepare<[number], DateRecord>(
            `SELECT d.* FROM event_dates d WHERE event_id = ?;`,
        );

        const result: DateRecord[] = queryDates.all(e.id);
        e.dates = result.map((entry) => {
            return {
                records: [],
                timestamp: entry.timestamp,
            };
        });
    });

    return events;
};
export const getEvent = (eventId: number): PollingEvent => {
    const query = db.prepare<[number], PollingEvent>(`SELECT e.* FROM events e WHERE id = ?;`);
    const event = query.all(eventId);
    return event[0];
};
