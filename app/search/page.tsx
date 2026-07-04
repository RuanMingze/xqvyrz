import { redirect } from "next/navigation";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = params.q;
  const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;

  if (!query?.trim()) {
    redirect("https://www.bing.com/");
  }

  redirect(`https://www.bing.com/search?q=${encodeURIComponent(query.trim())}`);
}
