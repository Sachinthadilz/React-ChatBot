import { useState, useEffect } from 'react';
import { PageHeader } from '../Layout/Header';
import { Footer } from '../Layout/Footer';

const features = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: 'Lightning Fast',
        desc: 'Get instant answers powered by state-of-the-art AI models with near-zero latency.',
        color: 'from-amber-400 to-orange-500',
        glow: 'group-hover:shadow-amber-500/20',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: 'Secure & Private',
        desc: 'Your conversations are encrypted. Chat history is yours — always. We never sell your data.',
        color: 'from-emerald-400 to-teal-500',
        glow: 'group-hover:shadow-emerald-500/20',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
        title: 'Multiple Assistants',
        desc: 'Switch between specialized AI personas — from a coding expert to a creative writer.',
        color: 'from-violet-400 to-purple-500',
        glow: 'group-hover:shadow-violet-500/20',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
        ),
        title: 'Export Anywhere',
        desc: 'Download your chat as a polished PDF with one click. Perfect for sharing or archiving.',
        color: 'from-blue-400 to-indigo-500',
        glow: 'group-hover:shadow-blue-500/20',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        title: 'Dark & Light Mode',
        desc: 'Easy on your eyes any time of day. Switch themes instantly with a single toggle.',
        color: 'from-slate-400 to-slate-600',
        glow: 'group-hover:shadow-slate-500/20',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
        ),
        title: 'Cloud Sync',
        desc: 'Sign up to sync all your chats across every device — pick up exactly where you left off.',
        color: 'from-cyan-400 to-sky-500',
        glow: 'group-hover:shadow-cyan-500/20',
    },
];

const stats = [
    { value: '10+', label: 'AI Models' },
    { value: '100%', label: 'Free to Start' },
    { value: '∞', label: 'Conversations' },
    { value: '1-click', label: 'PDF Export' },
];

export function LandingPage({ onGetStarted, onLogin }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-x-hidden transition-colors duration-300">
            {/* Animated background grid */}
            <div className="fixed inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(100,116,139,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-[120px]" />
                <div className="absolute top-[10%] right-[-15%] w-[500px] h-[500px] rounded-full bg-violet-400/10 dark:bg-violet-600/10 blur-[120px]" />
                <div className="absolute bottom-0 left-[30%] w-[400px] h-[400px] rounded-full bg-indigo-400/8 dark:bg-indigo-600/8 blur-[100px]" />
            </div>

            {/* ── SHARED HEADER ── */}
            <PageHeader onLogin={onLogin} onGetStarted={onGetStarted} variant="landing" />

            {/* ── HERO ── */}
            <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
                {/* Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300 text-xs font-medium mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
                    Powered by Google Gemini &amp; multiple AI models
                </div>

                <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] max-w-4xl text-slate-900 dark:text-white transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    Chat with AI
                    <br />
                    <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                        that actually gets you
                    </span>
                </h1>

                <p className={`mt-6 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    A fast, private, and beautifully crafted AI chat experience. Talk to multiple AI assistants, save your history, and export conversations — all for free.
                </p>

                <div className={`mt-10 flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <button
                        onClick={onGetStarted}
                        className="group px-7 py-3.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-200 flex items-center gap-2"
                    >
                        Start chatting free
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                    <button
                        onClick={onLogin}
                        className="px-7 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200"
                    >
                        Sign in
                    </button>
                </div>

                {/* Hero chat preview */}
                <div className={`mt-16 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-slate-200/60 dark:shadow-black/40 transition-all duration-1000 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-slate-800/50">
                        <div className="w-3 h-3 rounded-full bg-red-500/70" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                        <span className="ml-3 text-xs text-slate-400 font-mono">AI Chatbot</span>
                    </div>
                    <div className="p-5 space-y-3 text-left">
                        <div className="flex justify-end">
                            <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-blue-600 text-sm text-white">
                                Can you explain how neural networks learn?
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                <img src="/chat-bot.png" alt="AI" className="w-4 h-4 object-contain" />
                            </div>
                            <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                                Neural networks learn through a process called <span className="text-blue-600 dark:text-blue-400 font-medium">backpropagation</span>. During training, the network makes predictions, compares them to the correct answers, then adjusts its internal weights to reduce the error. ✨
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                                <img src="/chat-bot.png" alt="AI" className="w-4 h-4 object-contain" />
                            </div>
                            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS ── */}
            <section className="relative z-10 px-6 pb-20">
                <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 dark:bg-white/5 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5">
                    {stats.map((s) => (
                        <div key={s.label} className="bg-white dark:bg-slate-900 px-8 py-8 text-center">
                            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{s.value}</div>
                            <div className="text-sm text-slate-500">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section id="features" className="relative z-10 px-6 pb-28">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                            Everything you need
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base max-w-lg mx-auto">
                            Designed for people who want a powerful AI assistant without the complexity.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className={`group p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-white/10 hover:shadow-xl ${f.glow} transition-all duration-300 cursor-default`}
                            >
                                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} text-white mb-4 shadow-lg`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative z-10 px-6 pb-24">
                <div className="max-w-3xl mx-auto text-center rounded-2xl border border-blue-100 dark:border-white/10 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 dark:from-blue-950/60 dark:via-indigo-950/60 dark:to-violet-950/60 backdrop-blur-xl p-14 shadow-2xl shadow-blue-100/80 dark:shadow-black/30">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 mb-6 mx-auto">
                        <img src="/chat-bot.png" alt="AI Chatbot" className="w-9 h-9 object-contain" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        Ready to dive in?
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-base max-w-md mx-auto mb-8">
                        Start your first conversation in seconds — no credit card, no setup. Just AI.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button
                            onClick={onGetStarted}
                            className="group px-8 py-3.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-200 flex items-center gap-2"
                        >
                            Chat for free
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                        <button
                            onClick={onLogin}
                            className="px-8 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all"
                        >
                            Sign in instead
                        </button>
                    </div>
                </div>
            </section>

            {/* ── SHARED FOOTER ── */}
            <Footer />
        </div>
    );
}
