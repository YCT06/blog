export const CATEGORY_IDS = [
  "development",
  "digital-art",
  "language-learning",
  "life",
  "reading",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  development: "程式開發",
  "digital-art": "數位創作",
  "language-learning": "語言學習",
  life: "生活隨筆",
  reading: "閱讀心得",
};

export const TAG_IDS = [
  "astro",
  "content-architecture",
  "programming-notes",
  "drawing",
  "light-and-shadow",
  "creative-practice",
  "learning-method",
] as const;

export type TagId = (typeof TAG_IDS)[number];

export const TAG_LABELS: Record<TagId, string> = {
  astro: "Astro",
  "content-architecture": "內容架構",
  "programming-notes": "程式筆記",
  drawing: "繪圖",
  "light-and-shadow": "光影",
  "creative-practice": "創作練習",
  "learning-method": "學習方法",
};
