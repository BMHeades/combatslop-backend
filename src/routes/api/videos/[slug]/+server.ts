import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as v from 'valibot'
import { vote, isVideoSlop } from '$lib/server/db/vote';

const videoIdSchema = v.pipe(
    v.string(),
    v.length(11)
)

export const GET: RequestHandler = async ({ params }) => {
    
    const videoId = v.parse(videoIdSchema, params.slug)

    const videos = await isVideoSlop(videoId)
    if (videos.length > 0) {
        const isSlop: 'unknown' | boolean = videos[0].down / (videos[0].up + videos[0].down) >= 0.5
        return json({ isSlop })
    }
    const isSlop = 'unknown'
    return json({ isSlop })
};

export const POST: RequestHandler = async ({ request, params, getClientAddress }) => {
    const voteSchema = v.object({
        creatorHandle: v.pipe(
            v.string(),
            v.nonEmpty(),
            v.maxLength(50)
        ),

        isSlop: v.boolean(),
        voterId: v.pipe(
            v.string(),
            v.uuid()
        )
    });

    const videoId = v.parse(videoIdSchema, params.slug)

    const data = await request.json()
    const { creatorHandle, isSlop, voterId } = v.parse(voteSchema, data)

    const voterIp = getClientAddress()

    await vote(videoId, creatorHandle, isSlop, voterId, voterIp)
    return new Response();
};