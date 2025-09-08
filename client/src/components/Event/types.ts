import type { components } from '../../apischeme';

export type UserRecord = components['schemas']['UserRecord'];
export type DateRecord = components['schemas']['DateRecord'];
export type PollingEvent = components['schemas']['PollingEvent'];

export type EventProps = Pick<PollingEvent, 'location' | 'title' | 'dates'>;
