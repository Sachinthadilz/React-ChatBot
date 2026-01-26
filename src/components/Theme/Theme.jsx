import { useEffect } from "react";

export function Theme() {
  function handleValueChange(event) {
    const value = event.target.value;
    const root = document.documentElement;

    if (value === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      // Force remove system listener if manual override
    } else if (value === 'light') {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      root.style.colorScheme = 'light dark';
    }
  }

  // Initialize theme on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function applySystemTheme() {
      // Find the select element to check current value
      const select = document.querySelector('select');
      // Only apply system theme if "System" is selected (value is "light dark")
      if (select && select.value === 'light dark') {
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }

    // Apply immediately on mount
    applySystemTheme();

    // Listen for system changes (e.g. OS theme switch)
    mediaQuery.addEventListener('change', applySystemTheme);

    // Also listen for manual select changes to re-trigger system check if needed
    // (Though handleValueChange handles manual selection, this covers edge cases)
    const selectElement = document.querySelector('select');
    if (selectElement) {
      selectElement.addEventListener('change', applySystemTheme);
    }

    return () => {
      mediaQuery.removeEventListener('change', applySystemTheme);
      if (selectElement) {
        selectElement.removeEventListener('change', applySystemTheme);
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Theme:
      </span>
      <select
        defaultValue="light dark"
        onChange={handleValueChange}
        className="flex-1 px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 transition-all cursor-pointer"
      >
        <option value="light dark">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
