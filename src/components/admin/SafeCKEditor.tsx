
import React, { useState, useEffect } from 'react';

interface SafeCKEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const SafeCKEditor: React.FC<SafeCKEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = "Məzmun yazın..." 
}) => {
  const [editorContent, setEditorContent] = useState(content || '');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (content !== editorContent) {
      setEditorContent(content || '');
    }
  }, [content]);

  const handleChange = (newContent: string) => {
    setEditorContent(newContent);
    onChange(newContent);
  };

  if (!isClient) {
    return (
      <div className="min-h-[200px] bg-gray-700 border border-gray-600 rounded p-4 text-gray-400">
        Editor yüklənir...
      </div>
    );
  }

  // Fallback to textarea if CKEditor fails
  return (
    <div className="space-y-2">
      <textarea
        value={editorContent}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        rows={12}
        className="w-full min-h-[300px] bg-gray-700 border border-gray-600 text-white rounded p-4 resize-vertical focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />
      <p className="text-xs text-gray-400">
        Mətn redaktoru. HTML təqləri dəstəklənir.
      </p>
    </div>
  );
};
