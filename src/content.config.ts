import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { CATEGORY_IDS, TAG_IDS } from "./data/taxonomy";

const articles = defineCollection({
  loader: glob({
    base: "./src/content/articles",
    pattern: "**/*.md",
  }),

  schema: ({ image }) =>
    z.object({
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(CATEGORY_IDS),
      tags: z.array(z.enum(TAG_IDS)).default([]),

      cover: z
        .object({
          src: image(),
          alt: z.string().trim().min(1),
        })
        .optional(),
    }),
});

export const collections = { articles };
