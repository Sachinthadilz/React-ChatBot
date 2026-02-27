import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * useDarkMode — shared hook for theme toggling.
 * Syncs with whatever sets the `dark` class on <html>.
 */
export function useDarkMode() {
    const [isDark, setIsDark] = useState(() =>
        document.documentElement.classList.contains('dark')
    );

    const toggle = () => {
        const root = document.documentElement;
        if (root.classList.contains('dark')) {
            root.classList.remove('dark');
            root.style.colorScheme = 'light';
            setIsDark(false);
        } else {
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
            setIsDark(true);
        }
    };

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return { isDark, toggle };
}

/* ─────────────────────────────────────────
   ThemeToggle  — reusable icon button
───────────────────────────────────────── */
export function ThemeToggle({ className = '' }) {
    const { isDark, toggle } = useDarkMode();
    return (
        <button
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
            className={`p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200 ${className}`}
        >
            {isDark ? (
                /* Sun */
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                /* Moon */
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
}

/* ─────────────────────────────────────────
   Logo  — reusable brand mark
───────────────────────────────────────── */
export function Logo({ size = 'md' }) {
    const sizes = {
        sm: { wrap: 'w-7 h-7 rounded-lg', img: 'w-4 h-4', text: 'text-base' },
        md: { wrap: 'w-9 h-9 rounded-xl', img: 'w-5 h-5', text: 'text-lg' },
        lg: { wrap: 'w-14 h-14 rounded-2xl', img: 'w-8 h-8', text: 'text-2xl' },
    };
    const s = sizes[size] ?? sizes.md;
    return (
        <div className="flex items-center gap-2.5">
            <div className={`${s.wrap} bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0`}>
                <img src="/chat-bot.png" alt="AI Chatbot Logo" className={`${s.img} object-contain`} />
            </div>
            <span className={`${s.text} font-bold tracking-tight text-slate-900 dark:text-white`}>
                AI Chatbot
            </span>
        </div>
    );
}

/* ─────────────────────────────────────────
   PageHeader — Landing page / Auth pages
   Props:
     onLogin      – open login view
     onGetStarted – open chat as guest
     onGoHome     – navigate back to landing (optional)
     variant      – 'landing' | 'auth' (default: 'landing')
───────────────────────────────────────── */
export function PageHeader({ onLogin, onGetStarted, onGoHome, variant = 'landing' }) {
    const { isAuthenticated } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-white/5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300 no-print">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo — clickable if onGoHome provided */}
                    {onGoHome ? (
                        <button onClick={onGoHome} className="focus:outline-none">
                            <Logo />
                        </button>
                    ) : (
                        <Logo />
                    )}

                    <div className="flex items-center gap-1 sm:gap-2">
                        <ThemeToggle />

                        {variant === 'landing' && !isAuthenticated && (
                            <>
                                <button
                                    onClick={onLogin}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                                >
                                    Sign in
                                </button>
                                <button
                                    onClick={onGetStarted}
                                    className="px-4 py-2 text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-100 transition-all shadow-sm"
                                >
                                    Get started
                                </button>
                            </>
                        )}

                        {variant === 'auth' && (
                            <button
                                onClick={onGetStarted}
                                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                            >
                                Continue as guest →
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

/* ─────────────────────────────────────────
   AppHeader — Main chat application header
   Props:
     user            – current user object
     isAuthenticated – bool
     saving          – bool (auto-save in progress)
     onSaveChats     – open auth prompt
     onLogout        – sign out handler
     onExportPDF     – export PDF handler
───────────────────────────────────────── */
export function AppHeader({ user, isAuthenticated, saving, onSaveChats, onLogout, onExportPDF }) {
    return (
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 no-print transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Logo />

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* PDF Export */}
                        <button
                            onClick={onExportPDF}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Print / Save as PDF"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                        </button>

                        <ThemeToggle />

                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <span className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-400 max-w-[160px] truncate">
                                        {user?.email}
                                    </span>
                                    {saving && (
                                        <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full whitespace-nowrap">
                                            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                            Saving…
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onSaveChats}
                                className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                            >
                                Save Chats
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
