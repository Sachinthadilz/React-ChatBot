import { useCallback, useEffect, useState } from "react";
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
import { Spinner } from "./components/Spinner/Spinner";
import { useChat } from "./hooks/useChat";
import html2pdf from "html2pdf.js";

// ─────────────────────────────────────────────────────────────────────────────
// MainApp — authenticated / guest chat shell
// ─────────────────────────────────────────────────────────────────────────────
function MainApp() {
  const { user, signOut, isAuthenticated } = useAuth();
  const [assistant, setAssistant] = useState();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const {
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
  } = useChat();

  // Close auth prompt when user logs in
  useEffect(() => {
    if (isAuthenticated) setShowAuthPrompt(false);
  }, [isAuthenticated]);

  const handleAssistantChange = useCallback((newAssistant) => {
    setAssistant(newAssistant);
  }, []);

  const handleLogout = useCallback(() => {
    signOut().then(() => {
      handleNewChatCreate();
    });
  }, [signOut, handleNewChatCreate]);

  const handleSaveChatsPrompt = useCallback(() => {
    setShowAuthPrompt(true);
  }, []);

  const handleExportPDF = useCallback(() => {
    const element = document.getElementById("chat-export-container");
    if (!element) return;

    const activeChat = chats.find((c) => c.id === activeChatId);
    const filename = activeChat ? `${activeChat.title || "Chat"}.pdf` : "chat-export.pdf";

    html2pdf()
      .set({
        margin: [10, 10],
        filename,
        image: { type: "jpeg", quality: 1.0 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      })
      .from(element)
      .save();
  }, [chats, activeChatId]);

  if (loading) return <Spinner label="Loading your chats..." />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
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
          activeChatMessages={chats.find(({ id }) => id === activeChatId)?.messages ?? []}
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

          {/* Configuration Panel */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4">
            <Assistant onAssistantChange={handleAssistantChange} />
            <Theme />
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
            {authMode === "login" ? (
              <Login onToggleMode={() => setAuthMode("signup")} />
            ) : (
              <Signup onToggleMode={() => setAuthMode("login")} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AppContent — routing: landing → auth → main app
// ─────────────────────────────────────────────────────────────────────────────
function AppContent() {
  const { loading, isAuthenticated } = useAuth();
  const [showLanding, setShowLanding] = useState(true);
  const [landingAuthMode, setLandingAuthMode] = useState(null); // 'login' | 'signup' | null

  useEffect(() => {
    if (isAuthenticated) setShowLanding(false);
  }, [isAuthenticated]);

  if (loading) return <Spinner />;

  if (!isAuthenticated && showLanding && !landingAuthMode) {
    return (
      <LandingPage
        onGetStarted={() => setShowLanding(false)}
        onLogin={() => setLandingAuthMode("login")}
      />
    );
  }

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
            {landingAuthMode === "login" ? (
              <Login onToggleMode={() => setLandingAuthMode("signup")} />
            ) : (
              <Signup onToggleMode={() => setLandingAuthMode("login")} />
            )}
          </div>
        </div>
        <Footer compact />
      </div>
    );
  }

  return <MainApp />;
}

// ─────────────────────────────────────────────────────────────────────────────
// App root
// ─────────────────────────────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
