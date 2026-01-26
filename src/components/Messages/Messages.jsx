import { useRef, useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const WELCOME_MESSAGE_GROUP = [
  {
    role: "assistant",
    content: "Hello! How can I assist you right now?",
    timestamp: new Date().toISOString(),
  },
];

import { DeleteConfirmationModal } from "../Modals/DeleteConfirmationModal";

export function Messages({ messages, onMessageDelete }) {
  const messagesEndRef = useRef(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const messagesGroups = useMemo(
    () =>
      messages.reduce((groups, message, index) => {
        // Start a new group if it's a user message OR if there are no groups yet
        if (message.role === "user" || groups.length === 0) {
          groups.push([]);
        }

        // Add original index to tracking
        groups[groups.length - 1].push({ ...message, originalIndex: index });
        return groups;
      }, []),
    [messages]
  );

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.role === "user") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function handleConfirmDelete() {
    if (deleteIndex !== null) {
      onMessageDelete(deleteIndex);
      setDeleteIndex(null);
    }
  }

  return (
    <div className="space-y-6">
      {[WELCOME_MESSAGE_GROUP, ...messagesGroups].map(
        (group, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            {group.map((message, index) => (
              <Message
                key={`${groupIndex}-${index}`}
                message={message}
                onDelete={
                  message.originalIndex !== undefined
                    ? () => setDeleteIndex(message.originalIndex)
                    : null
                }
              />
            ))}
          </div>
        )
      )}

      <div ref={messagesEndRef} />

      <DeleteConfirmationModal
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message? This cannot be undone."
      />
    </div>
  );
}

function Message({ message, onDelete }) {
  const { role, content, timestamp } = message;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isUser = role === "user";
  const isSystem = role === "system";

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-sm border relative ${isUser
          ? 'bg-blue-600 border-blue-600 text-white'
          : isSystem
            ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
          }`}
      >
        {/* Delete Button (visible on hover) */}
        {onDelete && (
          <button
            onClick={onDelete}
            className={`absolute -top-2 -right-2 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all ${isUser
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white dark:bg-slate-700 text-red-500 border border-slate-200 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              }`}
            title="Delete message"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Message Content */}
        <Markdown
          className="prose prose-sm dark:prose-invert max-w-none"
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="relative group/code">
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-xl my-3 shadow-md no-scrollbar"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code
                  className={`${className} px-2 py-1 rounded-md bg-slate-200/50 dark:bg-slate-700/50 text-sm font-mono border border-slate-300/50 dark:border-slate-600/50`}
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </Markdown>

        {/* Footer with timestamp and actions */}
        <div className={`flex items-center justify-between mt-3 pt-3 border-t ${isUser ? 'border-white/20' : 'border-slate-100 dark:border-slate-700/50'}`}>
          <span className={`text-xs font-medium ${isUser ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
            {formatTime(timestamp)}
          </span>

          {!isUser && (
            <button
              onClick={handleCopy}
              className={`text-xs px-2 py-1 rounded transition-colors ${copied
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              title="Copy message"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
