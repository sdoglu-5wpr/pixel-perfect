import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Search, X } from "lucide-react";
import { listMediaForPicker, uploadMediaFromBase64 } from "@/serverFns/admin-editor.functions";

export type PickedMedia = { id: number; url: string; alt_text: string | null; filename: string | null };

type Props = {
  open: boolean;
  onClose: () => void;
  onPick: (m: PickedMedia) => void;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const s = String(r.result ?? "");
      const i = s.indexOf("base64,");
      resolve(i >= 0 ? s.slice(i + 7) : s);
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function MediaPicker({ open, onClose, onPick }: Props) {
  const [items, setItems] = useState<PickedMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    listMediaForPicker({ data: { page, pageSize: 40, q } })
      .then((r) => { setItems(r.items as any); setTotal(r.total); })
      .catch((e: any) => toast.error(e?.message ?? "Failed to load media"))
      .finally(() => setLoading(false));
  }, [open, page, q]);

  const upload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Max 10MB per file");
      return;
    }
    setUploading(true);
    try {
      const data_base64 = await fileToBase64(file);
      const m = await uploadMediaFromBase64({
        data: { filename: file.name, mime_type: file.type || "application/octet-stream", data_base64 },
      });
      toast.success("Uploaded");
      setItems((prev) => [m as any, ...prev]);
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;
  const totalPages = Math.max(1, Math.ceil(total / 40));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-5xl max-h-[85vh] flex flex-col rounded-lg bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="font-semibold">Media library</div>
          <button onClick={onClose} className="rounded p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex items-center gap-2 border-b px-4 py-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search filename, alt text, title…"
              value={q}
              onChange={(e) => { setPage(1); setQ(e.target.value); }}
              className="w-full rounded border pl-8 pr-3 py-1.5 text-sm"
            />
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.currentTarget.value = ""; }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-muted-foreground">No media found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {items.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { onPick(m); onClose(); }}
                  className="group relative aspect-square overflow-hidden rounded border bg-muted hover:ring-2 hover:ring-primary"
                  title={m.filename ?? ""}
                >
                  <img src={m.url} alt={m.alt_text ?? ""} className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t px-4 py-2 text-sm text-muted-foreground">
          <div>{total.toLocaleString()} items</div>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border px-2 py-1 disabled:opacity-40">Previous</button>
            <span>{page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded border px-2 py-1 disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
