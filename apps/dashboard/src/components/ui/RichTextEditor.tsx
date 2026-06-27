import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading2,
  Link as LinkIcon,
  Undo2,
  Redo2,
} from "lucide-react";
import Link from "@tiptap/extension-link";
import { useCallback } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  minHeight?: string;
}

const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ComponentType<{ size: number }>;
  title: string;
}) => (
  <button
    onClick={onClick}
    type="button"
    title={title}
    className={`p-2 rounded transition-colors ${
      isActive
        ? "bg-brand-gold text-brand-cream"
        : "bg-white text-brand-charcoal hover:bg-brand-cream"
    }`}
  >
    <Icon size={18} />
  </button>
);

const Separator = () => <div className="w-px bg-brand-beige-dark" />;

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write product description...",
  error,
  label,
  minHeight = "min-h-80",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-xs font-medium uppercase tracking-widest text-brand-stone font-sans">{label} *</label>}

      <div className="rounded-lg border border-brand-beige-dark overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-3 bg-brand-cream border-b border-brand-beige-dark">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={Bold}
            title="Bold (Ctrl+B)"
          />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={Italic}
            title="Italic (Ctrl+I)"
          />

          <Separator />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            icon={Heading2}
            title="Heading"
          />

          <Separator />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={List}
            title="Bullet List"
          />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={ListOrdered}
            title="Numbered List"
          />

          <Separator />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={Quote}
            title="Blockquote"
          />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            icon={Code}
            title="Code"
          />

          <ToolbarButton onClick={addLink} icon={LinkIcon} title="Add Link" />

          <Separator />

          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            icon={Undo2}
            title="Undo"
          />

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            icon={Redo2}
            title="Redo"
          />
        </div>

        {/* Editor */}
        <div className={`${minHeight} p-4 overflow-y-auto`}>
          <EditorContent
            editor={editor}
            className="prose prose-sm max-w-none focus:outline-none
              prose-h1:text-2xl prose-h1:font-bold prose-h1:my-2
              prose-h2:text-xl prose-h2:font-bold prose-h2:my-2
              prose-h3:text-lg prose-h3:font-bold prose-h3:my-2
              prose-p:my-1 prose-p:leading-relaxed
              prose-ul:my-2 prose-ul:ml-4 prose-li:my-0.5
              prose-ol:my-2 prose-ol:ml-4
              prose-blockquote:border-l-4 prose-blockquote:border-brand-gold prose-blockquote:pl-4 prose-blockquote:italic
              prose-code:bg-brand-cream prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm
              prose-a:text-brand-gold prose-a:underline
              text-brand-charcoal font-sans"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-500 font-sans">{error}</p>}

      <p className="text-xs text-brand-stone font-sans">
        Supports formatting, lists, links, and more. Minimum 10 characters required.
      </p>
    </div>
  );
}
