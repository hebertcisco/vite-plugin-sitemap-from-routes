// eslint-disable-next-line sonarjs/slow-regex
export const normalizeBaseUrl = (baseUrl: string) => (baseUrl.endsWith('/') ? baseUrl.replace(/\/+$/, '') : baseUrl);

export const withLeadingSlash = (value: string) => (value.startsWith('/') ? value : `/${value}`);

export const shouldIncludeInSitemap = (routePath: string) =>
  routePath && routePath !== '*' && !routePath.includes(':') && !routePath.startsWith('http');

export const buildSitemapXml = (baseUrl: string, routes: string[]) => {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  const lastmod = new Date().toISOString();

  const urlEntries = routes
    .map(route => {
      const pathname = route === '/' ? '/' : withLeadingSlash(route);
      const loc = `${normalizedBase}${pathname === '/' ? '/' : pathname}`;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
};
