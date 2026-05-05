import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Typography from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import { useEffect, useState } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote, Minus,
  Link as LinkIcon, Image as ImageIcon, Youtube as YoutubeIcon,
  AlignLeft, AlignCenter, AlignRight, Undo2, Redo2, Code2, Eye,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  onPickImage?: () => Promise<{ url: string; alt: string | null } | null>;
  placeholder?: string;
};

function Btn({
  active, onClick, title, children, disabled,
}: {
  active?: boolean; onClick: () => void; title: string; children: React.ReactNode; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`h-8 w-8 inline-flex items-center justify-center rounded hover:bg-muted disabled:opacity-40 ${
        active ? "bg-muted text-foreground" : "text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function RichEditor({ value, onChange, onPickImage, placeholder }: Props) {
  const [mode, setMode] = useState<"wysiwyg" | "html">("wysiwyg");
  const [htmlBuf, setHtmlBuf] = useState(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Typography,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { class: "text-primary underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-md max-w-full h-auto my-2" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Youtube.configure({ width: 640, height: 360, HTMLAttributes: { class: "rounded-md my-2" } }),
      Placeholder.configure({ placeholder: placeholder ?? "Start writing…" }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[420px] px-5 py-4 focus:outline-none prose-headings:font-serif prose-img:rounded-md",
      },
    },
  });

  // Keep editor in sync if external value changes (e.g. loaded post)
  useEffect(() => {
    if (!editor) return;
    if (mode === "wysiwyg" && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
    if (mode === "html") setHtmlBuf(value);
  }, [value, editor, mode]);

  if (!editor) return <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">Loading editor…</div>;

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
  };

  const insertImage = async () => {
    if (onPickImage) {
      const picked = await onPickImage();
      if (picked) editor.chain().focus().setImage({ src: picked.url, alt: picked.alt ?? "" }).run();
      return;
    }
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const insertYoutube = () => {
    const url = window.prompt("YouTube URL");
    if (url) editor.commands.setYoutubeVideo({ src: url });
  };

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-2 py-1">
        <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo2 className="h-4 w-4" /></Btn>
        <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo2 className="h-4 w-4" /></Btn>
        <div className="mx-1 h-5 w-px bg-border" />
        <Btn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></Btn>
        <Btn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></Btn>
        <Btn title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="h-4 w-4" /></Btn>
        <Btn title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></Btn>
        <Btn title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}><Code className="h-4 w-4" /></Btn>
        <div className="mx-1 h-5 w-px bg-border" />
        <Btn title="H1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 className="h-4 w-4" /></Btn>
        <Btn title="H2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></Btn>
        <Btn title="H3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></Btn>
        <div className="mx-1 h-5 w-px bg-border" />
        <Btn title="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></Btn>
        <Btn title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></Btn>
        <Btn title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></Btn>
        <Btn title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="h-4 w-4" /></Btn>
        <div className="mx-1 h-5 w-px bg-border" />
        <Btn title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}><AlignLeft className="h-4 w-4" /></Btn>
        <Btn title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}><AlignCenter className="h-4 w-4" /></Btn>
        <Btn title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}><AlignRight className="h-4 w-4" /></Btn>
        <div className="mx-1 h-5 w-px bg-border" />
        <Btn title="Link" active={editor.isActive("link")} onClick={setLink}><LinkIcon className="h-4 w-4" /></Btn>
        <Btn title="Image" onClick={insertImage}><ImageIcon className="h-4 w-4" /></Btn>
        <Btn title="YouTube" onClick={insertYoutube}><YoutubeIcon className="h-4 w-4" /></Btn>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              if (mode === "wysiwyg") {
                setHtmlBuf(editor.getHTML());
                setMode("html");
              } else {
                onChange(htmlBuf);
                editor.commands.setContent(htmlBuf || "<p></p>", { emitUpdate: false });
                setMode("wysiwyg");
              }
            }}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-muted text-muted-foreground"
            title={mode === "wysiwyg" ? "Edit raw HTML" : "Back to visual"}
          >
            {mode === "wysiwyg" ? <><Code2 className="h-3.5 w-3.5" /> HTML</> : <><Eye className="h-3.5 w-3.5" /> Visual</>}
          </button>
        </div>
      </div>

      {mode === "wysiwyg" ? (
        <EditorContent editor={editor} />
      ) : (
        <textarea
          value={htmlBuf}
          onChange={(e) => { setHtmlBuf(e.target.value); onChange(e.target.value); }}
          className="font-mono w-full min-h-[420px] p-4 text-xs bg-card focus:outline-none"
          spellCheck={false}
        />
      )}
    </div>
  );
}
