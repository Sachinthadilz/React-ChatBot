import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./components/Auth/Login";
import { Signup } from "./components/Auth/Signup";
import { LandingPage } from "./components/LandingPage/LandingPage";
import { AppHeader, PageHeader } from "./components/Layout/Header";
import { Footer } from "./components/Layout/Footer";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Chat } from "./components/Chat/Chat";
import { Assistant } from "./components/Assistant/Assistant";
import { Theme } from "./components/Theme/Theme";
import { loadUserChats, saveChat, updateChat, updateChatTitle } from "./services/chatService";

import html2pdf from "html2pdf.js";

function MainApp() {
  const { user, signOut, isAuthenticated } = useAuth();
  const [assistant, setAssistant] = useState();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState();
  const [loading, setLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [saving, setSaving] = useState(false);

  function handleExportPDF() {
    const element = document.getElementById('chat-export-container');
    if (!element) return;

    // Optional: Add a class to hide specific elements during export if needed
    element.classList.add('no-scrollbar');

    const activeChat = chats.find(c => c.id === activeChatId);
    const filename = activeChat ? `${activeChat.title || "Chat"}.pdf` : "chat-export.pdf";

    const opt = {
      margin: [10, 10],
      filename: filename,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0,
        logging: true,
        letterRendering: true,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      element.classList.remove('no-scrollbar');
    });
  }

  const activeChatMessages = useMemo(
    () => chats.find(({ id }) => id === activeChatId)?.messages ?? [],
    [chats, activeChatId]
  );

  // Load user's chats from database when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setLoading(true);
      loadUserChats(user.id)
        .then((loadedChats) => {
          if (loadedChats.length > 0) {
            setChats(loadedChats);
            setActiveChatId(loadedChats[0].id);
          } else {
            handleNewChatCreate();
          }
        })
        .catch((error) => {
          console.error('Error loading chats:', error);
          handleNewChatCreate();
        })
        .finally(() => setLoading(false));
    } else if (!isAuthenticated) {
      // Guest mode - start with empty chat
      if (chats.length === 0) {
        handleNewChatCreate();
      }
    }
  }, [isAuthenticated, user]);

  // Auto-close auth prompt when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setShowAuthPrompt(false);
    }
  }, [isAuthenticated]);

  // Save chat to database when messages change (only if authenticated)
  useEffect(() => {
    if (!isAuthenticated || !user || !activeChatId || loading) return;

    const activeChat = chats.find((chat) => chat.id === activeChatId);
    if (!activeChat || activeChat.messages.length === 0) return;

    // Debounce saving to avoid too many requests
    const timeoutId = setTimeout(async () => {
      // Check if chat exists in database (has a UUID format)
      const isExistingChat = activeChat.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      setSaving(true);
      console.log('💾 Saving chat...', { chatId: activeChat.id, isExisting: isExistingChat, messageCount: activeChat.messages.length });

      try {
        if (isExistingChat) {
          // Update existing chat
          await updateChat(activeChat.id, activeChat.messages);
          console.log('✅ Chat updated successfully');
        } else {
          // Save new chat
          const savedChat = await saveChat(user.id, activeChat);
          console.log('✅ New chat saved successfully', savedChat);

          // Update local state with database ID
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === activeChat.id ? { ...chat, id: savedChat.id } : chat
            )
          );
          setActiveChatId(savedChat.id);
        }
      } catch (error) {
        console.error('❌ Error saving chat:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
        });
        // Don't alert on every error, just log it
      } finally {
        setSaving(false);
      }
    }, 1000); // Wait 1 second after last change before saving

    return () => clearTimeout(timeoutId);
  }, [chats, activeChatId, isAuthenticated, user, loading]);

  function handleAssistantChange(newAssistant) {
    setAssistant(newAssistant);
  }

  function handleChatMessagesUpdate(id, messages) {
    const title = messages[0]?.content.split(" ").slice(0, 7).join(" ");

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id
          ? { ...chat, title: chat.title ?? title, messages }
          : chat
      )
    );
  }

  function handleNewChatCreate() {
    const id = `temp-${uuidv4()}`; // Temporary ID until saved to database

    setActiveChatId(id);
    setChats((prevChats) => [...prevChats, { id, messages: [] }]);
  }

  function handleActiveChatIdChange(id) {
    setActiveChatId(id);
    setChats((prevChats) =>
      prevChats.filter(({ messages }) => messages.length > 0)
    );
  }

  function handleLogout() {
    signOut().then(() => {
      setChats([]);
      setActiveChatId(null);
      handleNewChatCreate();
    });
  }

  async function handleChatTitleUpdate(chatId, newTitle) {
    // Optimistic update
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );

    if (isAuthenticated) {
      try {
        await updateChatTitle(chatId, newTitle);
      } catch (error) {
        console.error("Failed to update chat title:", error);
      }
    }
  }

  function handleChatDelete(chatId) {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));

    // If deleted chat was active, switch to another chat
    if (chatId === activeChatId) {
      const remainingChats = chats.filter((chat) => chat.id !== chatId);
      if (remainingChats.length > 0) {
        setActiveChatId(remainingChats[0].id);
      } else {
        handleNewChatCreate();
      }
    }
  }

  function handleMessageDelete(chatId, messageIndex) {
    // 1. Optimistic update locally
    const chatToUpdate = chats.find(c => c.id === chatId);
    if (!chatToUpdate) return;

    const updatedMessages = chatToUpdate.messages.filter((_, index) => index !== messageIndex);

    // Update local state
    handleChatMessagesUpdate(chatId, updatedMessages);

    // 2. Trigger save to database (will be handled by the useEffect debouncer)
    // We don't need to do anything explicit here because handleChatMessagesUpdate
    // updates the 'chats' state, which triggers the useEffect that calls updateChat/saveChat.
  }

  function handleSaveChatsPrompt() {
    setShowAuthPrompt(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Shared App Header */}
      <AppHeader
        user={user}
        isAuthenticated={isAuthenticated}
        saving={saving}
        onSaveChats={handleSaveChatsPrompt}
        onLogout={handleLogout}
        onExportPDF={handleExportPDF}
      />

      {/* Guest Mode Banner */}
      {!isAuthenticated && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-md">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-blue-900 dark:text-blue-100">Guest Mode</span>
                  <span className="text-blue-700 dark:text-blue-300 ml-2">• Chats stored locally.</span>
                </div>
              </div>
              <button
                onClick={handleSaveChatsPrompt}
                className="text-sm font-medium text-blue-700 dark:text-blue-300 hover:underline"
              >
                Sign Up →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          activeChatMessages={activeChatMessages}
          onActiveChatIdChange={handleActiveChatIdChange}
          onNewChatCreate={handleNewChatCreate}
          onChatDelete={isAuthenticated ? handleChatDelete : null}
          onChatTitleUpdate={handleChatTitleUpdate}
        />

        <main id="chat-content-area" className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          {chats.map((chat) => (
            <Chat
              key={chat.id}
              assistant={assistant}
              isActive={chat.id === activeChatId}
              chatId={chat.id}
              chatMessages={chat.messages}
              onChatMessagesUpdate={handleChatMessagesUpdate}
              onMessageDelete={handleMessageDelete}
            />
          ))}

          {/* Configuration */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4">
            <Assistant onAssistantChange={handleAssistantChange} />
            <Theme />
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowAuthPrompt(false)}
          />

          <div className="relative w-full max-w-md z-10">
            <button
              onClick={() => setShowAuthPrompt(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {authMode === 'login' ? (
              <Login onToggleMode={() => setAuthMode('signup')} />
            ) : (
              <Signup onToggleMode={() => setAuthMode('login')} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AppContent() {
  const { loading, isAuthenticated } = useAuth();
  const [showLanding, setShowLanding] = useState(true);
  const [landingAuthMode, setLandingAuthMode] = useState(null); // 'login' | 'signup' | null

  // Once user authenticates, skip the landing page
  useEffect(() => {
    if (isAuthenticated) setShowLanding(false);
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users who haven't dismissed it yet
  if (!isAuthenticated && showLanding && !landingAuthMode) {
    return (
      <LandingPage
        onGetStarted={() => setShowLanding(false)}
        onLogin={() => setLandingAuthMode('login')}
      />
    );
  }

  // If user clicked Sign In / Sign Up from the landing page, show a full-page auth form
  if (!isAuthenticated && landingAuthMode) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <PageHeader
          variant="auth"
          onGetStarted={() => { setLandingAuthMode(null); setShowLanding(false); }}
          onGoHome={() => { setLandingAuthMode(null); setShowLanding(true); }}
        />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            {landingAuthMode === 'login' ? (
              <Login onToggleMode={() => setLandingAuthMode('signup')} />
            ) : (
              <Signup onToggleMode={() => setLandingAuthMode('login')} />
            )}
          </div>
        </div>
        <Footer compact />
      </div>
    );
  }

  return <MainApp />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
