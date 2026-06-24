import { error, type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';



// export const handle: Handle = async ({ event, resolve }) => {
    
//     if (!env.CLIENT_ID) throw new Error('CLIENT_ID is not set');
    
//     const origin = event.request.headers.get('origin');

//     if(!origin) error(403, "unknown")


//     const response = await resolve(event);
//     if (event.url.pathname.startsWith('/api')) {
//         response.headers.append('Access-Control-Allow-Origin', env.CLIENT_ID);
//     }
//     return response;
// };

export const handle: Handle = async ({ event, resolve }) => {
    if (!env.CHROME_EXTENSION_ID || !env.FIREFOX_EXTENSION_ID) {
        throw new Error('Extension IDs are not set');
    }

    const origin = event.request.headers.get('origin');

    const allowedOrigins = [
        `chrome-extension://${env.CHROME_EXTENSION_ID}`,
        `moz-extension://${env.FIREFOX_EXTENSION_ID}`
    ];

    if (event.url.pathname.startsWith('/api')) {
        if (!origin || !allowedOrigins.includes(origin)) {
            error(403, 'unknown');
        }
    }

    // Handle preflight
    // if (event.request.method === 'OPTIONS') {
    //     return new Response(null, {
    //         headers: {
    //             'Access-Control-Allow-Origin': origin!,
    //             'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    //             'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    //             'Vary': 'Origin'
    //         }
    //     });
    // }

    const response = await resolve(event);

    if (event.url.pathname.startsWith('/api')) {
        response.headers.set('Access-Control-Allow-Origin', origin!);
    }

    return response;
};