import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as v from 'valibot'
import { vote, isVideoSlop } from '$lib/server/db/vote';

const videoIdSchema = v.pipe(
    v.string(),
    v.length(11)
)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400', // 24 hours
};

export const GET: RequestHandler = async ({ params, request }) => {



    // console.log(request.headers.get('origin'))

    // let videoId
    // try{
    //     videoId = v.parse(videoIdSchema, params.slug)
    // }catch(e){
    //     error(400, "Invalid ID")
    // }

    // const videos = await isVideoSlop(videoId)
    // if (videos.length > 0) {
    //     const isSlop: 'unknown' | boolean = videos[0].down / (videos[0].up + videos[0].down) >= 0.5
    //     return json({ isSlop })
    // }
    // const isSlop = 'unknown'
    return json({isSlop: true})
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