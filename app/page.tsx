"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, X, ArrowRight, Settings, Plus, Trash2, Check, Upload, Clock } from "lucide-react";

const WALLPAPER_POOL = [
  "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=1920",
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

async function getWallpaperFromDB(): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get("customWallpaper");
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function saveWallpaperToDB(dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(dataUrl, "customWallpaper");
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch {
    return;
  }
}

interface QuickLink {
  label: string;
  url: string;
  iconBase64?: string;
  iconUrl?: string;
}

const DEFAULT_QUICK_LINKS: QuickLink[] = [
  { label: "图片", url: "https://www.bing.com/images" },
  { label: "视频", url: "https://www.bing.com/videos" },
  { label: "地图", url: "https://www.bing.com/maps" },
  { label: "新闻", url: "https://www.bing.com/news" },
  { label: "翻译", url: "https://www.bing.com/translator" },
];

const DB_NAME = "XqvyrzDB";
const DB_VERSION = 1;
const STORE_NAME = "quickLinks";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (e) => {
      console.error("[DB] openDB error:", request.error);
      reject(request.error);
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

async function getLinksFromDB(): Promise<QuickLink[] | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get("links");
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (e) => {
        console.error("[DB] getLinksFromDB error:", e);
        resolve(null);
      };
    });
  } catch (e) {
    console.error("[DB] getLinksFromDB exception:", e);
    return null;
  }
}

async function saveLinksToDB(links: QuickLink[]): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(links, "links");
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = (e) => {
        console.error("[DB] saveLinksToDB error:", e);
        resolve();
      };
    });
  } catch (e) {
    console.error("[DB] saveLinksToDB exception:", e);
  }
}

interface AppSettings {
  version: number;
  showSeconds: boolean;
  showClock: boolean;
  showDate: boolean;
  showBrandName: boolean;
  showSearchHistory: boolean;
  showSearchSuggestions: boolean;
  searchHistoryLimit: number;
}

const SETTINGS_VERSION = 1;

const DEFAULT_APP_SETTINGS: AppSettings = {
  version: SETTINGS_VERSION,
  showSeconds: false,
  showClock: true,
  showDate: true,
  showBrandName: true,
  showSearchHistory: true,
  showSearchSuggestions: true,
  searchHistoryLimit: 3,
};

async function getAppSettingsFromDB(): Promise<AppSettings | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get("appSettings");
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (e) => {
        console.error("[DB] getAppSettings error:", e);
        resolve(null);
      };
    });
  } catch (e) {
    console.error("[DB] getAppSettings exception:", e);
    return null;
  }
}

async function saveAppSettingsToDB(settings: AppSettings): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(settings, "appSettings");
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = (e) => {
        console.error("[DB] saveAppSettings error:", e);
        resolve();
      };
    });
  } catch (e) {
    console.error("[DB] saveAppSettings exception:", e);
  }
}

async function getSearchHistoryFromDB(): Promise<string[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get("searchHistory");
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = (e) => {
        console.error("[DB] getSearchHistoryFromDB error:", e);
        resolve([]);
      };
    });
  } catch (e) {
    console.error("[DB] getSearchHistoryFromDB exception:", e);
    return [];
  }
}

async function saveSearchHistoryToDB(history: string[]): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(history, "searchHistory");
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = (e) => {
        console.error("[DB] saveSearchHistoryToDB error:", e);
        resolve();
      };
    });
  } catch (e) {
    console.error("[DB] saveSearchHistoryToDB exception:", e);
  }
}

async function addToSearchHistory(query: string): Promise<void> {
  if (!query.trim()) return;
  const history = await getSearchHistoryFromDB();
  const filtered = history.filter(h => h !== query);
  const newHistory = [query, ...filtered].slice(0, 10);
  await saveSearchHistoryToDB(newHistory);
}

