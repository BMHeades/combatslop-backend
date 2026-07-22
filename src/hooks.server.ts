import { error, type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';


export const handle: Handle = async ({ event, resolve }) => {

    const origin = event.request.headers.get('origin');

    if (event.url.pathname.startsWith('/api')) {
    // console.log(origin)

        if(!origin?.startsWith(env.CHROME_EXTENSION_ID) && !origin?.startsWith(env.FIREFOX_EXTENSION_ID)){
            error(403, 'unknown');
        }
    }

    // Handle preflight 
    if (event.request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': origin!,
                'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Vary': 'Origin'
            }
        });
    }

    const response = await resolve(event);

    if (event.url.pathname.startsWith('/api')) {
        response.headers.set('Access-Control-Allow-Origin', origin!);
    }

    return response;
};