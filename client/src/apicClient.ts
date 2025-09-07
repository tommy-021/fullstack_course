import createClient from 'openapi-fetch';
import type { paths as Path, components } from './apischeme';
export type { components };

const client = createClient<Path>({ baseUrl: 'http://localhost:4000' });

client.GET('/api/events');

export const loadEventGenerated = async () => {
    // @ts-ignore
    const { data, error } = await client.GET('/api/events', { params: { query: { limit: 10 } } });
    if (error) {
        throw new Error(error);
    }

    return data.items;
};
