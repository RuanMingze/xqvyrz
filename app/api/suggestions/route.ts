import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 5;

/** 搜狗搜索联想 API */
async function fetchSogou(q: string, signal: AbortSignal): Promise<string[]> {
  const res = await fetch(
    `https://www.sogou.com/suggtype/ajaj_json.jsp?key=${encodeURIComponent(q)}&type=web`,
    {
      signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "*/*",
        Referer: "https://www.sogou.com/",
      },
    }
  );
  // 搜狗返回格式: window.sug(["key",["结果1","结果2",...],[],{"":1}])
  const text = await res.text();
  const match = text.match(/\[\[?"[^"]*"?,\[(.*?)\]/);
  if (match) {
    try {
      // 解析 JSON 数组字符串中的每个元素
      const items: string[] = JSON.parse(`[${match[1]}]`);
      return items.filter((item) => typeof item === "string").slice(0, 8);
    } catch {
      return [];
    }
  }
  return [];
}

/** 360搜索联想 API（备用） */
async function fetch360(q: string, signal: AbortSignal): Promise<string[]> {
  const res = await fetch(
    `https://sug.so.360.cn/suggest?word=${encodeURIComponent(q)}&encodein=utf-8&encodeout=utf-8`,
    {
      signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.so.com/",
      },
    }
  );
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (data.result && Array.isArray(data.result)) {
      return data.result.map((r: { word?: string }) => r.word).filter(Boolean).slice(0, 8);
    }
  } catch {
    // 解析失败
  }
  return [];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json([]);
  }

  // 优先使用搜狗
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const suggestions = await fetchSogou(query, controller.signal);
    if (suggestions.length > 0) {
      return NextResponse.json(suggestions.slice(0, 8));
    }
  } catch {
    // 搜狗失败，尝试360
  } finally {
    clearTimeout(timeout);
  }

  // 备用：360搜索
  const controller2 = new AbortController();
  const timeout2 = setTimeout(() => controller2.abort(), 3000);

  try {
    const suggestions = await fetch360(query, controller2.signal);
    return NextResponse.json(suggestions.slice(0, 8));
  } catch {
    return NextResponse.json([]);
  } finally {
    clearTimeout(timeout2);
  }
}
