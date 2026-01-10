import React from "react";

// Types: we keep a loose contract compatible with example usage
// BundledLanguage: a union in real lib; here just string

export function CodeBlock({ data, defaultValue, children }) {
  const [active, setActive] = React.useState(
    defaultValue || (data?.[0]?.language ?? ""),
  );
  const itemsByLang = React.useMemo(() => {
    const map = new Map();
    (data || []).forEach((item) => map.set(item.language, item));
    return map;
  }, [data]);

  const tabs = (data || []).map((d) => d.language);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0C100D]/70 backdrop-blur">
      {/* Tabs header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <div className="flex items-center gap-2 overflow-auto">
          {tabs.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActive(lang)}
              className={[
                "px-2 py-1 rounded text-xs transition-colors",
                active === lang
                  ? "bg-white/10 text-white"
                  : "text-neutral-300 hover:text-white",
              ].join(" ")}
            >
              {itemsByLang.get(lang)?.filename || lang}
            </button>
          ))}
        </div>
      </div>

      <CodeBlockContext.Provider value={{ active }}>
        {children}
      </CodeBlockContext.Provider>
    </div>
  );
}

const CodeBlockContext = React.createContext({ active: "" });

export function CodeBlockBody({ children }) {
  React.useContext(CodeBlockContext);
  const render = (item) => children(item);
  return <div>{render}</div>;
}

export function CodeBlockItem({ value, children }) {
  const { active } = React.useContext(CodeBlockContext);
  if (active !== value) return null;
  return <div>{children}</div>;
}

export function CodeBlockContent({ language, children }) {
  // Reuse existing notes CodeBlock for rendering the highlighted code
  const LazyCode = React.useMemo(
    () => React.lazy(() => import("../../../../features/notes/CodeBlock.jsx")),
    [],
  );
  return (
    <React.Suspense
      fallback={<pre className="text-sm text-neutral-300 p-4">Loading…</pre>}
    >
      <LazyCode
        language={language}
        code={typeof children === "string" ? children : String(children)}
      />
    </React.Suspense>
  );
}

export default CodeBlock;
