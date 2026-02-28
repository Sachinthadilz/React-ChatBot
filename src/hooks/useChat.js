import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../contexts/AuthContext";
import {
    loadUserChats,
    saveChat,
    updateChat,
    updateChatTitle,
} from "../services/chatService";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function useChat() {
    const { user, isAuthenticated } = useAuth();
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // ── Create a new empty chat ──────────────────────────────────────────────
    const handleNewChatCreate = useCallback(() => {
        const id = `temp-${uuidv4()}`;
        setActiveChatId(id);
        setChats((prev) => [...prev, { id, messages: [] }]);
    }, []);

    // ── Load chats from DB on auth change ───────────────────────────────────
    useEffect(() => {
        if (isAuthenticated && user) {
            setLoading(true);
            loadUserChats(user.id)
                .then((loaded) => {
                    if (loaded.length > 0) {
                        setChats(loaded);
                        setActiveChatId(loaded[0].id);
                    } else {
                        handleNewChatCreate();
                    }
                })
                .catch(() => handleNewChatCreate())
                .finally(() => setLoading(false));
        } else if (!isAuthenticated) {
            setChats((prev) => {
                if (prev.length === 0) handleNewChatCreate();
                return prev;
            });
        }
    }, [isAuthenticated, user]);  // eslint-disable-line react-hooks/exhaustive-deps

    // ── Auto-save to DB when messages change ────────────────────────────────
    useEffect(() => {
        if (!isAuthenticated || !user || !activeChatId || loading) return;
        const activeChat = chats.find((c) => c.id === activeChatId);
        if (!activeChat || activeChat.messages.length === 0) return;

        const timeoutId = setTimeout(async () => {
            setSaving(true);
            try {
                if (UUID_REGEX.test(activeChat.id)) {
                    await updateChat(activeChat.id, activeChat.messages);
                } else {
                    const saved = await saveChat(user.id, activeChat);
                    setChats((prev) =>
                        prev.map((c) => (c.id === activeChat.id ? { ...c, id: saved.id } : c))
                    );
                    setActiveChatId(saved.id);
                }
            } catch {
                // silently fail — guest data still in memory
            } finally {
                setSaving(false);
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [chats, activeChatId, isAuthenticated, user, loading]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleChatMessagesUpdate = useCallback((id, messages) => {
        const title = messages[0]?.content.split(" ").slice(0, 7).join(" ");
        setChats((prev) =>
            prev.map((chat) =>
                chat.id === id ? { ...chat, title: chat.title ?? title, messages } : chat
            )
        );
    }, []);

    const handleActiveChatIdChange = useCallback((id) => {
        setActiveChatId(id);
        setChats((prev) => prev.filter(({ messages }) => messages.length > 0));
    }, []);

    const handleChatTitleUpdate = useCallback(
        async (chatId, newTitle) => {
            setChats((prev) =>
                prev.map((chat) => (chat.id === chatId ? { ...chat, title: newTitle } : chat))
            );
            if (isAuthenticated) {
                try {
                    await updateChatTitle(chatId, newTitle);
                } catch {
                    // optimistic update already applied; ignore DB error
                }
            }
        },
        [isAuthenticated]
    );

    const handleChatDelete = useCallback(
        (chatId) => {
            setChats((prev) => prev.filter((c) => c.id !== chatId));
            if (chatId === activeChatId) {
                const remaining = chats.filter((c) => c.id !== chatId);
                if (remaining.length > 0) {
                    setActiveChatId(remaining[0].id);
                } else {
                    handleNewChatCreate();
                }
            }
        },
        [activeChatId, chats, handleNewChatCreate]
    );

    const handleMessageDelete = useCallback(
        (chatId, messageIndex) => {
            const chat = chats.find((c) => c.id === chatId);
            if (!chat) return;
            const updatedMessages = chat.messages.filter((_, i) => i !== messageIndex);
            handleChatMessagesUpdate(chatId, updatedMessages);
        },
        [chats, handleChatMessagesUpdate]
    );

    return {
        chats,
        activeChatId,
        loading,
        saving,
        handleNewChatCreate,
        handleChatMessagesUpdate,
        handleActiveChatIdChange,
        handleChatTitleUpdate,
        handleChatDelete,
        handleMessageDelete,
    };
}
