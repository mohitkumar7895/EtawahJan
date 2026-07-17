'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

type Props = {
  text: string
  hashtags?: string
  label?: string
}

export default function CopyBlock({ text, hashtags, label = 'Copy post' }: Props) {
  const [copied, setCopied] = useState(false)
  const fullText = hashtags ? `${text}\n\n${hashtags}` : text

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* fallback for older browsers */
      const ta = document.createElement('textarea')
      ta.value = fullText
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 overflow-hidden">
      <pre className="whitespace-pre-wrap break-words p-4 sm:p-5 text-sm text-slate-700 dark:text-slate-200 font-sans leading-relaxed max-h-80 overflow-y-auto">
        {text}
        {hashtags ? (
          <>
            {'\n\n'}
            <span className="text-indigo-600 dark:text-indigo-400">{hashtags}</span>
          </>
        ) : null}
      </pre>
      <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-3 flex justify-end bg-white dark:bg-slate-900">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500 transition"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              {label}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
