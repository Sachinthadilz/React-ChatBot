export function exportAsJSON(messages, chatTitle) {
    const data = {
        title: chatTitle || 'Untitled Chat',
        exportDate: new Date().toISOString(),
        messages: messages,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadFile(blob, `${chatTitle || 'chat'}-${Date.now()}.json`);
}

export function exportAsMarkdown(messages, chatTitle) {
    let markdown = `# ${chatTitle || 'Chat Export'}\n\n`;
    markdown += `Exported: ${new Date().toLocaleString()}\n\n---\n\n`;

    messages.forEach(msg => {
        markdown += `## ${msg.role === 'user' ? 'User' : 'Assistant'}\n\n`;
        markdown += `${msg.content}\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    downloadFile(blob, `${chatTitle || 'chat'}-${Date.now()}.md`);
}

function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
