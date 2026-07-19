import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Assets } from '@/data/homeData';

// ─── Alternative contact actions ─────────────────────────────────────────────
type AltKind = 'copy' | 'link' | 'download';
interface AltAction {
    name: string;
    action: string;
    kind: AltKind;
    /** copy → text copied · link/download → the href */
    value: string;
}

const ALTERNATIVES: AltAction[] = [
    { name: 'nevinasv@gmail.com', action: 'COPY', kind: 'copy', value: 'nevinasv@gmail.com' },
    { name: 'Instagram', action: 'VISIT ↗', kind: 'link', value: 'https://www.instagram.com/tp_job_th/?hl=en' },
    { name: 'GitHub', action: 'VISIT ↗', kind: 'link', value: 'https://github.com/tp-job' },
    { name: 'Twitter / X', action: 'FOLLOW ↗', kind: 'link', value: 'https://x.com/nevinas_ka' },
    { name: 'Resume PDF', action: 'DOWNLOAD ↓', kind: 'download', value: Assets.resume },
];

// ─── Types ───────────────────────────────────────────────────────────────────
type FormStatus = 'idle' | 'sending' | 'success' | 'error';

// ─── Constants ───────────────────────────────────────────────────────────────
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY ?? '';

/** Max field lengths — keeps payloads bounded (S1) */
const LIMITS = {
    name: 100,
    email: 254,    // RFC 5321 maximum
    message: 2000,
    deadline: 100,
} as const;

/** Client-side cooldown after a successful submit in ms (S3) */
const SUBMIT_COOLDOWN_MS = 30_000;

