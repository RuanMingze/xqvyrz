"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, X, ArrowRight, Settings, Plus, Trash2 } from "lucide-react";

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

const DEFAULT_QUICK_LINKS = [
  { label: "图片", url: "https://www.bing.com/images" },
  { label: "视频", url: "https://www.bing.com/videos" },
  { label: "地图", url: "https://www.bing.com/maps" },
  { label: "新闻", url: "https://www.bing.com/news" },
  { label: "翻译", url: "https://www.bing.com/translator" },
];

export default function Home() {
  const wallpaper = useMemo(() => getDailyWallpaper(), []);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [quickLinks, setQuickLinks] = useState<typeof DEFAULT_QUICK_LINKS>(DEFAULT_QUICK_LINKS);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextPosition, setContextPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showSettings, setShowSettings] = useState(false);
  const [settingsPosition, setSettingsPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

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

  useEffect(() => {
    const saved = localStorage.getItem("quickLinks");
    if (saved) {
      try {
        setQuickLinks(JSON.parse(saved));
      } catch {
        // 忽略无效数据
      }
    }
  }, []);

  const saveQuickLinks = useCallback((links: typeof DEFAULT_QUICK_LINKS) => {
    setQuickLinks(links);
    localStorage.setItem("quickLinks", JSON.stringify(links));
  }, []);

  const removeQuickLink = useCallback((index: number) => {
    const newLinks = quickLinks.filter((_, i) => i !== index);
    saveQuickLinks(newLinks);
  }, [quickLinks, saveQuickLinks]);

  const addQuickLink = useCallback(() => {
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) return;
    const newLink = { label: newLinkLabel.trim(), url: newLinkUrl.trim() };
    saveQuickLinks([...quickLinks, newLink]);
    setNewLinkLabel("");
    setNewLinkUrl("");
  }, [newLinkLabel, newLinkUrl, quickLinks, saveQuickLinks]);

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

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  }, []);

  const openSettings = useCallback(() => {
    setSettingsPosition(contextPosition);
    setShowSettings(true);
    setShowContextMenu(false);
  }, [contextPosition]);

  useEffect(() => {
    if (!showContextMenu) return;
    const handler = () => setShowContextMenu(false);
    document.addEventListener("click", handler);
    document.addEventListener("contextmenu", handler);
    return () => {
      document.removeEventListener("click", handler);
      document.removeEventListener("contextmenu", handler);
    };
  }, [showContextMenu]);

  useEffect(() => {
    if (!showSettings) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-settings-panel]")) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showSettings]);

  const isActive = isFocused || query.length > 0;

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center select-none"
      onContextMenu={handleContextMenu}
    >
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
        <div className="w-full max-w-[600px]">
          <div className="relative" style={{ transform: "translateZ(0)" }}>
            {/* Search bar - Glassmorphism 2.0 */}
            <div
              className="flex items-center transition-all duration-300 ease-out"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.08) 100%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(16px) saturate(180%) brightness(1.05)",
                WebkitBackdropFilter: "blur(16px) saturate(180%) brightness(1.05)",
                borderRadius: showSuggestions && suggestions.length > 0 ? "18px 18px 0 0" : "18px",
                borderWidth: "1.5px",
                borderStyle: "solid",
                borderColor: isActive ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.13)",
                borderBottomColor: showSuggestions && suggestions.length > 0
                  ? "rgba(255,255,255,0.08)"
                  : isActive ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.13)",
                boxShadow: isActive
                  ? "0 12px 40px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.05)"
                  : "0 4px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.10)",
              }}
            >
              <div className="pl-[18px] shrink-0" style={{ opacity: isActive ? 0.55 : 0.25, transition: "opacity 0.25s ease" }}>
                <Search size={18} strokeWidth={1.8} style={{ color: "#ffffff" }} />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => { setIsFocused(true); if (query) setShowSuggestions(true); }}
                onBlur={() => setIsFocused(false)}
                placeholder="搜索互联网..."
                className="flex-1 bg-transparent px-4 py-[17px] text-[15.5px] outline-none"
                style={{
                  color: "rgba(255,255,255,0.95)",
                  caretColor: "rgba(255,160,60,0.8)",
                  fontWeight: 350,
                  letterSpacing: "0.01em",
                  textShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  WebkitAppearance: "none",
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
                  className="mr-1.5 p-[7px] rounded-full transition-all duration-200 ease-out"
                  style={{
                    color: "rgba(255,255,255,0.28)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.28)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <X size={15} strokeWidth={2} />
                </button>
              )}
              <button
                onClick={() => handleSearch()}
                className="mr-[6px] p-[9px] rounded-[12px] transition-all duration-250 ease-out"
                style={{
                  background: query
                    ? "linear-gradient(135deg, rgba(255,140,50,0.85) 0%, rgba(230,100,30,0.85) 100%)"
                    : "transparent",
                  color: query ? "#ffffff" : "rgba(255,255,255,0.22)",
                  boxShadow: query ? "0 2px 12px rgba(255,120,40,0.35), inset 0 1px 0 rgba(255,255,255,0.2)" : "none",
                  opacity: query ? 1 : 0.5,
                }}
                onMouseEnter={(e) => {
                  if (query) {
                    e.currentTarget.style.transform = "scale(1.04)";
                    e.currentTarget.style.boxShadow = "0 4px 18px rgba(255,120,40,0.45), inset 0 1px 0 rgba(255,255,255,0.25)";
                  } else {
                    e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (query) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(255,120,40,0.35), inset 0 1px 0 rgba(255,255,255,0.2)";
                  } else {
                    e.currentTarget.style.color = "rgba(255,255,255,0.22)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <ArrowRight size={16} strokeWidth={2.2} />
              </button>
            </div>

            {/* Suggestions - Glassmorphism */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionRef}
                className="w-full overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.07) 100%)",
                  backdropFilter: "blur(16px) saturate(180%)",
                  WebkitBackdropFilter: "blur(16px) saturate(180%)",
                  borderRadius: "0 0 18px 18px",
                  border: "1.5px solid rgba(255,255,255,0.11)",
                  borderTop: "none",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.12)",
                }}
              >
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    className="flex items-center gap-3 w-full px-[22px] py-[11px] text-left transition-colors duration-150"
                    style={{
                      background: i === activeSuggestion
                        ? "rgba(255,255,255,0.09)"
                        : "transparent",
                      borderBottom:
                        i < suggestions.length - 1
                          ? "1px solid rgba(255,255,255,0.05)"
                          : "none",
                    }}
                    onMouseEnter={() => setActiveSuggestion(i)}
                    onMouseLeave={() => setActiveSuggestion(-1)}
                    onClick={() => {
                      setQuery(s);
                      handleSearch(s);
                    }}
                  >
                    <Search
                      size={13}
                      strokeWidth={1.8}
                      style={{
                        color: i === activeSuggestion
                          ? "rgba(255,160,60,0.7)"
                          : "rgba(255,255,255,0.18)",
                        flexShrink: 0,
                        transition: "color 0.15s",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 340,
                        color: i === activeSuggestion
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(255,255,255,0.58)",
                        letterSpacing: "0.01em",
                        textShadow: i === activeSuggestion ? "0 1px 8px rgba(0,0,0,0.2)" : "none",
                        transition: "color 0.15s, text-shadow 0.15s",
                      }}
                    >
                      {s}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick links - Chip Style */}
          <div className="flex items-center justify-center gap-2.5 mt-7 flex-wrap">
            {quickLinks.map((link, index) => (
              <a
                key={`${link.label}-${index}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-[18px] py-[9px] rounded-full transition-all duration-250 ease-out group relative"
                style={{
                  fontSize: "12.5px",
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.48)",
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.color = "rgba(255,255,255,0.92)";
                  el.style.background = "rgba(255,255,255,0.14)";
                  el.style.borderColor = "rgba(255,255,255,0.18)";
                  el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,140,50,0.15)";
                  el.style.transform = "translateY(-1.5px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.color = "rgba(255,255,255,0.48)";
                  el.style.background = "rgba(255,255,255,0.07)";
                  el.style.borderColor = "rgba(255,255,255,0.09)";
                  el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                  el.style.transform = "translateY(0)";
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Context menu - 右键菜单 */}
          {showContextMenu && (
            <div
              className="fixed w-[180px] rounded-lg py-1.5 animate-in fade-in zoom-in-95 duration-150"
              style={{
                zIndex: 100,
                left: Math.min(contextPosition.x, window.innerWidth - 200),
                top: Math.min(contextPosition.y, window.innerHeight - 100),
                background: "rgba(30,30,35,0.96)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.stopPropagation()}
            >
              <button
                onClick={openSettings}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left transition-colors"
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.8)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,140,50,0.15)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                }}
              >
                <Settings size={14} strokeWidth={1.8} />
                快速链接设置
              </button>
            </div>
          )}

          {/* Settings panel - 设置面板 */}
          {showSettings && (
            <div
              data-settings-panel
              className="fixed w-[320px] rounded-xl p-5 animate-in fade-in zoom-in-95 duration-200"
              style={{
                zIndex: 100,
                left: Math.min(settingsPosition.x, window.innerWidth - 340),
                top: Math.min(settingsPosition.y, window.innerHeight - 400),
                background: "linear-gradient(135deg, rgba(30,30,35,0.97) 0%, rgba(20,20,25,0.99) 100%)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.75)", letterSpacing: "0.03em" }}>
                  快速链接设置
                </span>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 rounded-full transition-colors"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </div>

              {/* Add new link form */}
              <div className="space-y-2.5 mb-4">
                <input
                  type="text"
                  value={newLinkLabel}
                  onChange={(e) => setNewLinkLabel(e.target.value)}
                  placeholder="标签名称"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "13px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(255,140,50,0.5)";
                    e.target.style.background = "rgba(255,255,255,0.09)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.08)";
                    e.target.style.background = "rgba(255,255,255,0.06)";
                  }}
                />
                <input
                  type="text"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="URL地址 (https://...)"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "13px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(255,140,50,0.5)";
                    e.target.style.background = "rgba(255,255,255,0.09)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.08)";
                    e.target.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addQuickLink();
                  }}
                />
                <button
                  onClick={addQuickLink}
                  disabled={!newLinkLabel.trim() || !newLinkUrl.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: newLinkLabel.trim() && newLinkUrl.trim()
                      ? "linear-gradient(135deg, rgba(255,140,50,0.85) 0%, rgba(230,100,30,0.85) 100%)"
                      : "rgba(255,255,255,0.04)",
                    color: newLinkLabel.trim() && newLinkUrl.trim()
                      ? "#ffffff"
                      : "rgba(255,255,255,0.2)",
                    opacity: newLinkLabel.trim() && newLinkUrl.trim() ? 1 : 0.5,
                    cursor: newLinkLabel.trim() && newLinkUrl.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  <Plus size={14} strokeWidth={2.2} />
                  添加链接
                </button>
              </div>

              {/* Current links list */}
              {quickLinks.length > 0 && (
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
                  {quickLinks.map((link, index) => (
                    <div
                      key={`${link.label}-${index}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg group/link"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <div className="flex-1 min-w-0 mr-2">
                        <div style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.85)", marginBottom: "2px" }}>
                          {link.label}
                        </div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {link.url}
                        </div>
                      </div>
                      <button
                        onClick={() => removeQuickLink(index)}
                        className="p-1.5 rounded-md opacity-0 group-hover/link:opacity-100 transition-all duration-200"
                        style={{
                          color: "rgba(255,120,120,0.7)",
                          background: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(255,80,80,0.15)";
                          e.currentTarget.style.color = "rgba(255,120,120,1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "rgba(255,120,120,0.7)";
                        }}
                      >
                        <Trash2 size={12} strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {quickLinks.length === 0 && (
                <div className="text-center py-6" style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
                  暂无快速链接，请添加
                </div>
              )}
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
