import { releases } from "./catalog";
import { discoveryArtists } from "./discovery";
import { matchesGenreStyle } from "./genreStyles";
import { generateGenrePlaylist } from "./moodPlaylists";

export const genrePages = [
  { id: "dance-electronic", name: "Dance & Electronic", selection: "Electronic", color: "#a5b2ff", tone: "#2a2950", image: "images/discovery/genre-artist-7164492-release.jpg", headline: "Find your frequency.", description: "From late-night house to wide-open electronic worlds. Follow the rhythm somewhere new.", styles: ["House", "Deep House", "Progressive House", "Techno", "Trance", "Downtempo", "Electronica"], mixes: [{ title: "After Hours", selection: "Electronic" }, { title: "Deep Frequency", selection: "House" }, { title: "Into the Trance", selection: "Trance" }, { title: "Soft Signals", selection: "Downtempo" }] },
  { id: "hip-hop", name: "Hip-Hop", selection: "Hip-Hop", color: "#eab38b", tone: "#493026", image: "images/discovery/genre-artist-3652822-release.jpg", headline: "Every bar. A new story.", description: "Sharp storytelling, soulful beats, and voices with something to say.", styles: ["Rap", "Alternative Hip-Hop", "Beat Tape", "Golden Era", "R&B"], mixes: [{ title: "Bars & Beyond", selection: "Hip-Hop" }, { title: "The Storytellers", selection: "Rap" }, { title: "Beat Journal", selection: "Beat Tape" }, { title: "Word on the Street", selection: "Rap" }] },
  { id: "pop", name: "Pop", selection: "Pop", color: "#edb2cf", tone: "#502d45", image: "images/discovery/paris-paloma-release.jpg", headline: "A little louder. A little brighter.", description: "Big feelings, unexpected hooks, and songs that stay with you.", styles: ["Indie Pop", "Alt Pop", "Dream Pop", "Psychedelic Pop"], mixes: [{ title: "Color Outside", selection: "Pop" }, { title: "Indie Heart", selection: "Indie Pop" }, { title: "Daydream Radio", selection: "Dream Pop" }] },
  { id: "rock-indie", name: "Rock / Indie", selection: "Rock", color: "#d5d08c", tone: "#3b3c27", image: "images/discovery/july-morning-release.jpg", headline: "Turn up the unexpected.", description: "Guitars, grit, and independent spirit. Discover the next world worth getting lost in.", styles: ["Indie Rock", "Alternative Rock", "Shoegaze", "Garage Rock", "Grunge", "Psychedelic Rock", "Art Rock"], mixes: [{ title: "Independent Current", selection: "Rock" }, { title: "Guitar Haze", selection: "Shoegaze" }, { title: "Off the Main Road", selection: "Indie Rock" }] },
  { id: "rnb-soul", name: "R&B / Soul", selection: "R&B", color: "#d3a7e0", tone: "#422846", image: "images/discovery/static-soul-release.jpg", headline: "Let a little soul in.", description: "Warm textures and soulful connections. A first glimpse of a collection that’s growing.", styles: ["R&B", "Beat Tape", "Golden Era"], mixes: [{ title: "Soul in Motion", selection: "R&B" }] },
  { id: "jazz", name: "Jazz", selection: "Jazz", color: "#9dbeda", tone: "#263e50", image: "images/discovery/simon-herody-release.jpg", headline: "Leave room for possibility.", description: "Quiet conversations, bold improvisation, and new ways to hear the world.", styles: ["Contemporary Jazz", "Modern Jazz", "Piano Jazz", "Ambient Jazz", "Electronic Jazz", "Free Improvisation"], mixes: [{ title: "Open Conversations", selection: "Jazz" }, { title: "Keys After Dark", selection: "Piano Jazz" }, { title: "New Directions", selection: "Contemporary Jazz" }] },
  { id: "ambient", name: "Ambient", selection: "Ambient", color: "#a9c6ad", tone: "#293d35", image: "images/discovery/nick-schofield-release.jpg", headline: "A little space to breathe.", description: "Slow-moving textures and small details. Find something between sound and stillness.", styles: ["Drone", "Dark Ambient", "Berlin School", "Meditation", "Electroacoustic", "Minimal", "Field Recording"], mixes: [{ title: "Quiet Architecture", selection: "Ambient" }, { title: "Sustained Worlds", selection: "Drone" }, { title: "Inner Weather", selection: "Meditation" }] },
  { id: "folk-americana", name: "Folk / Americana", selection: "Folk", color: "#d9bda0", tone: "#49392c", image: "images/discovery/the-hanging-stars-release.jpg", headline: "Stories with a little earth on them.", description: "Acoustic roots, intimate voices, and songs that carry a world inside them.", styles: ["Indie Folk", "Alternative Folk", "Dark Folk", "Folk Rock", "Singer-songwriter", "Country", "World Folk"], mixes: [{ title: "Roots & Roads", selection: "Folk" }, { title: "Stories at Sundown", selection: "Singer-songwriter" }, { title: "Modern Folkways", selection: "Indie Folk" }] },
];
export type GenrePage = (typeof genrePages)[number];
export const styleSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export function genreCatalog(selection: string) {
  return releases.filter(release => {
    const record = discoveryArtists.find(artist => artist.slug === release.slug);
    return matchesGenreStyle({ genre: release.genre, text: `${release.searchText} ${record?.summary ?? ""}` }, selection);
  });
}
export const curatedMixes = genrePages.flatMap(genre => genre.mixes.map((mix, index) => ({
  id: `${genre.id}-${styleSlug(mix.title)}`, title: mix.title, genreId: genre.id, selection: mix.selection,
  color: genre.color, tone: genre.tone,
  items: generateGenrePlaylist([mix.selection], "", 12, index).map(pick => pick.slug),
}))).filter(mix => mix.items.length);
