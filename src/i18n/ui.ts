export const languages = { en: 'English', es: 'Español' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'blog.latest': 'Latest writing',
    'blog.all': 'All posts →',
    'blog.allTitle': 'Blog',
    'post.alsoIn': 'Also in',
    'post.alsoInLang': 'Español',
    'post.nextIn': 'Next in',
    'post.minRead': 'min read',
    'footer.built': 'Built with Astro',
    'footer.github': 'GitHub',
    'footer.linkedin': 'LinkedIn',
    'footer.rss': 'RSS',
  },
  es: {
    'nav.blog': 'Blog',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    'blog.latest': 'Últimos posts',
    'blog.all': 'Ver todo →',
    'blog.allTitle': 'Blog',
    'post.alsoIn': 'También en',
    'post.alsoInLang': 'English',
    'post.nextIn': 'Siguiente en',
    'post.minRead': 'min de lectura',
    'footer.built': 'Hecho con Astro',
    'footer.github': 'GitHub',
    'footer.linkedin': 'LinkedIn',
    'footer.rss': 'RSS',
  },
} as const;

type UiKey = keyof (typeof ui)[typeof defaultLang];

export function t(lang: Lang) {
  return (key: UiKey) => ui[lang][key] ?? ui[defaultLang][key];
}

export const routes = {
  home: (lang: Lang) => (lang === 'es' ? '/es/' : '/'),
  blog: (lang: Lang) => (lang === 'es' ? '/es/blog/' : '/blog/'),
  about: (lang: Lang) => (lang === 'es' ? '/es/sobre-mi/' : '/about/'),
  contact: (lang: Lang) => (lang === 'es' ? '/es/contacto/' : '/contact/'),
  rss: (lang: Lang) => (lang === 'es' ? '/es/rss.xml' : '/rss.xml'),
};

// El slug de un post en la colección es "en/slug" o "es/slug" — 3 caracteres de
// prefijo de idioma (distinto de `id`, que además trae la extensión ".md").
export function postUrl(lang: Lang, entrySlug: string) {
  const slug = entrySlug.slice(3);
  return lang === 'es' ? `/es/blog/${slug}/` : `/blog/${slug}/`;
}
