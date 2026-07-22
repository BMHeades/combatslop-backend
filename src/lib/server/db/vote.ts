import { sql, eq, and } from "drizzle-orm";
import { db } from "."
import { videos, videoVotes, channels } from "./schema"

export const vote = async (videoId: string, isSlop: boolean, voterId: string, voterIp: string) => {
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
        console.log('[new vote]')

    }
    catch (e) {
        // console.log(e)
        console.log("[duplicate vote]")
    }
}

export const undoVote = async (videoId: string, voterId: string) => {
    try {
        const deletedVote = await db.delete(videoVotes)
            .where(and(eq(videoVotes.videoId, videoId), eq(videoVotes.voterId, voterId)))
            .returning({ isSlop: videoVotes.isSlop })

        console.log(deletedVote)
        if (deletedVote.length === 1) {
            await db.update(videos).set({
                up: sql`${videos.up} - ${deletedVote[0].isSlop ? 0 : 1}`,
                down: sql`${videos.down} - ${deletedVote[0].isSlop ? 1 : 0}`,
            })
        }
    }
    catch (e) {
        // console.log(e)
        console.log("[failed undo]")
    }
}

export const channelVote = async (voterId: string, voterIp: string, channelId: string, isSlop: boolean) => {

    await db.insert(channels).values({
        voterId,
        voterIp,
        channelId,
        isSlop
    })
    console.log('[new channel vote]')
}

export const checkForSlop = async (videoId: string): Promise<0 | 1 | 2> => {

    // 0 => not slop
    // 1 => is slop
    // 2 => unknown

    const result = await db.select({
        up: videos.up,
        down: videos.down
    })
        .from(videos)
        .where(eq(videos.id, videoId))

    if (result.length === 1) {
        const upVotes = result[0].up
        const downVotes = result[0].down
        const totalVotes = upVotes + downVotes

        if (downVotes / totalVotes >= 0.5) return 1

        if (upVotes >= 1) return 0
    }
    return 2
}