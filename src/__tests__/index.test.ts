import path from 'path';
import type { Plugin } from 'vite';
import { DEFAULT_OUTPUT_FILENAME } from '../constants';
import { sitemapPlugin } from '../plugin';
import { buildSitemapXml, normalizeBaseUrl, shouldIncludeInSitemap, withLeadingSlash } from '../utils';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

import { promises as fs } from 'fs';

const mockedReadFile = fs.readFile as jest.MockedFunction<typeof fs.readFile>;

const fixedDate = new Date('2024-01-01T00:00:00.000Z');

const createPluginContext = () => ({
  warn: jest.fn(),
  emitFile: jest.fn(),
});

const runGenerateBundle = async (plugin: Plugin, context: ReturnType<typeof createPluginContext>) => {
  const hook = plugin.generateBundle;

  if (!hook) {
    throw new Error('generateBundle hook not found');
  }

  if (typeof hook === 'function') {
    await hook.call(context as any, undefined as any, undefined as any, false);
    return;
  }

  if ('handler' in hook) {
    await hook.handler.call(context as any, undefined as any, undefined as any, false);
    return;
  }

  throw new Error('Unsupported generateBundle hook shape.');
};

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

describe('utils', () => {
  it('normalizes base URL by removing trailing slashes', () => {
    expect(normalizeBaseUrl('https://example.com///')).toBe('https://example.com');
    expect(normalizeBaseUrl('https://example.com')).toBe('https://example.com');
  });

  it('ensures routes start with a leading slash when required', () => {
    expect(withLeadingSlash('about')).toBe('/about');
    expect(withLeadingSlash('/contact')).toBe('/contact');
  });

  it('filters out routes that should not be in the sitemap', () => {
    expect(shouldIncludeInSitemap('/about')).toBe(true);
    expect(shouldIncludeInSitemap('*')).toBe(false);
    expect(shouldIncludeInSitemap('/blog/:id')).toBe(false);
    // eslint-disable-next-line sonarjs/no-clear-text-protocols
    expect(shouldIncludeInSitemap('http://external.com')).toBe(false);
  });

  it('builds a sitemap XML using the provided routes', () => {
    jest.useFakeTimers().setSystemTime(fixedDate);

    const xml = buildSitemapXml('https://example.com/', ['/', '/about']);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<loc>https://example.com/</loc>');
    expect(xml).toContain('<loc>https://example.com/about</loc>');
    expect(xml).toContain('<lastmod>2024-01-01T00:00:00.000Z</lastmod>');
  });
});

describe('sitemapPlugin', () => {
  const options = {
    baseUrl: 'https://example.com/',
    routesFile: 'routes.tsx',
  };

  it('emits a sitemap asset when routes are found', async () => {
    jest.useFakeTimers().setSystemTime(fixedDate);

    mockedReadFile.mockResolvedValue(`
      export const routes = [
        { path: '/' },
        { path: '/about' },
        { path: '/about' },
        { path: '/blog/:id' },
        { path: '*' },
        { path: 'http://external.com' },
      ];
    `);

    const plugin = sitemapPlugin(options) as Plugin;
    const context = createPluginContext();

    expect(plugin.generateBundle).toBeDefined();
    await runGenerateBundle(plugin, context);

    expect(mockedReadFile).toHaveBeenCalledWith(path.resolve(process.cwd(), options.routesFile), 'utf-8');

    expect(context.warn).not.toHaveBeenCalled();
    expect(context.emitFile).toHaveBeenCalledTimes(1);

    const emittedAsset = (context.emitFile as jest.Mock).mock.calls[0][0];

    expect(emittedAsset).toEqual(
      expect.objectContaining({
        type: 'asset',
        fileName: DEFAULT_OUTPUT_FILENAME,
      })
    );
    expect(emittedAsset.source).toContain('<loc>https://example.com/</loc>');
    expect(emittedAsset.source).toContain('<loc>https://example.com/about</loc>');
    expect(emittedAsset.source).toContain('<lastmod>2024-01-01T00:00:00.000Z</lastmod>');
  });

  it('warns when the routes file cannot be read', async () => {
    mockedReadFile.mockRejectedValue(new Error('boom'));

    const plugin = sitemapPlugin(options) as Plugin;
    const context = createPluginContext();

    expect(plugin.generateBundle).toBeDefined();
    await runGenerateBundle(plugin, context);

    expect(context.warn).toHaveBeenCalledTimes(1);
    expect(context.warn).toHaveBeenCalledWith(expect.stringContaining('Failed to read routes file'));
    expect(context.emitFile).not.toHaveBeenCalled();
  });

  it('warns when no eligible routes are found', async () => {
    mockedReadFile.mockResolvedValue(`
      export const routes = [
        { path: '*' },
        { path: '/blog/:id' }
      ];
    `);

    const plugin = sitemapPlugin(options) as Plugin;
    const context = createPluginContext();

    expect(plugin.generateBundle).toBeDefined();
    await runGenerateBundle(plugin, context);

    expect(context.warn).toHaveBeenCalledWith('[sitemap] No routes found to include in the sitemap.');
    expect(context.emitFile).not.toHaveBeenCalled();
  });
});
