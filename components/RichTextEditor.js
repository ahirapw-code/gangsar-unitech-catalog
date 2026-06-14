'use client';

import { useState, useRef } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon,
  Image as ImageIcon, Heading2, Heading3, Quote, Code, Minus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Simple Rich Text Editor menggunakan contentEditable + execCommand
export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  function exec(command, val = null) {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    handleChange();
  }

  function handleChange() {
    onChange(editorRef.current?.innerHTML || '');
  }

  function insertLink() {
    if (linkUrl) {
      exec('createLink', linkUrl);
      setLinkUrl('');
      setShowLinkInput(false);
    }
  }

  function insertImage() {
    if (imageUrl) {
      exec('insertHTML', `<img src="${imageUrl}" alt="gambar" style="max-width:100%;border-radius:8px;margin:8px 0;" />`);
      setImageUrl('');
      setShowImageInput(false);
    }
  }

  function insertHeading(tag) {
    exec('formatBlock', tag);
  }

  const tools = [
    { icon: <Bold className="h-4 w-4" />, action: () => exec('bold'), title: 'Bold' },
    { icon: <Italic className="h-4 w-4" />, action: () => exec('italic'), title: 'Italic' },
    { icon: <Underline className="h-4 w-4" />, action: () => exec('underline'), title: 'Underline' },
    { divider: true },
    { icon: <Heading2 className="h-4 w-4" />, action: () => insertHeading('h2'), title: 'Heading 2' },
    { icon: <Heading3 className="h-4 w-4" />, action: () => insertHeading('h3'), title: 'Heading 3' },
    { divider: true },
    { icon: <List className="h-4 w-4" />, action: () => exec('insertUnorderedList'), title: 'Bullet List' },
    { icon: <ListOrdered className="h-4 w-4" />, action: () => exec('insertOrderedList'), title: 'Numbered List' },
    { icon: <Quote className="h-4 w-4" />, action: () => insertHeading('blockquote'), title: 'Blockquote' },
    { icon: <Code className="h-4 w-4" />, action: () => exec('formatBlock', 'pre'), title: 'Code Block' },
    { icon: <Minus className="h-4 w-4" />, action: () => exec('insertHorizontalRule'), title: 'Divider' },
    { divider: true },
    { icon: <LinkIcon className="h-4 w-4" />, action: () => setShowLinkInput((v) => !v), title: 'Insert Link' },
    { icon: <ImageIcon className="h-4 w-4" />, action: () => setShowImageInput((v) => !v), title: 'Insert Image' },
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-1 p-2 bg-gray-50 border-b">
        {tools.map((tool, i) =>
          tool.divider ? (
            <div key={i} className="w-px h-6 bg-gray-300 mx-1" />
          ) : (
            <Button
              key={i}
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title={tool.title}
              onClick={tool.action}
            >
              {tool.icon}
            </Button>
          )
        )}
      </div>

      {/* Link input */}
      {showLinkInput && (
        <div className="flex gap-2 p-2 bg-blue-50 border-b">
          <input
            type="url"
            placeholder="https://..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 text-sm border rounded px-2 py-1"
            onKeyDown={(e) => e.key === 'Enter' && insertLink()}
          />
          <Button type="button" size="sm" onClick={insertLink} className="bg-[#1E8E5A] hover:bg-[#15663f] text-white">
            Sisipkan
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setShowLinkInput(false)}>
            Batal
          </Button>
        </div>
      )}

      {/* Image URL input */}
      {showImageInput && (
        <div className="flex gap-2 p-2 bg-blue-50 border-b">
          <input
            type="url"
            placeholder="URL gambar (https://...)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 text-sm border rounded px-2 py-1"
            onKeyDown={(e) => e.key === 'Enter' && insertImage()}
          />
          <Button type="button" size="sm" onClick={insertImage} className="bg-[#1E8E5A] hover:bg-[#15663f] text-white">
            Sisipkan
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setShowImageInput(false)}>
            Batal
          </Button>
        </div>
      )}

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleChange}
        dangerouslySetInnerHTML={{ __html: value }}
        className="min-h-[320px] p-4 text-gray-800 focus:outline-none prose prose-sm max-w-none"
        style={{ lineHeight: '1.7' }}
      />
    </div>
  );
}
