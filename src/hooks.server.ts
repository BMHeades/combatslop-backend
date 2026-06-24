import { error, type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';



export const handle: Handle = async ({ event, resolve }) => {
    
    if (!env.CLIENT_ID) throw new Error('CLIENT_ID is not set');
    
    const origin = event.request.headers.get('origin');

    if(!origin) error(403, "unknown")


    const response = await resolve(event);
    if (event.url.pathname.startsWith('/api')) {
        response.headers.append('Access-Control-Allow-Origin', env.CLIENT_ID);
    }
    return response;
};