import { useEffect, useState } from "react";
import { Assistant as GoogleAIAssistant } from "../../assistants/googleai";
import { Assistant as OpenAIAssistant } from "../../assistants/openai";
import { Assistant as DeepSeekAIAssistant } from "../../assistants/deepseekai";
import { Assistant as AnthropicAIAssistant } from "../../assistants/anthropicai";
import { Assistant as XAIAssistant } from "../../assistants/xai";
import { Assistant as GroqAIAssistant } from "../../assistants/groqai";

const PROVIDERS = {
  googleai: {
    label: "Google AI",
    envKey: "VITE_GOGGLE_AI_API_KEY",
    models: [
      { value: "googleai:gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      { value: "googleai:gemini-3-flash-preview", label: "Gemini 3 Flash Preview" },
    ],
  },
  groqai: {
    label: "Groq",
    envKey: "VITE_GROQ_API_KEY",
    models: [
      { value: "groqai:llama-3.3-70b-versatile", label: "Llama 3.3 70B Versatile" },
      { value: "groqai:llama-3.1-8b-instant", label: "Llama 3.1 8B Instant" },
    ],
  },
  openai: {
    label: "Open AI",
    envKey: "VITE_OPEN_AI_API_KEY",
    models: [
      { value: "openai:gpt-4o-mini", label: "GPT-4o mini" },
      { value: "openai:chatgpt-4o-latest", label: "ChatGPT-4o" },
    ],
  },
  deepseekai: {
    label: "DeepSeek AI",
    envKey: "VITE_DEEPSEEK_AI_API_KEY",
    models: [
      { value: "deepseekai:deepseek-chat", label: "DeepSeek-V3" },
    ],
  },
  anthropicai: {
    label: "Anthropic AI",
    envKey: "VITE_ANTHROPIC_AI_API_KEY",
    models: [
      { value: "anthropicai:claude-3-5-haiku-latest", label: "Claude 3.5 Haiku" },
    ],
  },
  xai: {
    label: "X AI",
    envKey: "VITE_X_AI_API_KEY",
    models: [
      { value: "xai:grok-3-mini-latest", label: "Grok 3 Mini" },
    ],
  },
};

const assistantMap = {
  googleai: GoogleAIAssistant,
  openai: OpenAIAssistant,
  deepseekai: DeepSeekAIAssistant,
  anthropicai: AnthropicAIAssistant,
  xai: XAIAssistant,
  groqai: GroqAIAssistant,
};

export function Assistant({ onAssistantChange }) {
  // Filter providers based on available API keys
  const availableProviders = Object.entries(PROVIDERS).filter(([_, config]) => {
    return import.meta.env[config.envKey];
  });

  // Get the first available model as fallback
  const firstAvailableModel = availableProviders.length > 0
    ? availableProviders[0][1].models[0].value
    : null;

  const [value, setValue] = useState(() => {
    // If we have providers, verify current default is available
    if (availableProviders.length > 0) {
      // Check if googleai:gemini-2.5-flash is available
      const geminiAvailable = availableProviders.some(([key]) => key === 'googleai');
      return geminiAvailable ? "googleai:gemini-2.5-flash" : firstAvailableModel;
    }
    return "";
  });

  function handleValueChange(event) {
    setValue(event.target.value);
  }

  useEffect(() => {
    if (!value) return;

    const [assistant, model] = value.split(":");
    const AssistantClass = assistantMap[assistant];

    if (!AssistantClass) {
      console.error(`Unknown assistant: ${assistant} or model: ${model}`);
      return;
    }

    onAssistantChange(new AssistantClass(model));
  }, [value]);

  if (availableProviders.length === 0) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-red-600 dark:text-red-400">
          No API keys found
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Assistant:
      </span>
      <select
        value={value}
        onChange={handleValueChange}
        className="flex-1 px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 transition-all cursor-pointer"
      >
        {availableProviders.map(([key, config]) => (
          <optgroup key={key} label={config.label}>
            {config.models.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
