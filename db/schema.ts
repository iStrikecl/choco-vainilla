import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const catalogs=sqliteTable('catalogs',{id:text('id').primaryKey(),products:text('products').notNull(),revision:integer('revision').notNull().default(0)});
