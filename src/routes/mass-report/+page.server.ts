import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import * as v from 'valibot'

const ReportSchema = v.object({
    channel: v.pipe(
        v.string(),
        v.nonEmpty('Please enter channel id or url')
    ),
    devKey: v.pipe(
        v.string(),
        v.uuid('Bad developer key')
    )
})

export const actions = {
    default: async (event) => {
        const data = await event.request.formData()

        console.log("channel id", data.get('channel'))
        console.log("devkey", data.get('devKey'))

        
        try{
            const reportData = v.parse(ReportSchema, {
                channel: data.get('channel') as string,
                devKey: data.get('devKey') as string
            })
        }
        catch(e){
            if(e instanceof v.ValiError){
                return fail(400, {
                    error: e.message
                })
            }
        }

        return { success: true }
    }
} satisfies Actions;