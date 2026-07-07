import { uuid, pgTable, boolean, integer, text, primaryKey, varchar, timestamp } from 'drizzle-orm/pg-core';

export const videos = pgTable('videos', {
	id: varchar('id', { length: 11 }).notNull().primaryKey(),
	up: integer('up').notNull().default(0),		// denormalized counters
	down: integer('down').notNull().default(0), // denormalized counters
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const videoVotes = pgTable('video_votes', {
	videoId: varchar('video_id', { length: 11 }).notNull().references(() => videos.id),
	isSlop: boolean('is_slop').notNull(),
	voterId: uuid('voter_id').notNull(),
	voterIp: text('voter_ip').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
	primaryKey({ columns: [table.videoId, table.voterId] }),
	]
)

export const channels = pgTable('channels', {
	voterId: uuid('voter_id').notNull().references(() => devs.id), // No primary keys for now
	voterIp: text('voter_ip').notNull(),
	channelId: text('channel_id').notNull(),
	isSlop: boolean('is_slop').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const devs = pgTable('devs', {
	id: uuid('id').notNull().primaryKey(),
	role: text('role'),
	misc: text('misc'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
})