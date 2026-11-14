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
- M3TTA storefront at `#/artist/m3tta`, with a monochrome/red visual direction, concept releases, merchandise previews, and the real Sessions archive link.
- Full artist storefront at `#/artist/mira-sol`: release player, catalog filters, product previews, artist story, studio journal, and demo newsletter.
- Original synthesized 30-second ambient audio preview (shared across the fictional tracklist).
- Follow preference saved on this device; newsletter and checkout remain demonstrations.
- Original CSS artwork; fictional artists and releases.
- React + TypeScript + Vite.
- GitHub Pages deployment on pushes to `main`.

This is a frontend concept. Audio previews are a synthesized demo, not the fictional artist’s recordings. Authentication, uploads, purchases, payouts, and artist customization are not implemented. No real artist claims, ownership guarantees, or commercial transactions are represented by the demo.

## Direction

Artists should have their own identity, releases, story, and direct relationship with listeners. Dirtyfreqs (https://dirtyfreqs.com) informs the visual direction: ink black, warm paper, signal orange, bold type, and editorial structure. No existing site assets or source were copied.

See [the project brief](docs/project-brief.md) for scope and next decisions.

## Hosting

GitHub Pages serves the static prototype. Future accounts, protected downloads, payments, and media uploads will require backend services. Vite's base path is configured for the `artist-marketplace` repository.

## M3TTA brand reference

The founder supplied the [M3TTA Sessions #001 Amazon Music page](https://music.amazon.com/podcasts/f49790e6-2e1f-4289-a97a-8bd93219b708/episodes/9514ae60-78c3-4e12-8aa9-fbd35a195ae8/metta-sessions-m3tta-sessions-001) as a visual reference. Its series artwork is stored at `public/images/m3tta-sessions-reference.jpg`. The source image itself says Episode 002; the UI presents it as series artwork and links to the supplied #001 episode. The storefront wordmark is a typographic interpretation, not a supplied vector logo. M3TTA cover designs, releases, merchandise, and prices are proposed concepts. The artist biography is the text supplied by Jason Robinson. Preview audio is the shared synthesized demo, not a M3TTA recording.

## Artist portraits

M3TTA uses Jason Robinson’s supplied studio photograph in the banner, avatar, and biography. Mira Sol retains AI-generated concept photography of a fictional person. See [image assets and generation prompts](docs/artist-imagery.md).

## Expanded discovery collection

The marketplace includes 25 clearly labeled public Bandcamp reference profiles, plus M3TTA and Mira Sol. Search by artist, release, genre, tag, or location; filter by genre; load additional artists; and open each artist’s own preview route. Reference pages use locally stored artwork/artist images, original short summaries, release metadata, track listings, related artists, and external source links. No reference-profile music or purchases are hosted.

Bandcamp Discover itself returned an access challenge; public search-indexed artist/release pages supplied the sample instead. See the [source inventory and collection notes](docs/bandcamp-reference-profiles.md).

```sh
npm run check:discovery
```
