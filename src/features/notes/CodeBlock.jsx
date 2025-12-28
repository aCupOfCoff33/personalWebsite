import React from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { Copy, Check } from "lucide-react";

// Register only the languages we actually need to keep bundle small
// Extendable: add more loaders as needed
const languageLoaders = {
  javascript: () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/javascript"),
  typescript: () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/typescript"),
  json: () => import("react-syntax-highlighter/dist/esm/languages/prism/json"),
};

const registered = new Set();

/**
 * Parse special highlight annotations and return a tuple of
 * - cleanedCode: string without annotations
 * - highlightedLines: Set<number> of 1-based line numbers to emphasize
 */
function parseHighlightedLines(rawCode) {
  const lines = rawCode.split(/\r?\n/);
  const highlighted = new Set();
  const cleaned = lines.map((line, index) => {
    const markerIdx = line.indexOf("[!code highlight]");
    if (markerIdx !== -1) {
      highlighted.add(index + 1);
      // Remove the marker (and any preceding inline comment delimiters)
      return line
        .replace(/\/\/[\s]*\[!code highlight\]/, "")
        .replace(/\/\*[\s]*\[!code highlight\][\s]*\*\//, "")
        .replace("[!code highlight]", "")
        .trimEnd();
    }
    return line;
  });
  return { cleanedCode: cleaned.join("\n"), highlightedLines: highlighted };
}

export default function CodeBlock({
  code,
  language = "javascript",
  filename,
  showLineNumbers = true,
  renderHeader = true,
}) {
  const [ready, setReady] = React.useState(registered.has(language));
  const [theme, setTheme] = React.useState(null);
  const [copied, setCopied] = React.useState(false);

  const { cleanedCode, highlightedLines } = React.useMemo(
    () => parseHighlightedLines(code || ""),
    [code],
  );

  React.useEffect(() => {
    let cancelled = false;
    async function ensureLanguage(lang) {
      if (registered.has(lang)) {
        setReady(true);
        return;
      }
      const loader = languageLoaders[lang];
      if (!loader) {
        setReady(true);
        return;
      }
      const mod = await loader();
      if (cancelled) return;
      SyntaxHighlighter.registerLanguage(lang, mod.default);
      registered.add(lang);
      setReady(true);
    }
    ensureLanguage(language);
    return () => {
      cancelled = true;
    };
  }, [language]);

  React.useEffect(() => {
    let cancelled = false;
    async function ensureTheme() {
      const mod =
        await import("react-syntax-highlighter/dist/esm/styles/prism");
      if (cancelled) return;
      setTheme(mod.vscDarkPlus);
    }
    ensureTheme();
    return () => {
      cancelled = true;
    };
  }, []);

  const onCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cleanedCode);
      setCopied(true);
      const t = setTimeout(() => setCopied(false), 1200);
      return () => clearTimeout(t);
    } catch {
      // no-op
    }
  }, [cleanedCode]);

  if (!ready || !theme) {
    return (
      <pre className="text-sm text-neutral-300 p-4 bg-black/30 rounded-xl overflow-auto">
        Loading code…
      </pre>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0C100D]/70 backdrop-blur">
      {/* Header */}
      {renderHeader && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
          <div className="text-xs text-neutral-300 truncate">
            {filename || (language ? `${language}` : "code")}
          </div>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1 text-xs text-neutral-300 hover:text-white transition-colors"
            aria-label="Copy code to clipboard"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}

      {/* Body */}
      <SyntaxHighlighter
        language={language}
        style={theme}
        wrapLines
        showLineNumbers={showLineNumbers}
        lineNumberStyle={{ color: "rgba(255,255,255,0.35)" }}
        lineProps={(lineNumber) => {
          if (highlightedLines.has(lineNumber)) {
            return {
              style: {
                display: "block",
                background: "rgba(255,255,255,0.06)",
                marginLeft: "-16px",
                marginRight: "-16px",
                paddingLeft: "16px",
                paddingRight: "16px",
                borderLeft: "3px solid rgba(255,255,255,0.25)",
              },
            };
          }
          return {};
        }}
        customStyle={{
          margin: 0,
          padding: "16px",
          background: "transparent",
          fontSize: "0.9rem",
        }}
      >
        {cleanedCode}
      </SyntaxHighlighter>
    </div>
  );
}
