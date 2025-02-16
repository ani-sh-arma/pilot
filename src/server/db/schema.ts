import {
  text,
  bigint,
  index,
  singlestoreTableCreator,
  timestamp,
} from "drizzle-orm/singlestore-core";

export const createTable = singlestoreTableCreator((name) => `pilot_${name}`);

export const file_table = createTable(
  "files_table",
  {
    id: bigint("id", { mode: "bigint", unsigned: true })
      .primaryKey()
      .autoincrement(),
    ownerId: text("owner_id").notNull(),
    name: text("name"),
    type: text("type"),
    parentId: bigint("parent_id", { mode: "bigint", unsigned: true }).notNull(),
    url: text("url"),
    size: text("size"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => {
    return [
      index("parent_index").on(t.parentId),
      index("owner_id_index").on(t.ownerId),
    ];
  },
);
export type DB_File = typeof file_table.$inferSelect;

export const folder_table = createTable(
  "folders_table",
  {
    id: bigint("id", { mode: "bigint", unsigned: true })
      .primaryKey()
      .autoincrement(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    parentId: bigint("parent_id", { mode: "bigint", unsigned: true }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => {
    return [
      index("parent_index").on(t.parentId),
      index("owner_id_index").on(t.ownerId),
    ];
  },
);
export type DB_Folder = typeof folder_table.$inferSelect;
