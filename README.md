<div align="center">
  <a href="https://vitejs.dev/">
    <img width="200" height="200" hspace="10" src="https://vitejs.dev/logo.svg" alt="vite logo" />
  </a>
  <h1>Vite Sitemap Generator</h1>
  <p>
    Plugin for <a href="https://vitejs.dev/">Vite</a> to automatically generate a sitemap.xml file for your project during the build process.
  </p>
  <img src="https://img.shields.io/node/v/vite-plugin-sitemap-from-routes" alt="node-current" />
  <img src="https://img.shields.io/npm/dependency-version/vite-plugin-sitemap-from-routes/peer/vite" alt="npm peer dependency version" />
  <img src="https://img.shields.io/bundlephobia/minzip/vite-plugin-sitemap-from-routes?label=minfied" alt="npm bundle size"/>
  <img src="https://img.shields.io/github/v/release/fatehak/vite-plugin-sitemap-from-routes" alt="GitHub release" />
  <img src="https://img.shields.io/npm/l/vite-plugin-sitemap-from-routes" alt="licence" />
</div>

A Vite plugin to generate `sitemap.xml` from your application's routes. This helps improve SEO and ensures your static site or SPA is easily discoverable by search engines.

## Features

- **Automatic Sitemap Generation**: Extracts route paths from your routes file and generates a valid `sitemap.xml` during the Vite build.
- **Customizable**: Configure the base URL, routes file location, and output file name.
- **Supports Modern Vite**: Compatible with Vite v5 and above.

## Installation

```sh
pnpm add -D vite-plugin-sitemap-from-routes
```

or

```sh
npm install --save-dev vite-plugin-sitemap-from-routes
```

## Usage

Add the plugin to your `vite.config.ts`:

```ts
import { sitemapPlugin } from 'vite-plugin-sitemap-from-routes';

export default defineConfig({
  plugins: [
    sitemapPlugin({
      baseUrl: 'https://yourdomain.com',
      routesFile: 'src/routes.ts', // Path to your routes file
      outputFileName: 'sitemap.xml', // Optional, defaults to sitemap.xml
    }),
  ],
});
```

- `baseUrl`: The base URL for your site (required).
- `routesFile`: Path to your routes file, relative to the project root (required).
- `outputFileName`: Name of the generated sitemap file (optional).

## How It Works

- The plugin reads your specified routes file and extracts all static route paths.
- It ignores dynamic routes (e.g., those with `:` or `*`).
- Generates a `sitemap.xml` in your build output directory.

## Example

Suppose your `src/routes.ts` contains:

```ts
export const routes = [
  { path: '/' },
  { path: '/about' },
  { path: '/blog' },
  { path: '/blog/:id' }, // Will be ignored
];
```

The generated `sitemap.xml` will include only `/`, `/about`, and `/blog`.

## Scripts

- `pnpm build` — Build the plugin for production.
- `pnpm test` — Run tests (ensure you have test files in `src/__tests__`).
- `pnpm lint` — Run linting and formatting checks.
- `pnpm lint:fix` — Auto-fix lint and formatting issues.
- `pnpm analyze` — Open the build stats report (after building).
- `pnpm clean` — Remove build and cache artifacts.

## Development

- Node.js version: see `.nvmrc` (currently v22.16.0)
- Package manager: [pnpm](https://pnpm.io/) (see `package.json`)
- Linting: ESLint, Prettier
- Testing: Jest
- CI: GitHub Actions for build, test, coverage, and npm publish

## Environment

- Requires Node.js >= 18.17.0
- Designed for Vite >= 5

## Contributing

Pull requests and issues are welcome! Please follow the commit message conventions (Commitizen + cz-git) and ensure all checks pass before submitting.

## License

MIT © [hebertcisco](https://github.com/hebertcisco)

---

For more details, see the [repository](https://github.com/hebertcisco/vite-plugin-sitemap-from-routes).
