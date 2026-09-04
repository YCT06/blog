import { getCollection } from "astro:content";
import type { CategoryId, TagId } from "../data/taxonomy";

export async function listArticles(
  query: { category?: CategoryId; tag?: TagId } = {},
) {
  const articles = await getCollection("articles");
  const { category, tag } = query;

  const categoryArticles = category
    ? articles.filter((article) => article.data.category === category)
    : articles;

  const filteredArticles = tag
    ? categoryArticles.filter((article) => article.data.tags.includes(tag))
    : categoryArticles;

  return filteredArticles.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}
