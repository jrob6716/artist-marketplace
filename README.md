# Artist Marketplace

A separate, artist-centered music marketplace inspired by the direct-to-fan model of Bandcamp. **Artist Marketplace is a working name.**

## Run locally

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Use the URL printed by Vite (including `/artist-marketplace/`).

```sh
npm run lint
npm run build
npm run preview
```

## First milestone

- Responsive discovery page with genre filters.
- Sample artist space preview.
- Original CSS artwork; fictional artists and releases.
- React + TypeScript + Vite.
- GitHub Pages deployment on pushes to `main`.

This is a frontend concept. Audio, authentication, uploads, purchases, payouts, and artist customization are not implemented. No real artist claims, ownership guarantees, or commercial transactions are represented by the demo.

## Direction

Artists should have their own identity, releases, story, and direct relationship with listeners. Dirtyfreqs (https://dirtyfreqs.com) informs the visual direction: ink black, warm paper, signal orange, bold type, and editorial structure. No existing site assets or source were copied.

See [the project brief](docs/project-brief.md) for scope and next decisions.

## Hosting

GitHub Pages serves the static prototype. Future accounts, protected downloads, payments, and media uploads will require backend services. Vite's base path is configured for the `artist-marketplace` repository.
