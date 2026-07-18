import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ id, data }) => id.startsWith('en/') && !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'José Luis Alba · Senior Data Engineer',
    description: 'Real decisions building pipelines, models and data governance.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug.slice(3)}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
