import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ id, data }) => id.startsWith('es/') && !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: 'José Luis Alba · Ingeniero de datos senior',
    description: 'Decisiones reales construyendo pipelines, modelos y gobierno de datos.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/es/blog/${post.slug.slice(3)}/`,
    })),
    customData: '<language>es</language>',
  });
}
