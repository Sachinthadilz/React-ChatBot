const footerLinks = [
    {
        heading: 'Product',
        links: [
            { label: 'Features', href: '#features' },
            { label: 'Start Chatting', href: '#chat' },
        ],
    },
    {
        heading: 'Support',
        links: [
            { label: 'Privacy Policy', href: '#privacy' },
            { label: 'Terms of Service', href: '#terms' },
        ],
    },
];

/**
 * Footer — shared across landing page and auth pages.
 *
 * Props:
 *   compact  – if true, renders a single-line minimal footer (for auth pages)
 */
export function Footer({ compact = false }) {
    const year = new Date().getFullYear();

    if (compact) {
        return (
            <footer className="w-full border-t border-slate-200 dark:border-white/5 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm py-4 px-6 transition-colors duration-300">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-600">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <img src="/chat-bot.png" alt="Logo" className="w-3 h-3 object-contain" />
                        </div>
                        <span className="font-semibold text-slate-500 dark:text-slate-400">AI Chatbot</span>
                    </div>
                    <span>© {year} AI Chatbot. All rights reserved.</span>
                </div>
            </footer>
        );
    }

    return (
        <footer className="relative z-10 w-full border-t border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-14 pb-8">
                {/* Top row */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-12">
                    {/* Brand */}
                    <div className="lg:max-w-xs">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                                <img src="/chat-bot.png" alt="AI Chatbot" className="w-5 h-5 object-contain" />
                            </div>
                            <span className="text-base font-bold text-slate-900 dark:text-white">AI Chatbot</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            A fast, private, and beautifully crafted AI chat experience. Talk to multiple AI assistants, save your history, and export anywhere.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-10 sm:gap-16">
                        {footerLinks.map((col) => (
                            <div key={col.heading}>
                                <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                                    {col.heading}
                                </h4>
                                <ul className="space-y-2.5">
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom row */}
                <div className="pt-6 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-600">
                    <span>© {year} AI Chatbot. All rights reserved.</span>
                    <div className="flex items-center gap-1">
                        <span>Built with</span>
                        <span className="text-red-400">❤️</span>
                        <span>using React &amp; Tailwind CSS</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
