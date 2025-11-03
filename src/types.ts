export interface SitemapPluginOptions {
  baseUrl: string;
  /**
   * Path to the application routes file relative to the project root.
   */
  routesFile: string;
  /**
   * Optional output file name placed in the build directory.
   * Defaults to `sitemap.xml`.
   */
  outputFileName?: string;
}
