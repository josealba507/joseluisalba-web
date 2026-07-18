import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    eyebrow: z.enum(['Case', 'Decision', 'Governance', 'Note']),
    translationKey: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
