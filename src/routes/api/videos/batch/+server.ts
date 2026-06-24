import { checkForSlop } from '$lib/server/db/vote';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';

import * as v from 'valibot'

const IdsSchema = v.pipe(
    v.array(
        v.pipe(
            v.string(),
            v.length(11)
        )
    ),
    v.minLength(1),
    v.maxLength(50)
)

export const POST: RequestHandler = async ({ request }) => {
    console.log(request.headers.get('origin'))

    const data = await request.json()

    try {
        const ids = v.parse(IdsSchema, data.ids)

        const checked = []

        for (const id of ids) {
            checked.push({
                id,
                isSlop: await checkForSlop(id)
            })
        }

        return json({ checked })
    }catch(e){
        error(400, 'unknown')
    }
};