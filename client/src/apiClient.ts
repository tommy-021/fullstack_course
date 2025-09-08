import createClient from 'openapi-fetch';
import type { paths, components } from './apischeme';

export const client = createClient<paths>({ baseUrl: 'http://localhost:4000' });

export type PollingEvent = components['schemas']['PollingEvent'];
export type CreateEventRequest = components['schemas']['CreateEventRequest'];
export type ApiError = components['schemas']['Error'];
export type EventsListResponse = components['schemas']['EventsListResponse'];

export async function listEvents(): Promise<PollingEvent[]> {
    const { data, error } = await client.GET('/api/events');
    if (error) {
        const msg
            = typeof error === 'string'
                ? error
                : (error as Partial<ApiError>)?.error ?? 'Failed to load events';
        throw new Error(msg);
    }
    const list = (data as Partial<EventsListResponse> | undefined)?.items ?? [];
    return list as PollingEvent[];
}

export async function getEvent(id: number): Promise<PollingEvent> {
    const { data, error, response } = await client.GET('/api/events/{id}', {
        params: { path: { id } },
    });
    if (error) {
        if (response?.status === 404) throw new Error('Událost nenalezena');
        const msg
            = typeof error === 'string'
                ? error
                : (error as Partial<ApiError>)?.error ?? 'Failed to load event';
        throw new Error(msg);
    }
    return data as PollingEvent;
}

export async function createEvent(
    payload: CreateEventRequest,
): Promise<PollingEvent> {
    const { data, error } = await client.POST('/api/events', { body: payload });
    if (error) {
        const msg
            = typeof error === 'string'
                ? error
                : (error as Partial<ApiError>)?.error ?? 'Failed to create event';
        throw new Error(msg);
    }
    return data as PollingEvent;
}
