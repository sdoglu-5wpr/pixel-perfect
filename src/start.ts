import { createMiddleware, createStart } from "@tanstack/react-start";

const NOINDEX_HEADER = "noindex, nofollow, noarchive, nosnippet, noimageindex";

const robotsHeaderMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next();
  const { resolveIndexingState } = await import("./server/indexing.functions");
  const state = await resolveIndexingState();

  if (!state.enabled) {
    result.response.headers.set("X-Robots-Tag", NOINDEX_HEADER);
  }

  return result;
});

export const startInstance = createStart(() => ({
  requestMiddleware: [robotsHeaderMiddleware],
}));