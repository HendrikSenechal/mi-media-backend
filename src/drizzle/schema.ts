import {
  mysqlTable,
  varchar,
  int,
  bigint,
  timestamp,
  index,
} from 'drizzle-orm/mysql-core';

export const media = mysqlTable(
  'media',
  {
    id: bigint('ID', { mode: 'number' }).autoincrement().notNull().primaryKey(),
    // Object key in the R2 bucket, e.g. media/3f9c...a1.webp
    storageKey: varchar('STORAGE_KEY', { length: 255 }).notNull().unique(),
    originalName: varchar('ORIGINAL_NAME', { length: 255 }).notNull(),
    contentType: varchar('CONTENT_TYPE', { length: 100 }).notNull(),
    sizeBytes: int('SIZE_BYTES').notNull(),
    alt: varchar('ALT', { length: 255 }),
    category: varchar('CATEGORY', { length: 50 }),
    createdAt: timestamp('CREATED_AT', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [index('idx_media_category').on(table.category)],
);
