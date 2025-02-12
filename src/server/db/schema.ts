import {
  int,
  text,
  singlestoreTable,
  bigint,
  index,
} from "drizzle-orm/singlestore-core";

export const files = singlestoreTable(
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

export const folders = singlestoreTable(
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
