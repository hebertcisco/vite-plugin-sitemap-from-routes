import path from 'path';
import { promises as fs } from 'fs';
import type { PluginOption } from 'vite';
import { DEFAULT_OUTPUT_FILENAME, ROUTE_PATH_REGEX } from './constants';
import { buildSitemapXml, shouldIncludeInSitemap } from './utils';
import type { SitemapPluginOptions } from './types';

export const sitemapPlugin = ({ baseUrl, routesFile, outputFileName = DEFAULT_OUTPUT_FILENAME }: SitemapPluginOptions): PluginOption => {
  const resolvedRoutesFile = path.resolve(process.cwd(), routesFile);

  return {
    name: 'vite-plugin-sitemap-from-routes',
    apply: 'build',
    async generateBundle() {
      let routesFileContent: string;

      try {
        routesFileContent = await fs.readFile(resolvedRoutesFile, 'utf-8');
      } catch (error) {
        this.warn(`[sitemap] Failed to read routes file at ${resolvedRoutesFile}: ${error}`);
        return;
      }

      const extractedRoutes = Array.from(routesFileContent.matchAll(ROUTE_PATH_REGEX))
        .map(match => match[1].trim())
        .filter(shouldIncludeInSitemap);

      const uniqueRoutes = Array.from(new Set(extractedRoutes));

      if (!uniqueRoutes.length) {
        this.warn('[sitemap] No routes found to include in the sitemap.');
        return;
      }

      const sitemapXml = buildSitemapXml(baseUrl, uniqueRoutes);

      this.emitFile({
        type: 'asset',
        fileName: outputFileName,
        source: sitemapXml,
      });
    },
  };
};
