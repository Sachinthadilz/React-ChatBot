import { useEffect, useState, useRef } from "react";
import { Loader } from "../Loader/Loader";
import { Messages } from "../Messages/Messages";
import { Controls } from "../Controls/Controls";
import { TypingIndicator } from "../TypingIndicator/TypingIndicator";
import { exportAsJSON, exportAsMarkdown } from "../../utils/exportChat";
import { needsRealTimeData, searchWeb } from "../../utils/webSearch";

export function Chat({
  assistant,
  isActive = false,
  chatId,
  chatMessages,
  onChatMessagesUpdate,
  onMessageDelete,
}) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const isLocalUpdate = useRef(false);

  useEffect(() => {
    isLocalUpdate.current = false;
    setMessages(chatMessages);

    if (assistant?.name === "googleai") {
      assistant.createChat(chatMessages);
    }
  }, [chatId, chatMessages]);

  useEffect(() => {
    if (isLocalUpdate.current) {
      onChatMessagesUpdate(chatId, messages);
    }
  }, [messages]);

  function updateLastMessageContent(content) {
    isLocalUpdate.current = true;
    setMessages((prevMessages) =>
      prevMessages.map((message, index) =>
        index === prevMessages.length - 1
          ? { ...message, content: `${message.content}${content}` }
          : message
      )
    );
  }

  function addMessage(message) {
    isLocalUpdate.current = true;
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  async function handleContentSend(content) {
    addMessage({ content, role: "user", timestamp: new Date().toISOString() });
    setIsLoading(true);
    setError(null);

    // Build the prompt — optionally augmented with real-time web search results
    let llmContent = content;
    if (needsRealTimeData(content)) {
      try {
        setIsSearching(true);
        setIsLoading(false);
        const webContext = await searchWeb(content);
        llmContent = `${webContext}\n\n${content}`;
      } catch (searchErr) {
        // If search fails, fall back to plain prompt silently
        console.warn("Web search failed, falling back to LLM only:", searchErr);
      } finally {
        setIsSearching(false);
        setIsLoading(true);
      }
    }

    try {
      const result = await assistant.chatStream(
        llmContent,
        messages.filter(({ role }) => role !== "system")
      );

      let isFirstChunk = true;
      for await (const chunk of result) {
        if (isFirstChunk) {
          isFirstChunk = false;
          // Seed the message with the first chunk so it's never lost to a React batch update
          addMessage({ content: chunk, role: "assistant", timestamp: new Date().toISOString() });
          setIsLoading(false);
          setIsStreaming(true);
        } else {
          updateLastMessageContent(chunk);
        }
      }

      setIsStreaming(false);
    } catch (error) {
      const errorMessage = error?.message ?? "Sorry, I couldn't process your request. Please try again!";
      setError(errorMessage);
      addMessage({
        content: errorMessage,
        role: "system",
        timestamp: new Date().toISOString()
      });
      setIsLoading(false);
      setIsStreaming(false);
    }
  }

  if (!isActive) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && <Loader />}

      {/* Web Search Indicator */}
      {isSearching && (
        <div className="flex items-center gap-2 px-4 py-2 mb-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl animate-pulse">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <span>🔍 Searching the web for real-time data...</span>
        </div>
      )}

      {/* Typing Indicator */}
      {isStreaming && <TypingIndicator />}

      {/* Messages */}
      <div id="chat-export-container" className="flex-1 overflow-y-auto mb-4 no-scrollbar">
        <Messages
          messages={messages}
          onMessageDelete={(index) => onMessageDelete(chatId, index)}
        />
      </div>

      {/* Controls */}
      <Controls
        isDisabled={isLoading || isStreaming}
        onSend={handleContentSend}
      />
    </div>
  );
}
