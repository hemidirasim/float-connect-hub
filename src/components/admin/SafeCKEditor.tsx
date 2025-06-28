
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Code,
  Strikethrough,
  Underline
} from 'lucide-react';

interface SafeCKEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const SafeCKEditor: React.FC<SafeCKEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = "Bloq məzmununu yazın..." 
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[300px] bg-gray-700 border border-gray-600 rounded p-4 text-gray-400">
        Editor yüklənir...
      </div>
    );
  }

  return (
    <div className="border border-gray-600 rounded-lg bg-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-600 p-3 flex flex-wrap gap-1 bg-gray-750">
        {/* Heading buttons */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`text-white hover:bg-gray-600 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-600' : ''}`}
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`text-white hover:bg-gray-600 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-600' : ''}`}
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`text-white hover:bg-gray-600 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-600' : ''}`}
        >
          <Heading3 className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-600 mx-1" />
        
        {/* Text formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`text-white hover:bg-gray-600 ${editor.isActive('bold') ? 'bg-gray-600' : ''}`}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`text-white hover:bg-gray-600 ${editor.isActive('italic') ? 'bg-gray-600' : ''}`}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`text-white hover:bg-gray-600 ${editor.isActive('strike') ? 'bg-gray-600' : ''}`}
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`text-white hover:bg-gray-600 ${editor.isActive('code') ? 'bg-gray-600' : ''}`}
        >
          <Code className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-600 mx-1" />
        
        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`text-white hover:bg-gray-600 ${editor.isActive('bulletList') ? 'bg-gray-600' : ''}`}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`text-white hover:bg-gray-600 ${editor.isActive('orderedList') ? 'bg-gray-600' : ''}`}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`text-white hover:bg-gray-600 ${editor.isActive('blockquote') ? 'bg-gray-600' : ''}`}
        >
          <Quote className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-600 mx-1" />
        
        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          className="text-white hover:bg-gray-600"
          disabled={!editor.can().undo()}
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          className="text-white hover:bg-gray-600"
          disabled={!editor.can().redo()}
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Editor Content */}
      <div className="bg-white text-gray-900 min-h-[300px]">
        <EditorContent 
          editor={editor}
          className="prose prose-lg max-w-none p-4 min-h-[300px] focus-within:outline-none"
        />
      </div>
      
      {/* Footer info */}
      <div className="border-t border-gray-600 px-4 py-2 bg-gray-750">
        <p className="text-xs text-gray-400">
          HTML formatlama dəstəklənir. Mətn seçib format düymələrini istifadə edin.
        </p>
      </div>
    </div>
  );
};
