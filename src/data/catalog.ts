import { demoPopularity } from "./popularity";
import { discoveryArtists } from "./discovery";

export const releases = [
  {
    title: "Third State",
    artist: "M3TTA",
    slug: "m3tta",
    genre: "Electronic",
    style: "m3tta",
    type: "EP · Artist concept",
    image: "images/m3tta-third-state-sculpture.jpg",
    location: "Southern California",
    reference: false,
    searchText: "electronic progressive house trance synthwave downtempo",
  },
  {
    title: "After the last light",
    artist: "Mira Sol",
    slug: "mira-sol",
    genre: "Electronic",
    style: "sunset",
    type: "EP · Artist concept",
    image: "",
    location: "Los Angeles",
    reference: false,
    searchText: "electronic soul downtempo alternative",
  },
  ...[...discoveryArtists].sort((a, b) => b.collectedAt.localeCompare(a.collectedAt)).map((artist) => ({
    title: artist.release.title,
    artist: artist.name,
    slug: artist.slug,
    genre: artist.genre,
    style: "reference",
    type: artist.release.trackCount === 0 ? "Reference profile" : `${artist.release.trackCount} tracks · Reference profile`,
    image: artist.artwork,
    location: artist.location,
    reference: true,
    searchText: artist.tags.join(" "),
  })),
].map(release => ({ ...release, popularity: demoPopularity(release.slug) }))
  .sort((a, b) => b.popularity - a.popularity || a.artist.localeCompare(b.artist))
  .map((release, index) => ({ ...release, rank: index + 1 }));

export type CatalogRelease = (typeof releases)[number];
