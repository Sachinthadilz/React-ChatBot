import { useEffect, useState, useRef } from "react";
import { Loader } from "../Loader/Loader";
import { Messages } from "../Messages/Messages";
import { Controls } from "../Controls/Controls";
import { TypingIndicator } from "../TypingIndicator/TypingIndicator";
import { exportAsJSON, exportAsMarkdown } from "../../utils/exportChat";

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

    try {
      const result = await assistant.chatStream(
        content,
        messages.filter(({ role }) => role !== "system")
      );

      let isFirstChunk = false;
      for await (const chunk of result) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage({ content: "", role: "assistant", timestamp: new Date().toISOString() });
          setIsLoading(false);
          setIsStreaming(true);
        }

        updateLastMessageContent(chunk);
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
