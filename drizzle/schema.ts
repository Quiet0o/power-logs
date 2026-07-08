import { sqliteTable, AnySQLiteColumn, uniqueIndex, integer, text } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const users = sqliteTable("users", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	email: text().notNull(),
	createdAt: integer("created_at").default(sql`(unixepoch())`),
},
(table) => [
	uniqueIndex("users_email_unique").on(table.email),
]);