/** Safe, generic messages — never expose raw API internals (S2) */
const SAFE_ERRORS: Record<string, string> = {
    network: 'Network error — please check your connection and try again.',
    server: 'Unable to send right now — please try again in a moment.',
    cooldown: 'Please wait a moment before sending another message.',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
/** Basic email shape validation beyond browser default */
const isValidEmail = (v: string): boolean =>
    /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/.test(v);

/** Trim and truncate a string to a safe length */
const sanitize = (v: string, max: number): string =>
    v.trim().slice(0, max);

const submitBtnClass = (status: FormStatus) =>
    status === 'success'
        ? 'bg-success text-white'
        : status === 'error'
            ? 'bg-error text-white'
            : 'bg-accent text-accent-foreground';

// ─── Component ───────────────────────────────────────────────────────────────
const ContactSplit: React.FC = () => {
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    // Which alternative was just copied (by name) — drives the "COPIED ✓" label
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    // C2 — Guard setState calls after the component unmounts
    const mountedRef = useRef(true);
    // C1 — Store timeout IDs so we can cancel them on unmount
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // C3 — Safe form reset without casting event.target
    const formRef = useRef<HTMLFormElement | null>(null);
    // S3 — Track last successful submit timestamp for rate-limiting
    const lastSubmitRef = useRef<number>(0);
    // Abort in-flight fetch when the component unmounts
    const abortRef = useRef<AbortController | null>(null);
    // Resets the "COPIED ✓" label back to idle
    const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // C1 + C2 — Cleanup on unmount
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            if (timerRef.current) clearTimeout(timerRef.current);
            if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
            if (abortRef.current) abortRef.current.abort();
        };
    }, []);

    /** Copy a value to the clipboard, with a graceful fallback + brief feedback */
    const handleCopy = useCallback(async (value: string, key: string) => {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
            } else {
                // Fallback for non-secure contexts where the async API is missing
                const ta = document.createElement('textarea');
                ta.value = value;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            if (!mountedRef.current) return;
            setCopiedKey(key);
            if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
            copyTimerRef.current = setTimeout(() => {
                if (mountedRef.current) setCopiedKey((k) => (k === key ? null : k));
            }, 2000);
        } catch {
            /* clipboard blocked — silently ignore */
        }
    }, []);

    /** Schedule an auto-reset back to idle, cancelling any pending timer first */
    const scheduleReset = useCallback((delay: number) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            if (mountedRef.current) {
                setStatus('idle');
                setErrorMessage('');  // C4 — Always clear stale error text
            }
        }, delay);
    }, []);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // S3 — Client-side rate limit: 30 s between submissions
        const now = Date.now();
        if (now - lastSubmitRef.current < SUBMIT_COOLDOWN_MS) {
            setErrorMessage(SAFE_ERRORS.cooldown);
            setStatus('error');
            scheduleReset(4_000);
            return;
        }

        // S1 — Read and sanitize values before building FormData
        const form = formRef.current;
        if (!form) return;

        const rawName = sanitize(form.elements.namedItem('name') instanceof HTMLInputElement ? (form.elements.namedItem('name') as HTMLInputElement).value : '', LIMITS.name);
        const rawEmail = sanitize(form.elements.namedItem('email') instanceof HTMLInputElement ? (form.elements.namedItem('email') as HTMLInputElement).value : '', LIMITS.email);
        const rawMessage = sanitize(form.elements.namedItem('message') instanceof HTMLTextAreaElement ? (form.elements.namedItem('message') as HTMLTextAreaElement).value : '', LIMITS.message);
        const rawDeadline = sanitize(form.elements.namedItem('deadline') instanceof HTMLInputElement ? (form.elements.namedItem('deadline') as HTMLInputElement).value : '', LIMITS.deadline);

        // Extra email validation beyond browser's built-in check
        if (!isValidEmail(rawEmail)) {
            setErrorMessage('Please enter a valid email address.');
            setStatus('error');
            scheduleReset(4_000);
            return;
        }

        setStatus('sending');

        // Build a clean FormData from sanitized values only
        const formData = new FormData();
        formData.append('access_key', ACCESS_KEY);
        formData.append('subject', 'New Contact from Nocturnal Contact Form');
        formData.append('name', rawName);
        formData.append('email', rawEmail);
        formData.append('message', rawMessage);
        if (rawDeadline) formData.append('deadline', rawDeadline);

        // AbortController for clean cancellation on unmount
        abortRef.current = new AbortController();

        try {
            const response = await fetch(WEB3FORMS_ENDPOINT, {
                method: 'POST',
                body: formData,
                signal: abortRef.current.signal,
            });

            // Fail gracefully on non-2xx without exposing response internals (S2)
            if (!response.ok) {
                throw new Error('server');
            }

            const data: { success: boolean } = await response.json();

            if (!mountedRef.current) return; // C2 — guard after await

            if (data.success) {
                lastSubmitRef.current = Date.now(); // S3 — record submit timestamp
                setStatus('success');
                formRef.current?.reset();           // C3 — safe reset via ref
                scheduleReset(4_000);
            } else {
                setErrorMessage(SAFE_ERRORS.server); // S2 — never expose data.message
                setStatus('error');
                scheduleReset(4_000);
            }
        } catch (err: unknown) {
            if (!mountedRef.current) return; // C2

            // AbortError means the component unmounted mid-fetch — silently ignore
            if (err instanceof Error && err.name === 'AbortError') return;

            const isServerErr = err instanceof Error && err.message === 'server';
            setErrorMessage(isServerErr ? SAFE_ERRORS.server : SAFE_ERRORS.network); // S2
            setStatus('error');
            scheduleReset(4_000);
        }
    };

    const isLocked = status === 'sending' || status === 'success';

    // ─── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="w-full bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text flex flex-col md:flex-row min-h-screen">

            {/* LEFT: Heading + Form */}
            <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-20 flex flex-col justify-center relative">
              <div className="w-full max-w-xl mx-auto md:ml-auto md:mr-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <div className="font-[var(--fd)] text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-4">
                        Nocturnal<br />Contact<span className="text-matte-azure">.</span>
                    </div>
                    <div className="font-[var(--fj)] text-lg text-haze dark:text-cool tracking-widest">
                        お問い合わせ
                    </div>
                </motion.div>

                <motion.form
                    ref={formRef}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-8"
                    onSubmit={onSubmit}
                    noValidate                  // We handle validation ourselves
                >
                    {/* S4 — Honeypot: fully hidden from assistive tech */}
                    <input
                        type="checkbox"
                        name="botcheck"
                        aria-hidden="true"
                        tabIndex={-1}
                        readOnly
                        style={{ display: 'none' }}
                    />

                    {/* Name */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 border-b border-midnight/10 dark:border-periwinkle/10 pb-2 relative group transition-colors duration-250 focus-within:border-periwinkle-mid dark:focus-within:border-periwinkle">
                        <div className="font-[var(--fm)] text-xs tracking-widest uppercase text-haze dark:text-cool w-24 shrink-0 mt-2 sm:mt-0 group-focus-within:text-haze-deep dark:group-focus-within:text-periwinkle" style={{ transition: 'color 0.2s' }}>
                            Name
                        </div>
                        <input
                            type="text"
                            name="name"
                            required
                            disabled={isLocked}
                            maxLength={LIMITS.name}         // S1
                            autoComplete="name"
                            placeholder="Your autograph, please"
                            className="bg-transparent border-none outline-none text-xl sm:text-2xl font-light w-full placeholder:text-cool-deep dark:placeholder:text-cool disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 border-b border-midnight/10 dark:border-periwinkle/10 pb-2 relative group transition-colors duration-250 focus-within:border-periwinkle-mid dark:focus-within:border-periwinkle">
                        <div className="font-[var(--fm)] text-xs tracking-widest uppercase text-haze dark:text-cool w-24 shrink-0 mt-2 sm:mt-0 group-focus-within:text-haze-deep dark:group-focus-within:text-periwinkle" style={{ transition: 'color 0.2s' }}>
                            Email
                        </div>
                        <div className="flex items-center w-full">
                            <span className="text-xl sm:text-2xl font-light text-haze dark:text-cool mr-1">@</span>
                            <input
                                type="email"
                                name="email"
                                required
                                disabled={isLocked}
                                maxLength={LIMITS.email}      // S1
                                autoComplete="email"
                                placeholder="your@email.com"
                                className="bg-transparent border-none outline-none text-xl sm:text-2xl font-light w-full placeholder:text-cool-deep dark:placeholder:text-cool disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                            />
                        </div>
                    </div>

                    {/* Project */}
                    <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-6 border-b border-midnight/10 dark:border-periwinkle/10 pb-2 relative group transition-colors duration-250 focus-within:border-periwinkle-mid dark:focus-within:border-periwinkle">
                        <div className="font-[var(--fm)] text-xs tracking-widest uppercase text-haze dark:text-cool w-24 shrink-0 mt-3 group-focus-within:text-haze-deep dark:group-focus-within:text-periwinkle" style={{ transition: 'color 0.2s' }}>
                            Project
                        </div>
                        <textarea
                            name="message"
                            required
                            disabled={isLocked}
                            maxLength={LIMITS.message}      // S1
                            placeholder="Your project idea..."
                            rows={2}
                            className="bg-transparent border-none outline-none text-xl sm:text-2xl font-light w-full placeholder:text-cool-deep dark:placeholder:text-cool resize-none pt-1 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                        />
                    </div>

                    {/* Deadline */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 border-b border-midnight/10 dark:border-periwinkle/10 pb-2 relative group transition-colors duration-250 focus-within:border-periwinkle-mid dark:focus-within:border-periwinkle">
                        <div className="font-[var(--fm)] text-xs tracking-widest uppercase text-haze dark:text-cool w-24 shrink-0 mt-2 sm:mt-0 group-focus-within:text-haze-deep dark:group-focus-within:text-periwinkle" style={{ transition: 'color 0.2s' }}>
                            Deadline
                        </div>
                        <input
                            type="text"
                            name="deadline"
                            disabled={isLocked}
                            maxLength={LIMITS.deadline}     // S1
                            placeholder="Your deadline"
                            className="bg-transparent border-none outline-none text-xl sm:text-2xl font-light w-full placeholder:text-cool-deep dark:placeholder:text-cool disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-8">

                        {/* Status message — aria-live so screen readers announce changes */}
                        <div
                            aria-live="polite"
                            aria-atomic="true"
                            className="font-[var(--fm)] text-[0.65rem] leading-relaxed text-haze dark:text-cool"
                        >
                            <AnimatePresence mode="wait">
                                {status === 'idle' && (
                                    <motion.div
                                        key="idle"
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        Following fields need to be filled in:<br />
                                        <span className="text-haze dark:text-cool">Name, Email, Project idea, Deadline.</span>
                                    </motion.div>
                                )}

                                {status === 'sending' && (
                                    <motion.div
                                        key="sending"
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ duration: 0.25 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="flex gap-1 items-center" aria-hidden="true">
                                            {[0, 1, 2].map((i) => (
                                                <motion.span
                                                    key={i}
                                                    className="block w-1 h-1 rounded-full bg-matte-azure"
                                                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                                                    transition={{ duration: 1, delay: i * 0.18, repeat: Infinity }}
                                                />
                                            ))}
                                        </span>
                                        <span className="text-haze dark:text-periwinkle">Transmitting your message...</span>
                                    </motion.div>
                                )}

                                {status === 'success' && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ duration: 0.25 }}
                                        className="flex items-center gap-2"
                                    >
                                        <motion.svg
                                            width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2.5"
                                            strokeLinecap="round" strokeLinejoin="round"
                                            className="text-success"
                                            aria-hidden="true"
                                        >
                                            <motion.path
                                                d="M5 13l4 4L19 7"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                            />
                                        </motion.svg>
                                        <span className="text-success">Message received. We'll be in touch.</span>
                                    </motion.div>
                                )}

                                {status === 'error' && (
                                    <motion.div
                                        key="error"
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ duration: 0.25 }}
                                        className="flex items-center gap-2"
                                    >
                                        <svg
                                            width="12" height="12" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                                            className="text-error"
                                            aria-hidden="true"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                        <span className="text-error">{errorMessage}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Submit button */}
                        <motion.button
                            type="submit"
                            disabled={isLocked}
                            aria-disabled={isLocked}
                            className={`hover:opacity-90 px-8 py-4 rounded-full font-[var(--fm)] text-xs font-bold tracking-widest uppercase transition-all duration-300 whitespace-nowrap disabled:cursor-not-allowed relative overflow-hidden ${submitBtnClass(status)}`}
                            whileTap={!isLocked ? { scale: 0.97 } : {}}
                            animate={status === 'sending' ? { opacity: [1, 0.7, 1] } : { opacity: 1 }}
                            transition={status === 'sending' ? { duration: 1.2, repeat: Infinity } : { duration: 0.3 }}
                        >
                            <AnimatePresence mode="wait">
                                {status === 'idle' && (
                                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                                        Submit Now →
                                    </motion.span>
                                )}
                                {status === 'sending' && (
                                    <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                                        Sending...
                                    </motion.span>
                                )}
                                {status === 'success' && (
                                    <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                                        Sent ✓
                                    </motion.span>
                                )}
                                {status === 'error' && (
                                    <motion.span key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                                        Try Again →
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </motion.form>
              </div>
            </div>

            {/* RIGHT: Alternatives + Ambient */}
            <div className="w-full md:w-1/2 bg-charcoal/20 p-8 sm:p-12 lg:p-20 relative overflow-hidden flex flex-col justify-center">
                {/* Ambient Nebula */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen bg-[radial-gradient(ellipse_70%_60%_at_80%_20%,theme(--color-matte-azure/.22),transparent_65%),radial-gradient(ellipse_50%_70%_at_20%_80%,theme(--color-velvet-orchid/.15),transparent_60%),radial-gradient(ellipse_40%_40%_at_60%_60%,theme(--color-velvet-flamingo/.08),transparent_55%)]"
                    aria-hidden="true"
                />

                {/* Alternatives List */}
                <motion.div
                    className="w-full max-w-xl mx-auto md:mr-auto md:ml-0 relative z-10"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="font-[var(--fm)] text-[0.65rem] tracking-[0.28em] uppercase text-haze dark:text-cool mb-12">
                        — Connect with Nevinas
                    </div>

                    <div className="font-[var(--fm)] text-[0.65rem] tracking-[0.22em] uppercase text-haze dark:text-cool mb-4 pt-4 border-t border-midnight/10 dark:border-periwinkle/10">
                        Alternatives
                    </div>

                    {ALTERNATIVES.map((alt) => {
                        const isCopied = alt.kind === 'copy' && copiedKey === alt.name;
                        const rowClass =
                            'flex items-center justify-between w-full text-left py-4 border-b border-midnight/10 dark:border-periwinkle/10 cursor-pointer group transition-all duration-200 hover:pl-2';

                        const inner = (
                            <>
                                <span className="font-[var(--fd)] text-xl sm:text-2xl font-light tracking-tight text-haze dark:text-cool group-hover:text-light-text dark:group-hover:text-dark-text transition-colors">
                                    {alt.name}
                                </span>
                                <span
                                    className={`font-[var(--fm)] text-[0.65rem] tracking-[0.14em] uppercase transition-colors flex items-center gap-2 ${isCopied
                                        ? 'text-success'
                                        : 'text-haze dark:text-cool group-hover:text-haze-deep dark:group-hover:text-periwinkle'
                                        }`}
                                >
                                    {isCopied ? 'COPIED ✓' : alt.action}
                                    {alt.kind === 'copy' && !isCopied && (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                            <rect x="9" y="9" width="13" height="13" rx="2" />
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                        </svg>
                                    )}
                                </span>
                            </>
                        );

                        if (alt.kind === 'link') {
                            return (
                                <a
                                    key={alt.name}
                                    href={alt.value}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className={rowClass}
                                >
                                    {inner}
                                </a>
                            );
                        }

                        if (alt.kind === 'download') {
                            return (
                                <a
                                    key={alt.name}
                                    href={alt.value}
                                    download="resume-nevinas-ka.pdf"
                                    className={rowClass}
                                >
                                    {inner}
                                </a>
                            );
                        }

                        return (
                            <button
                                key={alt.name}
                                type="button"
                                onClick={() => handleCopy(alt.value, alt.name)}
                                aria-label={`Copy ${alt.name}`}
                                className={rowClass}
                            >
                                {inner}
                            </button>
                        );
                    })}
                </motion.div>

                {/* Ambient Kanji */}
                <div
                    className="absolute -bottom-8 -right-4 font-[var(--fj)] text-[clamp(8rem,18vw,16rem)] font-light leading-none text-dark-text-primary/[0.025] tracking-[-0.05em] select-none pointer-events-none mix-blend-overlay"
                    aria-hidden="true"
                >
                    連絡
                </div>
            </div>

        </div>
    );
};

export default ContactSplit;
