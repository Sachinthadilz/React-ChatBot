import { useState } from "react";
import { deleteChat } from "../../services/chatService";

export function Sidebar({
  chats,
  activeChatId,
  activeChatMessages,
  onActiveChatIdChange,
  onNewChatCreate,
  onChatDelete,
  onChatTitleUpdate,
}) {
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState(null);

  function handleSidebarToggle() {
    setIsOpen(!isOpen);
  }

  function handleEscapeClick(event) {
    if (isOpen && event.key === "Escape") {
      setIsOpen(false);
    }
  }

  function handleChatClick(chatId) {
    if (editingChatId === chatId) return; // Don't switch if editing
    onActiveChatIdChange(chatId);

    if (isOpen) {
      setIsOpen(false);
    }
  }

  function handleStartEditing(chat, event) {
    event.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title || "New Chat");
  }

  function handleSaveTitle(chatId) {
    if (!editTitle.trim()) {
      setEditingChatId(null);
      return;
    }

    onChatTitleUpdate(chatId, editTitle.trim());
    setEditingChatId(null);
  }

  function handleCancelEditing() {
    setEditingChatId(null);
    setEditTitle("");
  }

  async function handleDeleteChat(chatId, event) {
    event.stopPropagation();

    if (editingChatId === chatId) {
      handleCancelEditing();
      return;
    }

    if (!confirm('Are you sure you want to delete this chat?')) {
      return;
    }

    setDeletingChatId(chatId);

    try {
      await deleteChat(chatId);
      if (onChatDelete) {
        onChatDelete(chatId);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat');
    } finally {
      setDeletingChatId(null);
    }
  }

  return (
    <>
      {/* Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
        onClick={handleSidebarToggle}
        onKeyDown={handleEscapeClick}
        aria-label="Toggle sidebar"
      >
        <MenuIcon />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-r border-slate-200 dark:border-slate-700 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full p-6 pt-20">
          {/* New Chat Button */}
          <button
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-indigo-600"
            onClick={() => {
              onNewChatCreate();
              setIsOpen(false);
            }}
            disabled={activeChatMessages.length === 0}
          >
            + New Chat
          </button>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto mt-6 space-y-2">
            {chats
              .filter((chat) => chat.messages.length > 0)
              .map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative px-4 py-3 rounded-lg cursor-pointer transition-all ${chat.id === activeChatId
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100"
                    }`}
                  onClick={() => handleChatClick(chat.id)}
                >
                  <div className="flex items-center justify-between min-h-[1.5rem]">
                    {editingChatId === chat.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleSaveTitle(chat.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveTitle(chat.id);
                          if (e.key === "Escape") handleCancelEditing();
                        }}
                        autoFocus
                        className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <>
                        <p className="text-sm font-medium truncate pr-16 select-none" onDoubleClick={(e) => handleStartEditing(chat, e)}>
                          {chat.title || "New Chat"}
                        </p>

                        <div className="absolute right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-inherit">
                          {/* Rename Button */}
                          <button
                            onClick={(e) => handleStartEditing(chat, e)}
                            className={`p-1.5 rounded-md transition-all ${chat.id === activeChatId
                              ? "text-white/80 hover:text-white hover:bg-white/20"
                              : "text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              }`}
                            title="Rename chat"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>

                          {/* Delete Button */}
                          {onChatDelete && (
                            <button
                              onClick={(e) => handleDeleteChat(chat.id, e)}
                              disabled={deletingChatId === chat.id}
                              className={`p-1.5 rounded-md transition-all ${chat.id === activeChatId
                                ? "text-white/80 hover:text-white hover:bg-white/20"
                                : "text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                }`}
                              title="Delete chat"
                            >
                              {deletingChatId === chat.id ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-xs opacity-75 mt-1">
                    {chat.messages.length} messages
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      className="w-6 h-6 text-slate-700 dark:text-slate-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}
