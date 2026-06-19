import { sql, eq } from "drizzle-orm";
import { db } from "."
import { videos, videoVotes } from "./schema"

export const vote = async (videoId: string, isSlop: boolean, voterId: string, voterIp: string) => {
    console.log('new vote')
    try {
        await db.transaction(async (tx) => {

            await tx.insert(videos).values({
                id: videoId,
                up: isSlop ? 0 : 1,
                down: isSlop ? 1 : 0,
            }).onConflictDoUpdate({
                target: videos.id,
                set: {
                    up: sql`${videos.up} + ${isSlop ? 0 : 1}`,
                    down: sql`${videos.down} + ${isSlop ? 1 : 0}`,
                }
            })

            await tx.insert(videoVotes).values({
                videoId,
                voterId,
                isSlop,
                voterIp
            })
        })
    }
    catch(e){
        // console.log(e)
        console.log("duplicate vote")
    }
}

export const isVideoSlop = async (videoId: string) => {

    const result = await db.select({
        up: videos.up,
        down: videos.down
    })
    .from(videos)
    .where(eq(videos.id, videoId))

    return result
}