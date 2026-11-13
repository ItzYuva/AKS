'use client';

import { useState, type FormEvent } from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi2';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    website: '',
  });
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const disposableDomains = [
    'tempmail.com', 'throwaway.email', 'guerrillamail.com',
    'mailinator.com', 'yopmail.com', 'sharklasers.com',
    'trashmail.com', 'fakeinbox.com', 'tempail.com',
    'dispostable.com', 'maildrop.cc', 'guerrillamailblock.com',
    'grr.la', 'guerrillamail.info', 'temp-mail.org',
  ];
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const emailDomain = form.email.split('@')[1]?.toLowerCase() || '';
  const emailValid =
    emailRegex.test(form.email) && !disposableDomains.includes(emailDomain);
  const showEmailError = emailTouched && form.email.length > 0 && !emailValid;

  const isValid =
    form.name.trim().length >= 2 &&
    emailValid &&
    form.message.trim().length >= 10;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (form.website) {
      setStatus('success');
      return;
    }

    if (!isValid) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          (data as { message?: string } | null)?.message ||
            'Failed to send message'
        );
      }

      setStatus('success');
      setForm({ name: '', email: '', message: '', website: '' });
      setEmailTouched(false);
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error ? err.message : 'Something went wrong'
      );
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-zinc-900 dark:text-white font-medium mb-1">
          Message sent!
        </p>
        <p className="text-zinc-500 text-sm">
          I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 relative">
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) =>
          setForm((f) => ({ ...f, website: e.target.value }))
        }
        className="absolute opacity-0 h-0 w-0 overflow-hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div>
        <input
          id="contact-name"
          type="text"
          required
          minLength={2}
          value={form.name}
          onChange={(e) =>
            setForm((f) => ({ ...f, name: e.target.value }))
          }
          className="w-full h-11 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 text-base text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-400 transition-colors"
          placeholder="Full Name"
        />
      </div>

      <div>
        <input
          id="contact-email"
          type="email"
          required
          value={form.email}
          onChange={(e) =>
            setForm((f) => ({ ...f, email: e.target.value }))
          }
          onBlur={() => setEmailTouched(true)}
          className={`w-full h-11 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border text-base text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none transition-colors ${
            showEmailError
              ? 'border-zinc-800 dark:border-zinc-300 focus:border-zinc-800 dark:focus:border-zinc-300'
              : 'border-zinc-200 dark:border-white/10 focus:border-zinc-400 dark:focus:border-zinc-400'
          }`}
          placeholder="Email Address"
        />
        {showEmailError && (
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Please enter a valid email address</p>
        )}
      </div>

      <div>
        <textarea
          id="contact-message"
          required
          minLength={10}
          rows={4}
          value={form.message}
          onChange={(e) =>
            setForm((f) => ({ ...f, message: e.target.value }))
          }
          className="w-full px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 text-base text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-400 transition-colors resize-none"
          placeholder="Your Message"
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-500">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="group w-full h-11 rounded-lg border border-zinc-300 dark:border-white/15 bg-transparent text-zinc-700 dark:text-zinc-100 font-medium flex items-center justify-center gap-2 hover:text-zinc-900 dark:hover:text-white focus:outline-none disabled:opacity-50 transition-colors cursor-pointer"
      >
        {status === 'loading' ? (
          <svg
            className="w-5 h-5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <>
            Send Message
            <HiOutlineArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
