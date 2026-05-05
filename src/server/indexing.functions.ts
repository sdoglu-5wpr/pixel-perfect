import { createServerFn } from "@tanstack/react-start";
import { resolveIndexingState } from "./indexing.server";

export { NOINDEX_HEADER, resolveIndexingState } from "./indexing.server";
export type { IndexingState } from "./indexing.server";

export const getIndexingState = createServerFn({ method: "GET" }).handler(resolveIndexingState);
