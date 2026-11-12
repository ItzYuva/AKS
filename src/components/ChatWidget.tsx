'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

const SUGGESTED_QUESTIONS = [
  'What does Aditya do?',
  'Tell me about his projects',
  'What are his technical skills?',
];

const FOLLOW_UP_POOL = [
  'What technologies does he work with?',
  'Tell me about his work experience',
  'Does he write blogs?',
  "What's his educational background?",
  'How can I contact him?',
  'Does he have a GitHub?',
  'What is he currently working on?',
  'What kind of AI projects has he built?',
  'What are his strongest skills?',
  'Has he done any internships?',
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowTooltip(true), 2000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 7000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const sendMessage = async (text?: string) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMsg = errorData?.error || 'Failed to get response';
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: errorMsg, isError: true },
        ]);
        setIsLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.text) {
                assistantContent += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: assistantContent,
                  };
                  return updated;
                });
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }

      setSuggestionIndex((prev) => (prev + 2) % FOLLOW_UP_POOL.length);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I'm having trouble connecting right now. Please try again later!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasMessages = messages.length > 0;
  const userMessageCount = messages.filter((m) => m.role === 'user').length;
  const isAtLimit = userMessageCount >= 50;
  const lastMessage = messages[messages.length - 1];
  const showFollowUps =
    !isLoading &&
    lastMessage?.role === 'assistant' &&
    !lastMessage?.isError &&
    lastMessage?.content.length > 0;

  const followUps = [
    FOLLOW_UP_POOL[suggestionIndex % FOLLOW_UP_POOL.length],
    FOLLOW_UP_POOL[(suggestionIndex + 1) % FOLLOW_UP_POOL.length],
  ];

  return (
    <>
      {/* Tooltip */}
      {showTooltip && !isOpen && (
        <div className="fixed bottom-8 right-22 z-50 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm font-medium px-4 py-2 rounded-xl shadow-lg border border-zinc-200 dark:border-white/15 whitespace-nowrap animate-[fadeIn_0.3s_ease]">
          Chat with me
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-8 border-l-white dark:border-l-zinc-800" />
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setShowTooltip(false); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg overflow-hidden ring-2 ring-zinc-300 dark:ring-zinc-600 ring-offset-2 ring-offset-white dark:ring-offset-[#09090b] hover:ring-zinc-400 dark:hover:ring-zinc-500 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <Image
          src="/profile.avif"
          alt="Chat with Aditya"
          width={56}
          height={56}
          className="w-full h-full object-cover"
        />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl shadow-2xl border border-zinc-200 dark:border-white/15 flex flex-col overflow-hidden bg-white dark:bg-[#0c0c0e] animate-[fadeIn_0.2s_ease]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-200 dark:border-white/10">
            <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-700 shrink-0">
              <Image
                src="/profile.avif"
                alt="Aditya"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-zinc-900 dark:text-zinc-100 font-medium text-sm leading-tight">
                Aditya&apos;s AI Assistant
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <p className="text-zinc-500 dark:text-zinc-400 text-xs">Online</p>
              </div>
            </div>
            {hasMessages && (
              <button
                onClick={() => { setMessages([]); setSuggestionIndex(0); }}
                className="text-zinc-400 dark:text-zinc-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                aria-label="Clear chat"
                title="Clear chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-white transition-colors p-1 cursor-pointer"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Welcome */}
            {!hasMessages && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-14 h-14 rounded-full overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-700 mb-4">
                  <Image
                    src="/profile.avif"
                    alt="Aditya"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 leading-relaxed">
                  Hi! I&apos;m Aditya&apos;s AI assistant. Ask me anything about his work, experience, or projects!
                </p>
                <div className="w-full space-y-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="w-full text-sm text-zinc-600 dark:text-zinc-300 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition-all text-center cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 mr-2 mt-1">
                    <Image src="/profile.avif" alt="Aditya" width={24} height={24} className="w-full h-full object-cover" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed wrap-break-word ${
                    msg.role === 'user'
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl rounded-br-md whitespace-pre-wrap'
                      : msg.isError
                        ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20 rounded-2xl rounded-bl-md'
                        : 'bg-zinc-100 text-zinc-800 dark:bg-white/[0.06] dark:text-zinc-200 rounded-2xl rounded-bl-md'
                  }`}
                >
                  {msg.role === 'assistant' && !msg.isError ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-1 space-y-0.5">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-1 space-y-0.5">{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                        a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 opacity-80 hover:opacity-100">{children}</a>,
                        code: ({ children }) => <code className="bg-zinc-200/60 dark:bg-white/10 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 mr-2 mt-1">
                  <Image src="/profile.avif" alt="Aditya" width={24} height={24} className="w-full h-full object-cover" />
                </div>
                <div className="bg-zinc-100 dark:bg-white/[0.06] px-3.5 py-2.5 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1.5 py-1">
                    <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {/* Follow-up suggestions */}
            {showFollowUps && (
              <div className="flex flex-wrap gap-2 pl-8">
                {followUps.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white px-3 py-1.5 rounded-full transition-all cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-zinc-200 dark:border-white/10">
            {isAtLimit ? (
              <p className="text-xs text-center text-zinc-400 dark:text-zinc-500 py-2">
                You&apos;ve reached the daily limit of 50 messages. Come back tomorrow!
              </p>
            ) : (
              <>
                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-1.5 focus-within:border-zinc-400 dark:focus-within:border-zinc-500 transition-colors">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    maxLength={300}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-zinc-900 dark:text-white text-sm py-2 outline-none placeholder-zinc-400 dark:placeholder-zinc-500 disabled:opacity-50"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                    aria-label="Send message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
                {input.length > 0 && (
                  <p className={`text-xs mt-1 text-right pr-1 ${input.length > 250 ? 'text-red-400' : 'text-zinc-400'}`}>
                    {input.length}/300
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
