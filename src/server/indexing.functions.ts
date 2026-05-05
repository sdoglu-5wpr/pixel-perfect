import { createServerFn } from "@tanstack/react-start";
import { resolveIndexingState } from "./indexing.server";

export const getIndexingState = createServerFn({ method: "GET" }).handler(resolveIndexingState);
