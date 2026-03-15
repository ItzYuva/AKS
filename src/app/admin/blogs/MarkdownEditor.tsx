'use client'

import { useRef, useCallback } from 'react'
import {
  FaBold, FaItalic, FaHeading, FaLink, FaQuoteLeft,
  FaCode, FaListOl, FaListUl, FaImage, FaMinus
} from 'react-icons/fa'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  onImageInsert: () => void
  uploadingInline: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

export default function MarkdownEditor({
  value,
  onChange,
  onImageInsert,
  uploadingInline,
  textareaRef,
}: MarkdownEditorProps) {

  const insertMarkdown = useCallback((before: string, after: string, placeholder: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.slice(start, end)
    const text = selected || placeholder
    const newContent = value.slice(0, start) + before + text + after + value.slice(end)
    onChange(newContent)

    setTimeout(() => {
      textarea.focus()
      const newStart = start + before.length
      const newEnd = newStart + text.length
      textarea.setSelectionRange(newStart, newEnd)
    }, 0)
  }, [value, onChange, textareaRef])

  const insertLine = useCallback((prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const lineEnd = value.indexOf('\n', start)
    const end = lineEnd === -1 ? value.length : lineEnd
    const line = value.slice(lineStart, end)
    const newContent = value.slice(0, lineStart) + prefix + line + value.slice(end)
    onChange(newContent)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length + line.length)
    }, 0)
  }, [value, onChange, textareaRef])

  const btnClass = "p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary transition-colors"

  const Separator = () => <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-0.5" />

  return (
    <div>
      <div className="flex items-center gap-0.5 flex-wrap p-2 border border-b-0 border-gray-300 dark:border-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800/50">
        <button type="button" title="Heading 2" className={btnClass}
          onClick={() => insertLine('## ')}>
          <FaHeading className="h-3.5 w-3.5" />
        </button>
        <button type="button" title="Heading 3" className={btnClass}
          onClick={() => insertLine('### ')}>
          <span className="text-xs font-bold">H3</span>
        </button>

        <Separator />

        <button type="button" title="Bold" className={btnClass}
          onClick={() => insertMarkdown('**', '**', 'bold text')}>
          <FaBold className="h-3.5 w-3.5" />
        </button>
        <button type="button" title="Italic" className={btnClass}
          onClick={() => insertMarkdown('*', '*', 'italic text')}>
          <FaItalic className="h-3.5 w-3.5" />
        </button>

        <Separator />

        <button type="button" title="Link" className={btnClass}
          onClick={() => insertMarkdown('[', '](https://)', 'link text')}>
          <FaLink className="h-3.5 w-3.5" />
        </button>
        <button type="button" title="Insert Image" className={btnClass}
          onClick={onImageInsert} disabled={uploadingInline}>
          <FaImage className="h-3.5 w-3.5" />
        </button>

        <Separator />

        <button type="button" title="Blockquote" className={btnClass}
          onClick={() => insertLine('> ')}>
          <FaQuoteLeft className="h-3.5 w-3.5" />
        </button>
        <button type="button" title="Inline Code" className={btnClass}
          onClick={() => insertMarkdown('`', '`', 'code')}>
          <FaCode className="h-3.5 w-3.5" />
        </button>
        <button type="button" title="Code Block" className={btnClass}
          onClick={() => insertMarkdown('\n```\n', '\n```\n', 'code here')}>
          <span className="text-xs font-mono font-bold">{'{}'}</span>
        </button>

        <Separator />

        <button type="button" title="Unordered List" className={btnClass}
          onClick={() => insertLine('- ')}>
          <FaListUl className="h-3.5 w-3.5" />
        </button>
        <button type="button" title="Ordered List" className={btnClass}
          onClick={() => insertLine('1. ')}>
          <FaListOl className="h-3.5 w-3.5" />
        </button>
        <button type="button" title="Horizontal Rule" className={btnClass}
          onClick={() => {
            const textarea = textareaRef.current
            if (!textarea) return
            const pos = textarea.selectionStart
            const newContent = value.slice(0, pos) + '\n---\n' + value.slice(pos)
            onChange(newContent)
            setTimeout(() => {
              textarea.focus()
              const newPos = pos + 5
              textarea.setSelectionRange(newPos, newPos)
            }, 0)
          }}>
          <FaMinus className="h-3.5 w-3.5" />
        </button>

        {uploadingInline && (
          <span className="ml-2 text-xs text-primary animate-pulse">Uploading image...</span>
        )}
      </div>

      <textarea
        ref={textareaRef}
        name="content"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        rows={18}
        placeholder="Write your blog content here...&#10;&#10;Use the toolbar above to format text, or write Markdown directly."
        className="w-full px-4 py-3 rounded-b-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono text-sm"
      />
    </div>
  )
}
