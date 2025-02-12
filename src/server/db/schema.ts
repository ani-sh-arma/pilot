import {
  text,
  bigint,
  index,
  singlestoreTableCreator,
} from "drizzle-orm/singlestore-core";

export const createTable = singlestoreTableCreator((name) => `pilot_${name}`);

export const files = createTable(
  "files_table",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
    name: text("name"),
    type: text("type"),
    parentId: bigint("parent_id", { mode: "bigint" }).notNull(),
    url: text("url"),
    size: text("size"),
  },
  (t) => {
    return [index("parent_index").on(t.parentId)];
  },
);

export const folders = createTable(
  "folders_table",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
    name: text("name").notNull(),
    parentId: bigint("parent_id", { mode: "bigint" }),
  },
  (t) => {
    return [index("parent_index").on(t.parentId)];
  },
);
