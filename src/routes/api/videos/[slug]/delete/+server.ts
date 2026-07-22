import { undoVote } from '$lib/server/db/vote';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request }) => {
   
    const data = await request.json()
    console.log(data, params.slug)
   
    undoVote(params.slug, data.voterId)
    return new Response()
};