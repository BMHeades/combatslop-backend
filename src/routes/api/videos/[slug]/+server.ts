import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as v from 'valibot'
import { vote, checkForSlop } from '$lib/server/db/vote';

const videoIdSchema = v.pipe(
    v.string(),
    v.length(11)
)


export const GET: RequestHandler = async ({ params, request }) => {
    console.log(request.headers.get('origin'))

    let videoId
    try{
        videoId = v.parse(videoIdSchema, params.slug)
    }catch(e){
        error(400, "Invalid ID")
    }

    const isSlop = await checkForSlop(videoId)
    return json({isSlop})
};

export const POST: RequestHandler = async ({ request, params, getClientAddress }) => {
    const voteSchema = v.object({

        isSlop: v.boolean(),
        voterId: v.pipe(
            v.string(),
            v.uuid()
        )
    });
    let videoId;
    try{
        videoId = v.parse(videoIdSchema, params.slug)
    }catch(e){
        error(400, "Invalid ID")
    }

    const data = await request.json()
    try{
        const { isSlop, voterId } = v.parse(voteSchema, data)
    
        const voterIp = getClientAddress()
    
        await vote(videoId, isSlop, voterId, voterIp)
        return new Response();
    }catch(e){
        error(400, "Bad format")
    }
};