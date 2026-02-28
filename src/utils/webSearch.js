const SERPER_API_KEY = import.meta.env.VITE_SERPER_API_KEY;

// Keywords that suggest the user needs real-time / live data
const REALTIME_KEYWORDS = [
    "today", "latest", "now", "current", "live", "recent", "right now",
    "this week", "this month", "this year", "breaking", "update", "news",
    "score", "match", "result", "standings", "stock", "price", "weather",
    "2024", "2025", "2026", "happening", "trending", "just", "new",
];

/**
 * Returns true if the query likely needs real-time data.
 */
export function needsRealTimeData(query) {
    if (!SERPER_API_KEY || SERPER_API_KEY === "your-serper-api-key") return false;
    const lower = query.toLowerCase();
    return REALTIME_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Searches the web via the Vite proxy → Serper.dev and returns a
 * formatted context string to inject into the LLM prompt.
 */
export async function searchWeb(query) {
    if (!SERPER_API_KEY || SERPER_API_KEY === "your-serper-api-key") {
        throw new Error("VITE_SERPER_API_KEY is not set in your .env file.");
    }

    // Call the Vite proxy at /api/search — avoids browser CORS restrictions
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let response;
    try {
        response = await fetch("/api/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: query, num: 3 }),
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timeoutId);
    }

    if (!response.ok) {
        throw new Error(`Web search failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const now = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "short",
    });

    const lines = [
        `[WEB SEARCH — ${now}]`,
        `Use these results to answer. Be concise and complete your full answer.`,
        ``,
    ];

    // Answer box (quick fact)
    if (data.answerBox) {
        const ab = data.answerBox;
        const answer = ab.answer || ab.snippet || ab.title || "";
        if (answer) lines.push(`Quick Answer: ${answer.slice(0, 200)}`, ``);
    }

    // Top 3 organic results — short snippets only, no URLs
    if (data.organic?.length) {
        data.organic.slice(0, 3).forEach((item, i) => {
            const snippet = item.snippet ? item.snippet.slice(0, 160) : "";
            lines.push(`${i + 1}. ${item.title}${item.date ? ` (${item.date})` : ""}`);
            if (snippet) lines.push(`   ${snippet}`);
            lines.push(``);
        });
    }

    // Sports scores
    if (data.sportsResults?.title) {
        lines.push(`Sports: ${data.sportsResults.title}`, ``);
    }

    lines.push(`---`);
    lines.push(`Answer the user's question fully using the above data:`);

    return lines.join("\n");
}