function compressImage(file: File, maxWidth = 64, maxHeight = 64): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/png", 0.8));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function extractDomain(url: string): string | null {
  try {
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    const urlObj = new URL(normalizedUrl);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

function fetchFaviconWithCheck(url: string): { url: string | null; failed: boolean } {
  const domain = extractDomain(url);
  if (!domain) {
    return { url: null, failed: true };
  }

  // 使用 icon.wr.do - 聚合了多个 favicon 源的 proxy 服务
  const faviconUrl = `https://icon.wr.do/${domain}.ico`;
  return { url: faviconUrl, failed: false };
}

export default function Home() {
  const [wallpaper, setWallpaper] = useState<string>(getDailyWallpaper());
  const [wallpaperSource, setWallpaperSource] = useState<"library" | "local">("library");
  const [dailyWallpaperEnabled, setDailyWallpaperEnabled] = useState(false);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [matchedHistory, setMatchedHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(DEFAULT_QUICK_LINKS);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextPosition, setContextPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showSettings, setShowSettings] = useState(false);
  const [settingsPosition, setSettingsPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showWallpaperSettings, setShowWallpaperSettings] = useState(false);
  const [wallpaperPosition, setWallpaperPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkIcon, setNewLinkIcon] = useState<string | null>(null);
  const [newLinkAutoFavicon, setNewLinkAutoFavicon] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [editingUrl, setEditingUrl] = useState("");
  const [editingIcon, setEditingIcon] = useState<string | null>(null);
  const [editingAutoFavicon, setEditingAutoFavicon] = useState(true);
  const [showAppSettings, setShowAppSettings] = useState(false);
  const [showSeconds, setShowSeconds] = useState(false);
  const [showClock, setShowClock] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showBrandName, setShowBrandName] = useState(true);
  const [showSearchHistory, setShowSearchHistory] = useState(true);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(true);
  const [searchHistoryLimit, setSearchHistoryLimit] = useState(3);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wallpaperInputRef = useRef<HTMLInputElement>(null);
  const newIconInputRef = useRef<HTMLInputElement>(null);
  const editIconInputRef = useRef<HTMLInputElement>(null);

  const applyWallpaper = useCallback((nextWallpaper: string, source: "library" | "local", options?: { keepDaily?: boolean; persist?: boolean; lastDailyChange?: number }) => {
    setWallpaper(nextWallpaper);
    setWallpaperSource(source);
    if (options?.persist !== false) {
      window.localStorage.setItem("xqvyrz-wallpaper", nextWallpaper);
      window.localStorage.setItem("xqvyrz-wallpaper-source", source);
      if (options?.lastDailyChange) {
        window.localStorage.setItem("xqvyrz-wallpaper-last-daily", String(options.lastDailyChange));
      }
    }
    if (source === "local") {
      saveWallpaperToDB(nextWallpaper);
    }
  }, []);

  const randomizeWallpaper = useCallback(() => {
    const nextWallpaper = WALLPAPER_POOL[Math.floor(Math.random() * WALLPAPER_POOL.length)];
    const now = Date.now();
    window.localStorage.setItem("xqvyrz-wallpaper", nextWallpaper);
    window.localStorage.setItem("xqvyrz-wallpaper-source", "library");
    window.localStorage.setItem("xqvyrz-wallpaper-last-daily", String(now));
    setWallpaper(nextWallpaper);
    setWallpaperSource("library");
  }, []);

  const toggleDailyWallpaper = useCallback(() => {
    const nextValue = !dailyWallpaperEnabled;
    setDailyWallpaperEnabled(nextValue);
    window.localStorage.setItem("xqvyrz-wallpaper-daily", nextValue ? "true" : "false");
  }, [dailyWallpaperEnabled]);

  const handleWallpaperFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      await saveWallpaperToDB(dataUrl);
      applyWallpaper(dataUrl, "local", { persist: true });
      setShowWallpaperSettings(false);
      window.localStorage.setItem("xqvyrz-wallpaper-source", "local");
      window.localStorage.setItem("xqvyrz-wallpaper", dataUrl);
    };
    reader.readAsDataURL(file);
  }, [applyWallpaper]);

  useEffect(() => {
    const loadWallpaper = async () => {
      const storedWallpaper = window.localStorage.getItem("xqvyrz-wallpaper");
      const storedSource = window.localStorage.getItem("xqvyrz-wallpaper-source") as "library" | "local" | null;
      const storedDaily = window.localStorage.getItem("xqvyrz-wallpaper-daily") === "true";
      const storedLastDaily = Number(window.localStorage.getItem("xqvyrz-wallpaper-last-daily") || "0");
      const customWallpaper = storedSource === "local" ? await getWallpaperFromDB() : null;
      const initialWallpaper = storedWallpaper && (storedSource !== "local" || customWallpaper)
        ? (storedSource === "local" ? customWallpaper || storedWallpaper : storedWallpaper)
        : getDailyWallpaper();
      setWallpaper(initialWallpaper);
      setWallpaperSource(storedSource === "local" ? "local" : "library");
      setDailyWallpaperEnabled(storedDaily);
      if (storedDaily && storedLastDaily && Date.now() - storedLastDaily > 24 * 60 * 60 * 1000) {
        randomizeWallpaper();
      }
    };
    loadWallpaper();
  }, [randomizeWallpaper]);

  useEffect(() => {
    if (!dailyWallpaperEnabled) return;
    const id = window.setInterval(() => {
      const lastDaily = Number(window.localStorage.getItem("xqvyrz-wallpaper-last-daily") || "0");
      if (Date.now() - lastDaily > 24 * 60 * 60 * 1000) {
        randomizeWallpaper();
      }
    }, 60000);
    return () => window.clearInterval(id);
  }, [dailyWallpaperEnabled, randomizeWallpaper]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("zh-CN", { 
          hour: "2-digit", 
          minute: "2-digit",
          second: showSeconds ? "2-digit" : undefined,
        })
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
  }, [showSeconds]);

  useEffect(() => {
    const loadLinks = async () => {
      const saved = await getLinksFromDB();
      if (saved && Array.isArray(saved)) {
        setQuickLinks(saved);
      }
    };
    loadLinks();
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      const saved = await getAppSettingsFromDB();
      if (saved) {
        if (saved.version === SETTINGS_VERSION) {
          setShowSeconds(saved.showSeconds);
          setShowClock(saved.showClock);
          setShowDate(saved.showDate);
          setShowBrandName(saved.showBrandName);
          setShowSearchHistory(saved.showSearchHistory ?? true);
          setShowSearchSuggestions(saved.showSearchSuggestions ?? true);
          setSearchHistoryLimit(saved.searchHistoryLimit ?? 3);
        } else {
          setShowSeconds(false);
          setShowClock(saved.showClock ?? true);
          setShowDate(saved.showDate ?? true);
          setShowBrandName(saved.showBrandName ?? true);
          setShowSearchHistory(saved.showSearchHistory ?? true);
          setShowSearchSuggestions(saved.showSearchSuggestions ?? true);
          setSearchHistoryLimit(saved.searchHistoryLimit ?? 3);
        }
      } else {
      }
      const history = await getSearchHistoryFromDB();
      setSearchHistory(history);
    };
    loadSettings();
  }, []);

  const saveAppSettings = useCallback(async () => {
    await saveAppSettingsToDB({
      version: SETTINGS_VERSION,
      showSeconds,
      showClock,
      showDate,
      showBrandName,
      showSearchHistory,
      showSearchSuggestions,
      searchHistoryLimit,
    });
  }, [showSeconds, showClock, showDate, showBrandName, showSearchHistory, showSearchSuggestions, searchHistoryLimit]);

  useEffect(() => {
    saveAppSettings();
  }, [saveAppSettings]);

  const saveQuickLinks = useCallback(async (links: QuickLink[]) => {
    setQuickLinks(links);
    await saveLinksToDB(links);
  }, []);

  const removeQuickLink = useCallback((index: number) => {
    const newLinks = quickLinks.filter((_, i) => i !== index);
    saveQuickLinks(newLinks);
  }, [quickLinks, saveQuickLinks]);

  const addQuickLink = useCallback(() => {
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) return;
    const newLink: QuickLink = {
      label: newLinkLabel.trim(),
      url: newLinkUrl.trim(),
      iconBase64: newLinkIcon || undefined,
    };
    if (!newLinkIcon && newLinkAutoFavicon) {
      const { url: faviconUrl } = fetchFaviconWithCheck(newLinkUrl.trim());
      if (faviconUrl) newLink.iconUrl = faviconUrl;
    }
    saveQuickLinks([...quickLinks, newLink]);
    setNewLinkLabel("");
    setNewLinkUrl("");
    setNewLinkIcon(null);
    setNewLinkAutoFavicon(true);
  }, [newLinkLabel, newLinkUrl, newLinkIcon, newLinkAutoFavicon, quickLinks, saveQuickLinks]);

  const startEdit = useCallback((index: number) => {
    const link = quickLinks[index];
    setEditingIndex(index);
    setEditingLabel(link.label);
    setEditingUrl(link.url);
    setEditingIcon(link.iconBase64 || null);
  }, [quickLinks]);

  const saveEdit = useCallback(() => {
    if (editingIndex === null) return;
    const newLink: QuickLink = {
      label: editingLabel.trim(),
      url: editingUrl.trim(),
      iconBase64: editingIcon || undefined,
    };
    if (!editingIcon && editingAutoFavicon) {
      const { url: faviconUrl } = fetchFaviconWithCheck(editingUrl.trim());
      if (faviconUrl) newLink.iconUrl = faviconUrl;
    }
    const newLinks = [...quickLinks];
    newLinks[editingIndex] = newLink;
    saveQuickLinks(newLinks);
    setEditingIndex(null);
    setEditingLabel("");
    setEditingUrl("");
    setEditingIcon(null);
    setEditingAutoFavicon(true);
  }, [editingIndex, editingLabel, editingUrl, editingIcon, editingAutoFavicon, quickLinks, saveQuickLinks]);

  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
    setEditingLabel("");
    setEditingUrl("");
    setEditingIcon(null);
  }, []);

  const handleNewIconUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await compressImage(file);
    setNewLinkIcon(base64);
  }, []);

  const handleEditIconUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await compressImage(file);
    setEditingIcon(base64);
  }, []);

  const clearNewIcon = useCallback(() => {
    setNewLinkIcon(null);
    if (newIconInputRef.current) {
      newIconInputRef.current.value = "";
    }
  }, []);

  const clearEditIcon = useCallback(() => {
    setEditingIcon(null);
    if (editIconInputRef.current) {
      editIconInputRef.current.value = "";
    }
  }, []);

  const truncateSuggestion = (suggestion: string, query: string): string => {
    const maxLength = 13;
    const normalizedQuery = query.trim().toLowerCase();

    if (suggestion.length <= maxLength) {
      return suggestion;
    }

    if (normalizedQuery) {
      const matchIndex = suggestion.toLowerCase().indexOf(normalizedQuery);
      if (matchIndex >= 0) {
        const suffix = suggestion.slice(matchIndex + normalizedQuery.length);
        if (suffix.length > 0) {
          return "......" + suffix.slice(0, maxLength);
        }
      }
    }

    return "......" + suggestion.slice(-maxLength);
  };

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSuggestions([]);
      setMatchedHistory([]);
      return;
    }
    try {
      const res = await fetch(`/api/suggestions?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(data.slice(0, 8));
      const history = await getSearchHistoryFromDB();
      const matched = history.filter(h => h.toLowerCase().includes(q.toLowerCase())).slice(0, 5);
      setMatchedHistory(matched);
    } catch {
      setSuggestions([]);
      setMatchedHistory([]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveSuggestion(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 25);
    setShowSuggestions(true);
  };

  const handleSearch = async (q?: string) => {
    const searchQuery = q ?? query;
    if (!searchQuery.trim()) return;
    setQuery("");
    setSuggestions([]);
    setMatchedHistory([]);
    setActiveSuggestion(-1);
    if (showSearchHistory) {
      await addToSearchHistory(searchQuery);
      const history = await getSearchHistoryFromDB();
      setSearchHistory(history);
    }
    window.open(
      `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`,
      "_blank"
    );
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const hasSuggestions = showSearchSuggestions && (suggestions?.length ?? 0) > 0;
    const hasMatchedHistory = hasSuggestions && (matchedHistory?.length ?? 0) > 0;
    const matchedCount = hasMatchedHistory ? (matchedHistory?.length ?? 0) : 0;
    const suggestionCount = hasSuggestions ? (suggestions?.length ?? 0) : 0;
    const totalItems = matchedCount + suggestionCount;

    if (!showSuggestions || totalItems === 0) {
      if (e.key === "Enter") handleSearch();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((i) => Math.min(i + 1, totalItems - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeSuggestion >= 0) {
        if (activeSuggestion < matchedCount) {
          const historyItem = matchedHistory[activeSuggestion];
          setQuery(historyItem);
          handleSearch(historyItem);
        } else {
          const suggestionIndex = activeSuggestion - matchedCount;
          const suggestionItem = suggestions[suggestionIndex];
          setQuery(suggestionItem);
          handleSearch(suggestionItem);
        }
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
    // 如果按住了 Ctrl 键，显示浏览器默认右键菜单
    if (e.ctrlKey) {
      return;
    }
    e.preventDefault();
    setContextPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  }, []);

  const openSettings = useCallback(() => {
    setSettingsPosition(contextPosition);
    setShowSettings(true);
    setShowContextMenu(false);
  }, [contextPosition]);

  const openAppSettings = useCallback(() => {
    setSettingsPosition(contextPosition);
    setShowAppSettings(true);
    setShowContextMenu(false);
  }, [contextPosition]);

  const openWallpaperSettings = useCallback(() => {
    setWallpaperPosition(contextPosition);
    setShowWallpaperSettings(true);
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

  useEffect(() => {
    if (!showAppSettings) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-app-settings-panel]")) {
        setShowAppSettings(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showAppSettings]);

  useEffect(() => {
    if (!showWallpaperSettings) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-wallpaper-settings-panel]")) {
        setShowWallpaperSettings(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showWallpaperSettings]);

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
        {showBrandName && (
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
        )}

        {showClock && (
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
            {showDate && (
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
            )}
          </div>
        )}

        <div className="w-full max-w-[600px]">
          <div className="relative" style={{ transform: "translateZ(0)" }}>
            <div
              className="flex items-center transition-all duration-300 ease-out"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.08) 100%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(16px) saturate(180%) brightness(1.05)",
                WebkitBackdropFilter: "blur(16px) saturate(180%) brightness(1.05)",
                borderRadius: showSuggestions && ((showSearchHistory && (searchHistory?.length ?? 0) > 0) || (showSearchSuggestions && (suggestions?.length ?? 0) > 0)) ? "18px 18px 0 0" : "18px",
                borderWidth: "1.5px",
                borderStyle: "solid",
                borderTopColor: isActive ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.13)",
                borderRightColor: isActive ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.13)",
                borderLeftColor: isActive ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.13)",
                borderBottomColor: showSuggestions && ((showSearchHistory && (searchHistory?.length ?? 0) > 0) || (showSearchSuggestions && (suggestions?.length ?? 0) > 0))
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
                onFocus={() => { setIsFocused(true); setShowSuggestions(true); }}
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

            {showSuggestions && ((showSearchHistory && (searchHistory?.length ?? 0) > 0) || (showSearchSuggestions && (suggestions?.length ?? 0) > 0)) && (
              <div
                ref={suggestionRef}
                onMouseLeave={() => setActiveSuggestion(-1)}
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
                {showSearchSuggestions && showSearchHistory && !query && (searchHistory?.length ?? 0) > 0 && (
                  <>
                    {searchHistory.slice(0, searchHistoryLimit).map((h, i) => (
                      <div
                        key={`history-${i}`}
                        className="flex items-center gap-3 w-full px-[22px] py-[11px] text-left"
                        style={{
                          background: activeSuggestion === i
                            ? "rgba(255,255,255,0.09)"
                            : "transparent",
                          borderBottom:
                            i < Math.min(searchHistoryLimit, (searchHistory?.length ?? 0)) - 1
                              ? "1px solid rgba(255,255,255,0.05)"
                              : "none",
                        }}
                        onMouseEnter={() => setActiveSuggestion(i)}
                        onMouseLeave={() => setActiveSuggestion(-1)}
                        onClick={() => {
                          setQuery(h);
                          handleSearch(h);
                        }}
                      >
                        <Clock
                          size={13}
                          strokeWidth={1.8}
                          style={{
                            color: activeSuggestion === i
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
                            color: activeSuggestion === i
                              ? "rgba(255,255,255,0.95)"
                              : "rgba(255,255,255,0.58)",
                            letterSpacing: "0.01em",
                            textShadow: activeSuggestion === i ? "0 1px 8px rgba(0,0,0,0.2)" : "none",
                            transition: "color 0.15s, text-shadow 0.15s",
                          }}
                        >
                          {h}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newHistory = searchHistory.filter((_, idx) => idx !== i);
                            saveSearchHistoryToDB(newHistory);
                            setSearchHistory(newHistory);
                          }}
                          className="ml-auto p-1 rounded-full transition-colors"
                          style={{
                            color: "rgba(255,255,255,0.2)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "rgba(255,100,100,0.7)";
                            e.currentTarget.style.background = "rgba(255,100,100,0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "rgba(255,255,255,0.2)";
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <X size={12} strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </>
                )}

                {showSearchSuggestions && !showSearchHistory && query && (suggestions?.length ?? 0) > 0 && (
                  <>
                    {suggestions.map((s, i) => (
                      <button
                        key={`suggestion-${i}`}
                        className="flex items-center gap-3 w-full px-[22px] py-[11px] text-left"
                        style={{
                          background: activeSuggestion === i
                            ? "rgba(0,0,0,0.18)"
                            : "transparent",
                          borderBottom:
                            i < (suggestions?.length ?? 0) - 1
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
                            color: activeSuggestion === i
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
                            color: activeSuggestion === i
                              ? "rgba(255,255,255,0.95)"
                              : "rgba(255,255,255,0.58)",
                            letterSpacing: "0.01em",
                            textShadow: activeSuggestion === i ? "0 1px 8px rgba(0,0,0,0.2)" : "none",
                            transition: "color 0.15s, text-shadow 0.15s",
                          }}
                        >
                          {truncateSuggestion(s, query)}
                        </span>
                      </button>
                    ))}
                  </>
                )}

                {!showSearchSuggestions && showSearchHistory && (searchHistory?.length ?? 0) > 0 && (
                  <>
                    {(query ? matchedHistory : searchHistory).slice(0, query ? undefined : searchHistoryLimit).map((h, i) => (
                      <div
                        key={`history-${i}`}
                        className="flex items-center gap-3 w-full px-[22px] py-[11px] text-left"
                        style={{
                          background: activeSuggestion === i
                            ? "rgba(0,0,0,0.18)"
                            : "transparent",
                          borderBottom:
                            i < (query ? (matchedHistory?.length ?? 0) : Math.min(searchHistoryLimit, (searchHistory?.length ?? 0))) - 1
                              ? "1px solid rgba(255,255,255,0.05)"
                              : "none",
                        }}
                        onMouseEnter={() => setActiveSuggestion(i)}
                        onMouseLeave={() => setActiveSuggestion(-1)}
                        onClick={() => {
                          setQuery(h);
                          handleSearch(h);
                        }}
                      >
                        <Clock
                          size={13}
                          strokeWidth={1.8}
                          style={{
                            color: activeSuggestion === i
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
                            color: activeSuggestion === i
                              ? "rgba(255,255,255,0.95)"
                              : "rgba(255,255,255,0.58)",
                            letterSpacing: "0.01em",
                            textShadow: activeSuggestion === i ? "0 1px 8px rgba(0,0,0,0.2)" : "none",
                            transition: "color 0.15s, text-shadow 0.15s",
                          }}
                        >
                          {h}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newHistory = searchHistory.filter((_, idx) => idx !== i);
                            saveSearchHistoryToDB(newHistory);
                            setSearchHistory(newHistory);
                          }}
                          className="ml-auto p-1 rounded-full transition-colors"
                          style={{
                            color: "rgba(255,255,255,0.2)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "rgba(255,100,100,0.7)";
                            e.currentTarget.style.background = "rgba(255,100,100,0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "rgba(255,255,255,0.2)";
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <X size={12} strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </>
                )}

                {showSearchSuggestions && showSearchHistory && query && (suggestions?.length ?? 0) > 0 && (
                  <>
                    {(matchedHistory?.length ?? 0) > 0 && (
                      <>
                        {matchedHistory.map((h, i) => (
                          <div
                            key={`matched-history-${i}`}
                            className="flex items-center gap-3 w-full px-[22px] py-[11px] text-left"
                            style={{
                              background: activeSuggestion === i
                                ? "rgba(255,255,255,0.09)"
                                : "transparent",
                              borderBottom:
                                i < (matchedHistory?.length ?? 0) - 1
                                  ? "1px solid rgba(255,255,255,0.05)"
                                  : "none",
                            }}
                            onMouseEnter={() => setActiveSuggestion(i)}
                            onMouseLeave={() => setActiveSuggestion(-1)}
                            onClick={() => {
                              setQuery(h);
                              handleSearch(h);
                            }}
                          >
                            <Clock
                              size={13}
                              strokeWidth={1.8}
                              style={{
                                color: activeSuggestion === i
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
                                color: activeSuggestion === i
                                  ? "rgba(255,255,255,0.95)"
                                  : "rgba(255,255,255,0.58)",
                                letterSpacing: "0.01em",
                                textShadow: activeSuggestion === i ? "0 1px 8px rgba(0,0,0,0.2)" : "none",
                                transition: "color 0.15s, text-shadow 0.15s",
                              }}
                            >
                              {h}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newHistory = searchHistory.filter((_, idx) => idx !== i);
                                saveSearchHistoryToDB(newHistory);
                                setSearchHistory(newHistory);
                              }}
                              className="ml-auto p-1 rounded-full transition-colors"
                              style={{
                                color: "rgba(255,255,255,0.2)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "rgba(255,100,100,0.7)";
                                e.currentTarget.style.background = "rgba(255,100,100,0.1)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "rgba(255,255,255,0.2)";
                                e.currentTarget.style.background = "transparent";
                              }}
                            >
                              <X size={12} strokeWidth={2} />
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                    {suggestions.map((s, i) => (
                      <button
                        key={`suggestion-${i}`}
                        className="flex items-center gap-3 w-full px-[22px] py-[11px] text-left transition-colors duration-150"
                        style={{
                          background: activeSuggestion === (matchedHistory?.length ?? 0) + i
                            ? "rgba(0,0,0,0.18)"
                            : "transparent",
                          borderBottom:
                            i < (suggestions?.length ?? 0) - 1
                              ? "1px solid rgba(255,255,255,0.05)"
                              : "none",
                        }}
                        onMouseEnter={() => setActiveSuggestion((matchedHistory?.length ?? 0) + i)}
                        onMouseLeave={(e) => {
                          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                            setActiveSuggestion(-1);
                          }
                        }}
                        onClick={() => {
                          setQuery(s);
                          handleSearch(s);
                        }}
                      >
                        <Search
                          size={13}
                          strokeWidth={1.8}
                          style={{
                            color: activeSuggestion === (matchedHistory?.length ?? 0) + i
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
                            color: activeSuggestion === (matchedHistory?.length ?? 0) + i
                              ? "rgba(255,255,255,0.95)"
                              : "rgba(255,255,255,0.58)",
                            letterSpacing: "0.01em",
                            textShadow: activeSuggestion === (matchedHistory?.length ?? 0) + i ? "0 1px 8px rgba(0,0,0,0.2)" : "none",
                            transition: "color 0.15s, text-shadow 0.15s",
                          }}
                        >
                          {truncateSuggestion(s, query)}
                        </span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2.5 mt-7 flex-wrap">
            {quickLinks.map((link, index) => (
              <a
                key={`${link.label}-${index}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-[18px] py-[9px] rounded-full transition-all duration-250 ease-out group relative"
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
                {link.iconBase64 && (
                  <img
                    src={link.iconBase64}
                    alt=""
                    className="w-[14px] h-[14px] rounded-sm opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                )}
                {!link.iconBase64 && link.iconUrl && (
                  <img
                    src={link.iconUrl}
                    alt=""
                    className="w-[14px] h-[14px] rounded-sm opacity-70 group-hover:opacity-100 transition-opacity"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                {link.label}
              </a>
            ))}
          </div>

          {showContextMenu && (
            <div
              className="fixed w-[180px] rounded-lg py-1.5 animate-in fade-in zoom-in-95 duration-150"
              style={{
                zIndex: 100,
                left: Math.max(0, Math.min(contextPosition.x, window.innerWidth - 200)),
                top: Math.max(0, Math.min(contextPosition.y, window.innerHeight - 140)),
                background: "linear-gradient(135deg, rgba(30,30,35,0.78) 0%, rgba(20,20,25,0.82) 100%)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1.5px solid rgba(255,255,255,0.15)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.stopPropagation()}
            >
              <button
                onClick={openSettings}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left transition-colors"
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.85)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,140,50,0.18)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                }}
              >
                <Settings size={14} strokeWidth={1.8} />
                快速链接设置
              </button>
              <div className="h-px mx-3.5 bg-gradient-to-r from-transparent via-rgba(255,255,255,0.12) to-transparent" />
              <button
                onClick={openAppSettings}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left transition-colors"
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.85)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,140,50,0.18)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                }}
              >
                <Settings size={14} strokeWidth={1.8} />
                应用设置
              </button>
              <div className="h-px mx-3.5 bg-gradient-to-r from-transparent via-rgba(255,255,255,0.12) to-transparent" />
              <button
                onClick={openWallpaperSettings}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left transition-colors"
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.85)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,140,50,0.18)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                }}
              >
                <Upload size={14} strokeWidth={1.8} />
                修改壁纸
              </button>
            </div>
          )}

          {showAppSettings && (
            <div
              data-app-settings-panel
              className="fixed w-[300px] rounded-xl p-5 animate-in fade-in zoom-in-95 duration-200"
              style={{
                zIndex: 100,
                left: Math.max(0, Math.min(settingsPosition.x, window.innerWidth - 320)),
                top: Math.max(20, Math.min(settingsPosition.y, window.innerHeight - 260)),
                background: "linear-gradient(135deg, rgba(30,30,35,0.80) 0%, rgba(20,20,25,0.85) 100%)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                border: "1.5px solid rgba(255,255,255,0.15)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.85)", letterSpacing: "0.03em" }}>
                  应用设置
                </span>
                <button
                  onClick={() => setShowAppSettings(false)}
                  className="p-1 rounded-full transition-colors"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>显示时钟</span>
                  <button
                    onClick={() => setShowClock(!showClock)}
                    className="w-[36px] h-[20px] rounded-full transition-all duration-200 relative"
                    style={{
                      background: showClock ? "rgba(255,140,50,0.75)" : "rgba(255,255,255,0.12)",
                    }}
                  >
                    <div
                      className="absolute top-[2px] w-[16px] h-[16px] rounded-full transition-all duration-200"
                      style={{
                        left: showClock ? "18px" : "2px",
                        background: "#ffffff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      }}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>显示秒数</span>
                  <button
                    onClick={() => setShowSeconds(!showSeconds)}
                    disabled={!showClock}
                    className="w-[36px] h-[20px] rounded-full transition-all duration-200 relative"
                    style={{
                      background: showClock && showSeconds ? "rgba(255,140,50,0.75)" : "rgba(255,255,255,0.12)",
                      opacity: showClock ? 1 : 0.4,
                      cursor: showClock ? "pointer" : "not-allowed",
                    }}
                  >
                    <div
                      className="absolute top-[2px] w-[16px] h-[16px] rounded-full transition-all duration-200"
                      style={{
                        left: showClock && showSeconds ? "18px" : "2px",
                        background: "#ffffff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      }}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>显示日期</span>
                  <button
                    onClick={() => setShowDate(!showDate)}
                    disabled={!showClock}
                    className="w-[36px] h-[20px] rounded-full transition-all duration-200 relative"
                    style={{
                      background: showClock && showDate ? "rgba(255,140,50,0.75)" : "rgba(255,255,255,0.12)",
                      opacity: showClock ? 1 : 0.4,
                      cursor: showClock ? "pointer" : "not-allowed",
                    }}
                  >
                    <div
                      className="absolute top-[2px] w-[16px] h-[16px] rounded-full transition-all duration-200"
                      style={{
                        left: showClock && showDate ? "18px" : "2px",
                        background: "#ffffff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      }}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>显示产品名称</span>
                  <button
                    onClick={() => setShowBrandName(!showBrandName)}
                    className="w-[36px] h-[20px] rounded-full transition-all duration-200 relative"
                    style={{
                      background: showBrandName ? "rgba(255,140,50,0.75)" : "rgba(255,255,255,0.12)",
                    }}
                  >
                    <div
                      className="absolute top-[2px] w-[16px] h-[16px] rounded-full transition-all duration-200"
                      style={{
                        left: showBrandName ? "18px" : "2px",
                        background: "#ffffff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      }}
                    />
                  </button>
                </label>

                <div className="border-t border-b border-white/[0.05] my-3" />

                <label className="flex items-center justify-between cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>显示搜索历史</span>
                  <button
                    onClick={() => setShowSearchHistory(!showSearchHistory)}
                    className="w-[36px] h-[20px] rounded-full transition-all duration-200 relative"
                    style={{
                      background: showSearchHistory ? "rgba(255,140,50,0.75)" : "rgba(255,255,255,0.12)",
                    }}
                  >
                    <div
                      className="absolute top-[2px] w-[16px] h-[16px] rounded-full transition-all duration-200"
                      style={{
                        left: showSearchHistory ? "18px" : "2px",
                        background: "#ffffff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      }}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>显示搜索建议</span>
                  <button
                    onClick={() => setShowSearchSuggestions(!showSearchSuggestions)}
                    className="w-[36px] h-[20px] rounded-full transition-all duration-200 relative"
                    style={{
                      background: showSearchSuggestions ? "rgba(255,140,50,0.75)" : "rgba(255,255,255,0.12)",
                    }}
                  >
                    <div
                      className="absolute top-[2px] w-[16px] h-[16px] rounded-full transition-all duration-200"
                      style={{
                        left: showSearchSuggestions ? "18px" : "2px",
                        background: "#ffffff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      }}
                    />
                  </button>
                </label>

                {showSearchHistory && (
                  <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>历史显示数量</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {[2, 3, 5, 8].map((num) => (
                        <button
                          key={num}
                          onClick={() => setSearchHistoryLimit(num)}
                          className="flex-1 py-1.5 rounded-lg text-xs transition-all duration-200"
                          style={{
                            background: searchHistoryLimit === num ? "rgba(255,140,50,0.75)" : "rgba(255,255,255,0.06)",
                            color: searchHistoryLimit === num ? "#ffffff" : "rgba(255,255,255,0.55)",
                            border: searchHistoryLimit === num ? "none" : "1px solid rgba(255,255,255,0.08)",
                            fontWeight: searchHistoryLimit === num ? 500 : 400,
                          }}
                        >
                          {num}条
                        </button>
                      ))}
                    </div>
                    {searchHistoryLimit >= 8 && (
                      <div className="mt-2 px-2 py-1.5 rounded-lg" style={{ background: "rgba(255,140,50,0.12)", border: "1px solid rgba(255,140,50,0.25)" }}>
                        <span style={{ fontSize: "11px", color: "rgba(255,160,80,0.85)" }}>
                          显示过多历史可能降低搜索体验
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {showWallpaperSettings && (
            <div
              data-wallpaper-settings-panel
              className="fixed w-[360px] rounded-xl p-5 animate-in fade-in zoom-in-95 duration-200"
              style={{
                zIndex: 100,
                left: Math.max(0, Math.min(wallpaperPosition.x, window.innerWidth - 380)),
                top: Math.max(20, Math.min(wallpaperPosition.y, window.innerHeight - 450)),
                background: "linear-gradient(135deg, rgba(30,30,35,0.80) 0%, rgba(20,20,25,0.85) 100%)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                border: "1.5px solid rgba(255,255,255,0.15)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.85)", letterSpacing: "0.03em" }}>
                  壁纸设置
                </span>
                <button
                  onClick={() => setShowWallpaperSettings(false)}
                  className="p-1 rounded-full transition-colors"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>每天自动换壁纸</span>
                  <button
                    onClick={toggleDailyWallpaper}
                    className="w-[36px] h-[20px] rounded-full transition-all duration-200 relative"
                    style={{
                      background: dailyWallpaperEnabled ? "rgba(255,140,50,0.75)" : "rgba(255,255,255,0.12)",
                    }}
                  >
                    <div
                      className="absolute top-[2px] w-[16px] h-[16px] rounded-full transition-all duration-200"
                      style={{
                        left: dailyWallpaperEnabled ? "18px" : "2px",
                        background: "#ffffff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      }}
                    />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      randomizeWallpaper();
                      setShowWallpaperSettings(false);
                    }}
                    className="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                    style={{ background: "rgba(255,140,50,0.75)", color: "#fff" }}
                  >
                    随机换一张
                  </button>
                  <button
                    onClick={() => wallpaperInputRef.current?.click()}
                    className="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                    style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.9)" }}
                  >
                    从本地选择
                  </button>
                </div>

                <input
                  ref={wallpaperInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleWallpaperFile}
                />

                <div className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="mb-2 text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.55)" }}>
                    当前壁纸库
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {WALLPAPER_POOL.slice(0, 9).map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => {
                          applyWallpaper(image, "library", { persist: true, lastDailyChange: Date.now() });
                        }}
                        className={`aspect-[16/10] rounded-lg border overflow-hidden bg-cover bg-center ${wallpaper === image ? "border-orange-400" : "border-white/10"}`}
                        style={{ backgroundImage: `url(${image})` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                  当前来源：{wallpaperSource === "local" ? "本地上传" : "内置壁纸库"}
                </div>
              </div>
            </div>
          )}

          {showSettings && (
            <div
              data-settings-panel
              className="fixed w-[360px] rounded-xl p-5 animate-in fade-in zoom-in-95 duration-200"
              style={{
                zIndex: 100,
                left: Math.max(0, Math.min(settingsPosition.x, window.innerWidth - 380)),
                top: Math.max(20, Math.min(settingsPosition.y, window.innerHeight - 550)),
                background: "linear-gradient(135deg, rgba(30,30,35,0.80) 0%, rgba(20,20,25,0.85) 100%)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                border: "1.5px solid rgba(255,255,255,0.15)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.85)", letterSpacing: "0.03em" }}>
                  快速链接设置
                </span>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 rounded-full transition-colors"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </div>

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
                    color: "rgba(255,255,255,0.95)",
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
                    color: "rgba(255,255,255,0.95)",
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => newIconInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                  >
                    <Upload size={14} strokeWidth={2} />
                    {newLinkIcon ? "更换图标" : "上传图标"}
                  </button>
                  <input
                    ref={newIconInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleNewIconUpload}
                  />
                  {newLinkIcon && (
                    <button
                      onClick={clearNewIcon}
                      className="p-2 rounded-lg transition-all"
                      style={{
                        background: "rgba(255,120,120,0.12)",
                        color: "rgba(255,120,120,0.8)",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,120,120,0.2)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,120,120,0.12)"}
                    >
                      <X size={12} strokeWidth={2} />
                    </button>
                  )}
                </div>
                {newLinkIcon && (
                  <div className="flex items-center gap-2">
                    <img
                      src={newLinkIcon}
                      alt="预览"
                      className="w-[24px] h-[24px] rounded-sm"
                    />
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>图标预览</span>
                  </div>
                )}
                <label className="flex items-center gap-2 cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={newLinkAutoFavicon}
                    onChange={(e) => setNewLinkAutoFavicon(e.target.checked)}
                    className="accent-orange-500"
                    style={{
                      width: "14px",
                      height: "14px",
                      accentColor: "rgba(255,140,50,0.8)",
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>自动获取网站图标</span>
                </label>
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
                    boxShadow: newLinkLabel.trim() && newLinkUrl.trim() ? "0 2px 12px rgba(255,120,40,0.35), inset 0 1px 0 rgba(255,255,255,0.2)" : "none",
                  }}
                >
                  <Plus size={14} strokeWidth={2.2} />
                  添加链接
                </button>
              </div>

              {quickLinks.length > 0 && (
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.15) transparent" }}>
                  {quickLinks.map((link, index) => {
                    const isEditing = editingIndex === index;
                    return (
                      <div
                        key={`${link.label}-${index}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg"
                        style={{
                          background: isEditing ? "rgba(255,140,50,0.12)" : "rgba(255,255,255,0.04)",
                          border: isEditing ? "1px solid rgba(255,140,50,0.3)" : "1px solid transparent",
                        }}
                        onClick={() => !isEditing && startEdit(index)}
                      >
                        {isEditing ? (
                          <div className="flex-1 min-w-0 mr-2 space-y-1">
                            <input
                              type="text"
                              value={editingLabel}
                              onChange={(e) => setEditingLabel(e.target.value)}
                              className="w-full px-2 py-1 rounded text-xs outline-none"
                              style={{
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,140,50,0.3)",
                                color: "#ffffff",
                                fontSize: "12px",
                              }}
                              autoFocus
                            />
                            <input
                              type="text"
                              value={editingUrl}
                              onChange={(e) => setEditingUrl(e.target.value)}
                              className="w-full px-2 py-1 rounded text-xs outline-none"
                              style={{
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,140,50,0.3)",
                                color: "#ffffff",
                                fontSize: "11px",
                              }}
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); editIconInputRef.current?.click(); }}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs transition-all"
                                style={{
                                  background: "rgba(255,255,255,0.06)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                  color: "rgba(255,255,255,0.5)",
                                }}
                              >
                                <Upload size={12} strokeWidth={2} />
                                {editingIcon ? "更换" : "上传图标"}
                              </button>
                              <input
                                ref={editIconInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleEditIconUpload}
                              />
                              {editingIcon && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); clearEditIcon(); }}
                                  className="p-1.5 rounded transition-all"
                                  style={{
                                    background: "rgba(255,120,120,0.12)",
                                    color: "rgba(255,120,120,0.8)",
                                  }}
                                >
                                  <X size={11} strokeWidth={2} />
                                </button>
                              )}
                            </div>
                            {editingIcon && (
                              <img
                                src={editingIcon}
                                alt="预览"
                                className="w-[20px] h-[20px] rounded-sm"
                              />
                            )}
                            <label className="flex items-center gap-1.5 cursor-pointer select-none mt-1" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={editingAutoFavicon}
                                onChange={(e) => setEditingAutoFavicon(e.target.checked)}
                                className="accent-orange-500"
                                style={{
                                  width: "13px",
                                  height: "13px",
                                  accentColor: "rgba(255,140,50,0.8)",
                                }}
                              />
                              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>自动获取图标</span>
                            </label>
                          </div>
                        ) : (
                          <div className="flex-1 min-w-0 mr-2">
                            <div style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.9)", marginBottom: "2px" }}>
                              {link.iconBase64 && <img src={link.iconBase64} alt="" className="w-[12px] h-[12px] inline-block mr-1.5 rounded-sm" />}
                              {!link.iconBase64 && link.iconUrl && <img src={link.iconUrl} alt="" className="w-[12px] h-[12px] inline-block mr-1.5 rounded-sm" />}
                              {link.label}
                            </div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {link.url}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          {isEditing ? (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); saveEdit(); }}
                                className="p-1.5 rounded-md transition-all"
                                style={{
                                  color: "rgba(100,200,100,0.8)",
                                  background: "rgba(100,200,100,0.12)",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "rgba(100,200,100,0.2)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "rgba(100,200,100,0.12)";
                                }}
                              >
                                <Check size={12} strokeWidth={2} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); cancelEdit(); }}
                                className="p-1.5 rounded-md transition-all"
                                style={{
                                  color: "rgba(255,120,120,0.8)",
                                  background: "rgba(255,120,120,0.12)",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "rgba(255,120,120,0.2)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "rgba(255,120,120,0.12)";
                                }}
                              >
                                <X size={12} strokeWidth={2} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); removeQuickLink(index); }}
                              className="p-1.5 rounded-md opacity-0 transition-all duration-200 hover:opacity-100"
                              style={{
                                color: "rgba(255,120,120,0.7)",
                                background: "transparent",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(255,80,80,0.18)";
                                e.currentTarget.style.color = "rgba(255,120,120,1)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "rgba(255,120,120,0.7)";
                              }}
                            >
                              <Trash2 size={12} strokeWidth={2} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
