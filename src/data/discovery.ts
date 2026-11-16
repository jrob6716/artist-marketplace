import records from "./discovery-artists.json";
export const discoveryArtists = records;
export type DiscoveryArtist = (typeof records)[number];
export const discoveryGenres = [
  "All sounds",
  "Artist spotlight",
  "Electronic",
  "Ambient",
  "Rock",
  "Folk",
  "Jazz",
  "Hip-Hop",
  "Pop",
  "Experimental",
  "Spoken Word",
];
