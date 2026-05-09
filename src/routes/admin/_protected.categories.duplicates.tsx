import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  findDuplicateCategories,
  mergeCategoryPair,
} from "@/serverFns/admin-taxonomy.functions";

export const Route = createFileRoute("/admin/_protected/categories/duplicates")({
  component: DuplicatesPage,
});

type DupCat = { id: number; slug: string; name: string; post_count: number };
type DupPair = {
  a: DupCat;
  b: DupCat;
  reason: string;
  sample_a: string[];
  sample_b: string[];
};

function DuplicatesPage() {
  const [pairs, setPairs] = useState<DupPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const r = await findDuplicateCategories();
      setPairs(r.pairs as DupPair[]);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load duplicates");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refresh();
  }, []);

  const merge = async (winner: DupCat, loser: DupCat) => {
    if (
      !confirm(
        `Merge "${loser.slug}" (${loser.post_count} posts) INTO "${winner.slug}" (${winner.post_count} posts)?\n\nThis will:\n• reassign posts to ${winner.slug}\n• add a 301 redirect /${loser.slug}/ → /${winner.slug}/\n• rewrite inline links\n• delete the ${loser.slug} category`,
      )
    )
      return;
    setBusy(`${winner.id}:${loser.id}`);
    try {
      const r: any = await mergeCategoryPair({
        data: { winner_id: winner.id, loser_id: loser.id },
      });
      toast.success(
        `Merged ${r.loser_slug} → ${r.winner_slug} (${r.posts_moved} moved, ${r.posts_html_updated} posts updated)`,
      );
      await refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Merge failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Duplicate categories</h1>
          <p className="text-sm text-muted-foreground">
            Pairs sharing the same root slug (after stripping <code>-pr</code>,{" "}
            <code>-2</code>, <code>-communications</code>). Merging is logged in
            Activity and creates a 301 redirect.
          </p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
      </header>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : pairs.length === 0 ? (
        <div className="rounded-md border bg-muted/30 p-6 text-sm text-muted-foreground">
          No duplicate category pairs detected. 🎉
        </div>
      ) : (
        <div className="space-y-4">
          {pairs.map((p) => {
            const key = `${p.a.id}:${p.b.id}`;
            return (
              <div key={key} className="rounded-md border p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <CatCard cat={p.a} samples={p.sample_a} />
                  <CatCard cat={p.b} samples={p.sample_b} />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-3">
                  <span className="text-xs text-muted-foreground">
                    Reason: {p.reason}
                  </span>
                  <div className="ml-auto flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy === key}
                      onClick={() => merge(p.a, p.b)}
                    >
                      Keep {p.a.slug} <ArrowRight className="mx-1 h-3 w-3" />{" "}
                      merge {p.b.slug}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy === key}
                      onClick={() => merge(p.b, p.a)}
                    >
                      Keep {p.b.slug} <ArrowRight className="mx-1 h-3 w-3" />{" "}
                      merge {p.a.slug}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CatCard({ cat, samples }: { cat: DupCat; samples: string[] }) {
  return (
    <div className="rounded-sm border bg-card p-3">
      <div className="flex items-baseline justify-between">
        <code className="font-mono text-sm font-semibold">/{cat.slug}/</code>
        <span className="text-xs text-muted-foreground">
          {cat.post_count} posts
        </span>
      </div>
      <div className="mt-1 text-sm">{cat.name}</div>
      {samples.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
          {samples.map((t, i) => (
            <li key={i} className="truncate">• {t}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
