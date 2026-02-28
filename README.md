# AI Chatbot - Multi-Provider Chat Application

> A modern, feature-rich AI chatbot supporting multiple AI providers with optional user authentication and chat persistence.

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-cyan.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Enabled-green.svg)](https://supabase.com/)

![AI Chatbot Demo](public/chat-bot.png)

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Database Setup](#database-setup)
- [Usage](#-usage)
- [API Keys Guide](#-api-keys-guide)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🤖 Multiple AI Providers
- **Google AI** — Gemini 3 Flash Preview 🆕, Gemini 2.5 Pro 🧠, Gemini 2.5 Flash ⚡, Gemini 2.5 Flash-Lite ⚡, Gemini 2.0 Flash
- **Groq** — Llama 4 Maverick 17B 🆕, Llama 4 Scout 17B 🆕, Llama 3.3 70B, Llama 3.1 8B (All Free!)
- **DeepSeek AI** — DeepSeek-V3, DeepSeek-R1 🧠 (Reasoning)
- **OpenAI** — GPT-4o, GPT-4o mini
- **Anthropic** — Claude 3.5 Haiku
- **X AI** — Grok 3 Mini

### 🌐 Real-Time Web Search
- **Live data access** - Answers questions about current events, scores, news, prices, and more
- **Auto-detection** - Automatically triggers a Google search when your question needs fresh data (keywords like "today", "latest", "score", "news", etc.)
- **Search indicator** - A subtle 🔍 indicator appears while fetching live results
- **Powered by Serper.dev** - Fast, reliable Google Search API (2,500 free searches/month)
- **Graceful fallback** - If search fails or times out (8s timeout), the LLM answers from its own knowledge

### 👥 User Experience
- 💬 **Guest Mode** - Start chatting immediately without signup
- 🔐 **Optional Authentication** - Sign up to save chat history
- 💾 **Auto-Save** - Chats automatically saved to cloud database
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- 🌓 **Dark Mode** - Beautiful dark theme with smooth transitions
- ✨ **Modern UI** - Glassmorphism effects and gradient designs

### 💬 Chat Features
- 📝 Message timestamps
- 📋 Copy messages to clipboard
- 💾 Export chat (JSON/Markdown/PDF)
- 🎨 Syntax highlighting for code blocks
- ⌨️ Real-time streaming responses
- 🗑️ Delete individual messages or entire chats
- 📂 Multiple chat sessions
- 🔄 Chat history persistence
- ✏️ Rename chats

---

## 🎬 Demo

### Guest Mode
1. Open the app → Start chatting immediately
2. No signup required
3. Chats stored locally in browser

### Authenticated Mode
1. Click "Save Chats" → Sign up/Login
2. All chats automatically saved to database
3. Access from any device

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3 | UI Framework |
| **Vite** | 5.4 | Build Tool |
| **TailwindCSS** | 4.1 | Styling |
| **Supabase** | Latest | Auth & Database |
| **PostgreSQL** | - | Database (via Supabase) |

### AI SDKs
- `@google/genai` - Google AI (Gemini)
- `groq-sdk` - Groq (Llama)
- `openai` - OpenAI (GPT)
- `@anthropic-ai/sdk` - Anthropic (Claude)

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- A **Supabase account** (optional, free tier available at [supabase.com](https://supabase.com))

### Installation

#### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/react-ai-chatbot.git
cd react-ai-chatbot
```

#### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (~200MB).

---

### Environment Setup

#### Step 3: Create Environment File

```bash
# Copy the example file
cp .env.example .env
```

#### Step 4: Get API Keys

You'll need API keys for the AI providers you want to use. **At minimum, get one AI provider key to start.**

##### 🆓 Free Options (Recommended for Testing)

**1. Google AI (Gemini) - FREE**
- Go to [ai.google.dev](https://ai.google.dev)
- Click "Get API Key" → "Create API Key"
- Copy the key

**2. Groq - FREE**
- Go to [console.groq.com](https://console.groq.com)
- Sign up with GitHub/Google
- Go to API Keys → Create API Key
- Copy the key

##### 💳 Paid Options

**3. OpenAI**
- Go to [platform.openai.com](https://platform.openai.com)
- Sign up → Billing → Add payment method
- API Keys → Create new secret key

**4. Anthropic (Claude)**
- Go to [console.anthropic.com](https://console.anthropic.com)
- Sign up → Get API Keys

**5. DeepSeek**
- Go to [platform.deepseek.com](https://platform.deepseek.com)
- Sign up → API Keys

**6. X AI (Grok)**
- Go to [x.ai](https://x.ai)
- Request API access

#### Step 5: Add API Keys to .env

Open `.env` and add your keys:

```env
# AI Provider API Keys (add only the ones you have)
VITE_GOGGLE_AI_API_KEY=AIza...your-key-here
VITE_GROQ_API_KEY=gsk_...your-key-here
VITE_OPEN_AI_API_KEY=sk-...your-key-here
VITE_DEEPSEEK_AI_API_KEY=your-key-here
VITE_ANTHROPIC_AI_API_KEY=your-key-here
VITE_X_AI_API_KEY=your-key-here

# Real-Time Web Search (optional - get free key at serper.dev)
VITE_SERPER_API_KEY=your-serper-api-key

# Supabase (optional - leave empty for guest mode only)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

⚠️ **Important:** 
- Replace `your-key-here` with actual keys
- Don't share your `.env` file
- The `.env` file is already in `.gitignore`

---

### Database Setup (Optional)

**Skip this section if you only want guest mode.**

For user authentication and chat persistence:

#### Step 6: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → Sign in
3. Click "New Project"
4. Fill in:
   - **Name**: `ai-chatbot`
   - **Database Password**: Create strong password (save it!)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait 2-3 minutes for setup

#### Step 7: Get Supabase Credentials

1. In your Supabase project, click **Settings** (gear icon)
2. Click **API** in sidebar
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

4. Add to `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Step 8: Create Database Tables

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Open the file `supabase/migrations/20260126_initial_schema.sql` in your project
4. Copy **all** the SQL code
5. Paste into Supabase SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"

#### Step 9: Verify Tables

1. Click **Table Editor** in left sidebar
2. You should see:
   - ✅ `chats` table
   - ✅ `messages` table

**Done!** Your database is ready.

---

## 🎮 Usage

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 🔑 API Keys Guide

### Which AI Provider Should I Use?

| Provider | Cost | Speed | Models | Best For |
|----------|------|-------|--------|----------|
| **Groq** | 🆓 Free | ⚡ Fastest | Llama 4 Maverick/Scout, Llama 3.3 70B, GPT-OSS 120B, Groq Compound | Testing, Speed-critical apps |
| **Google AI** | 🆓 Free | ⚡ Fast | Gemini 3 Flash, 2.5 Pro, 2.5 Flash, 2.5 Flash-Lite, 2.0 Flash | General use, Multimodal |
| **DeepSeek** | 💰 Cheap | ⚡ Fast | DeepSeek-V3, DeepSeek-R1 🧠 | Coding, Reasoning, Math |
| **OpenAI** | 💰 Paid | 🐢 Medium | GPT-4o, GPT-4o mini | Production, Complex tasks |
| **Anthropic** | 💰 Paid | 🐢 Medium | Claude 3.5 Haiku | Long conversations |
| **X AI** | 💰 Paid | 🐢 Medium | Grok 3 Mini | General use |

**Recommendation for beginners:** Start with **Groq** (free) or **Google AI** (free).

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Import your repository
4. Add environment variables:
   - Click "Environment Variables"
   - Add all your `VITE_*` variables from `.env`
5. Click "Deploy"

**Done!** Your app is live.

### Deploy to Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → Import from Git
4. Select your repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables in Site settings
7. Click "Deploy"

---

## 📁 Project Structure

```
react-ai-chatbot/
├── public/                 # Static assets
│   └── chat-bot.png       # Logo
├── src/
│   ├── assistants/        # AI provider implementations
│   │   ├── googleai.js    # Google AI (Gemini)
│   │   ├── groqai.js      # Groq (Llama)
│   │   ├── openai.js      # OpenAI (GPT)
│   │   ├── deepseekai.js  # DeepSeek
│   │   ├── anthropicai.js # Anthropic (Claude)
│   │   └── xai.js         # X AI (Grok)
│   ├── components/        # React components
│   │   ├── App.jsx        # Main app component
│   │   ├── Auth/          # Login/Signup
│   │   ├── Chat/          # Chat interface & streaming
│   │   ├── Sidebar/       # Chat history sidebar
│   │   ├── Assistant/     # AI provider selector
│   │   ├── Layout/        # Shared Header & Footer
│   │   ├── Modals/        # Confirmation modals
│   │   ├── Spinner/       # Reusable loading spinner
│   │   ├── Theme/         # Dark mode toggle
│   │   └── ...
│   ├── contexts/          # React contexts
│   │   └── AuthContext.jsx # Authentication state
│   ├── hooks/             # Custom React hooks
│   │   └── useChat.js      # Chat state & persistence logic
│   ├── services/          # Business logic
│   │   └── chatService.js  # Supabase database operations
│   ├── utils/             # Utilities
│   │   ├── exportChat.js   # JSON/Markdown/PDF export
│   │   └── webSearch.js    # Real-time Serper.dev search
│   ├── lib/               # Libraries
│   │   └── supabaseClient.js # Supabase client
│   ├── index.css          # Global styles
│   └── main.jsx           # Entry point
├── supabase/              # Database
│   ├── migrations/        # SQL migrations
│   │   └── 20260126_initial_schema.sql
│   ├── setup.js           # Automated setup script
│   └── README.md          # Database setup guide
├── .env                   # Environment variables (not in git)
├── .env.example           # Example env file
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies
├── tailwind.config.js     # TailwindCSS config (removed in v4)
├── vite.config.js         # Vite configuration + search proxy
└── README.md              # This file
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Supabase](https://supabase.com/) - Backend & Auth
- AI Providers: Google, Groq, OpenAI, Anthropic, DeepSeek, X AI



## 🗺️ Roadmap

- [ ] Add more AI providers
- [ ] Voice input/output
- [ ] Image generation support
- [ ] Chat sharing functionality
- [ ] Mobile app (React Native)
- [ ] Browser extension

---

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

Made with ❤️ using React, Vite, and AI
