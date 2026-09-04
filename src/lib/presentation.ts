import type { CollectionEntry } from "astro:content";
import type { CategoryId } from "../data/taxonomy";
export type Article = CollectionEntry<"articles">;
export const categoryMarks: Record<CategoryId, string> = {
  development: "程",
  "digital-art": "畫",
  "language-learning": "語",
  life: "日",
  reading: "讀",
};
export function dateLabel(date: Date) {
  return date.toISOString().slice(0, 10);
}
export function groupByYear(articles: Article[]) {
  const years = new Map<number, Article[]>();
  for (const article of articles) {
    const year = article.data.pubDate.getUTCFullYear();
    const entries = years.get(year) ?? [];
    entries.push(article);
    years.set(year, entries);
  }
  return [...years].sort(([a], [b]) => b - a);
}
