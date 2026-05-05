import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_protected/posts/$id")({
  component: () => {
    const { id } = Route.useParams();
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">Edit post #{id}</h1>
        <p className="text-sm text-muted-foreground">Editor coming next (Step 6.2).</p>
        <Link to="/admin/posts" className="mt-4 inline-block text-sm underline">← Back to posts</Link>
      </div>
    );
  },
});
