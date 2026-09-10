import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "@/components/client/Logo";
import { DOC_SECTIONS, findItem } from "./config";
import { Menu, X, Search, ChevronRight } from "lucide-react";

function Badge({ text }: { text: string }) {
  const isNew = text === "NEW";
  const isSoon = text === "Soon";
  return (
    <span
      className={`ml-2 rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
        isNew
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
          : isSoon
            ? "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400"
            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
      }`}
    >
      {text}
    </span>
  );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <nav className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-7 py-6">
        <Logo size="sm" />
        <span className="text-sm text-zinc-400">Docs</span>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-zinc-400 hover:text-zinc-600">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 px-4 py-3 text-base text-zinc-400">
          <Search size={16} />
          <span>Search docs…</span>
          <kbd className="ml-auto text-xs text-zinc-300 dark:text-zinc-600">Ctrl K</kbd>
        </div>
      </div>

      {/* Nav sections */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-7">
        {DOC_SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={`/docs/${item.id}`}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center rounded-xl px-4 py-2.5 text-base transition-colors ${
                        isActive
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
                      }`
                    }
                  >
                    {item.label}
                    {item.badge && <Badge text={item.badge} />}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-7 py-5">
        <p className="text-sm text-zinc-400">
          Need help?{" "}
          <a href="mailto:dev@adara.ai" className="underline hover:text-zinc-700 dark:hover:text-zinc-200">
            dev@adara.ai
          </a>
        </p>
      </div>
    </nav>
  );
}

export default function DocsLayout({ children }: { children?: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  // Derive a readable page label from the URL segment for the breadcrumb
  const pageId = pathname.split("/").filter(Boolean).slice(1).join("/") || "introduction";
  const pageLabel = findItem(pageId)?.label ?? pageId.replace(/-/g, " ");

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-80 shrink-0 flex-col bg-white dark:bg-zinc-950 overflow-hidden">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-10 w-80 bg-white dark:bg-zinc-950 h-full flex flex-col shadow-xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-5 lg:px-10 py-5 border-b border-zinc-100 dark:border-zinc-900 shrink-0">
          <button
            className="lg:hidden text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-base text-zinc-400">
            <Link to="/docs/introduction" className="hover:text-zinc-700 dark:hover:text-zinc-200">
              Documentation
            </Link>
            <ChevronRight size={16} />
            <span className="text-zinc-700 dark:text-zinc-200 font-medium">{pageLabel}</span>
          </div>

          <Link
            to="/signup"
            className="ml-auto rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
          >
            Get API key
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
