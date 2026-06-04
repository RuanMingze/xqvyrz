"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, X, ArrowRight } from "lucide-react";

const WALLPAPER_POOL = [
  "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1462951/pexels-photo-1462951.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/933498/pexels-photo-933498.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1470505/pexels-photo-1470505.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1933316/pexels-photo-1933316.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/285904/pexels-photo-285904.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/326235/pexels-photo-326235.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/355770/pexels-photo-355770.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/461960/pexels-photo-461960.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/733174/pexels-photo-733174.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/2437299/pexels-photo-2437299.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/7245151/pexels-photo-7245151.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1421903/pexels-photo-1421903.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/2585459/pexels-photo-2585459.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1293120/pexels-photo-1293120.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/917494/pexels-photo-917494.jpeg?auto=compress&cs=tinysrgb&w=1920",
];

function getDailyWallpaper(): string {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  let s = seed;
  s = ((s * 16807) % 2147483647) | 0;
  return WALLPAPER_POOL[s % WALLPAPER_POOL.length];
}

export default function Home() {
  const wallpaper = useMemo(() => getDailyWallpaper(), []);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
      );
      setDate(
        now.toLocaleDateString("zh-CN", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/suggestions?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(data.slice(0, 8));
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveSuggestion(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 200);
    setShowSuggestions(true);
  };

  const handleSearch = (q?: string) => {
    const searchQuery = q ?? query;
    if (!searchQuery.trim()) return;
    window.open(
      `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`,
      "_blank"
    );
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") handleSearch();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeSuggestion >= 0) {
        handleSearch(suggestions[activeSuggestion]);
        setQuery(suggestions[activeSuggestion]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = isFocused || query.length > 0;

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center select-none">
      <div className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-1000" style={{ backgroundImage: `url(${wallpaper})` }} />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-14 w-full px-4" style={{ zIndex: 3 }}>
        {/* Brand */}
        <div
          className="font-medium tracking-[0.35em] uppercase"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.4rem)",
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.35em",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}
        >
          Xqvyrz
        </div>

        {/* Clock */}
        <div className="flex flex-col items-center gap-3 text-white">
          <div
            className="font-extralight tabular-nums"
            style={{
              fontSize: "clamp(4.5rem, 12vw, 9rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              textShadow: "0 1px 30px rgba(0,0,0,0.2)",
            }}
          >
            {time}
          </div>
          <div
            className="font-light"
            style={{
              fontSize: "clamp(0.8rem, 1.2vw, 1rem)",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.15em",
            }}
          >
            {date}
          </div>
        </div>

        {/* Search area */}
        <div className="w-full max-w-[560px]">
          <div className="relative">
            {/* Search bar */}
            <div
              className="flex items-center transition-all duration-300"
              style={{
                background: isActive
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(255,255,255,0.08)",
                backdropFilter: "blur(24px) saturate(1.2)",
                WebkitBackdropFilter: "blur(24px) saturate(1.2)",
                borderRadius: showSuggestions && suggestions.length > 0 ? "20px 20px 0 0" : "20px",
                border: `1px solid ${isActive ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.12)"}`,
                borderBottom: showSuggestions && suggestions.length > 0
                  ? "1px solid rgba(255,255,255,0.06)"
                  : isActive
                    ? "1px solid rgba(255,255,255,0.18)"
                    : "1px solid rgba(255,255,255,0.12)",
                boxShadow: isActive
                  ? "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)"
                  : "0 2px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <div className="pl-5 shrink-0" style={{ opacity: isActive ? 0.6 : 0.35, transition: "opacity 0.2s" }}>
                <Search size={17} strokeWidth={1.8} style={{ color: "white" }} />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => { setIsFocused(true); if (query) setShowSuggestions(true); }}
                onBlur={() => setIsFocused(false)}
                placeholder="搜索"
                className="flex-1 bg-transparent px-4 py-[15px] text-[15px] outline-none"
                style={{
                  color: "rgba(255,255,255,0.9)",
                  caretColor: "rgba(255,255,255,0.7)",
                  fontWeight: 300,
                  letterSpacing: "0.02em",
                }}
                autoComplete="off"
                spellCheck={false}
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setSuggestions([]);
                    setShowSuggestions(false);
                    inputRef.current?.focus();
                  }}
                  className="mr-2 p-1.5 rounded-full"
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    transition: "color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.3)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <X size={14} />
                </button>
              )}
              <button
                onClick={() => handleSearch()}
                className="mr-3 p-2.5 rounded-[14px] transition-all duration-200"
                style={{
                  background: query ? "rgba(255,255,255,0.12)" : "transparent",
                  color: query ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
                }}
                onMouseEnter={(e) => {
                  if (query) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = query ? "rgba(255,255,255,0.12)" : "transparent";
                  e.currentTarget.style.color = query ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)";
                }}
              >
                <ArrowRight size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionRef}
                className="w-full overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(24px) saturate(1.2)",
                  WebkitBackdropFilter: "blur(24px) saturate(1.2)",
                  borderRadius: "0 0 20px 20px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderTop: "none",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    className="flex items-center gap-3 w-full px-6 py-3 text-left"
                    style={{
                      background: i === activeSuggestion
                        ? "rgba(255,255,255,0.08)"
                        : "transparent",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={() => setActiveSuggestion(i)}
                    onMouseLeave={() => setActiveSuggestion(-1)}
                    onClick={() => {
                      setQuery(s);
                      handleSearch(s);
                    }}
                  >
                    <Search
                      size={12}
                      strokeWidth={1.8}
                      style={{
                        color: i === activeSuggestion
                          ? "rgba(255,255,255,0.4)"
                          : "rgba(255,255,255,0.15)",
                        flexShrink: 0,
                        transition: "color 0.12s",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 300,
                        color: i === activeSuggestion
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(255,255,255,0.55)",
                        letterSpacing: "0.02em",
                        transition: "color 0.12s",
                      }}
                    >
                      {s}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            {[
              { label: "图片", url: "https://www.bing.com/images" },
              { label: "视频", url: "https://www.bing.com/videos" },
              { label: "地图", url: "https://www.bing.com/maps" },
              { label: "新闻", url: "https://www.bing.com/news" },
              { label: "翻译", url: "https://www.bing.com/translator" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-200"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "12px",
                  fontWeight: 300,
                  letterSpacing: "0.08em",
                  padding: "6px 14px",
                  borderRadius: "100px",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-5 right-8"
        style={{ zIndex: 3, color: "rgba(255,255,255,0.15)", fontSize: "11px", fontWeight: 300, letterSpacing: "0.05em" }}
      >
        Pexels
      </div>
    </div>
  );
}
