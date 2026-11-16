import { discoveryArtists } from "./discovery";

export const moodPresets = [
  { id: "focus", label: "Focus", icon: "◉", title: "In the flow", description: "Clear your head. Find your rhythm.", genres: { Ambient: 9, Electronic: 5, Jazz: 4 }, words: ["ambient", "minimal", "instrumental", "piano", "quiet", "space"] },
  { id: "unwind", label: "Unwind", icon: "☾", title: "A little softer", description: "Slow things down and settle in.", genres: { Ambient: 9, Folk: 5, Jazz: 3 }, words: ["calm", "relax", "soft", "gentle", "acoustic", "dream", "downtempo"] },
  { id: "energy", label: "Get moving", icon: "ϟ", title: "Turn it up", description: "A little more motion. A little more energy.", genres: { Electronic: 8, Rock: 7, "Hip-Hop": 5 }, words: ["dance", "techno", "house", "trance", "punk", "beat", "energy", "workout", "gym", "run"] },
  { id: "feelgood", label: "Feel good", icon: "☀", title: "Good things ahead", description: "Something bright for your day.", genres: { Pop: 9, Folk: 5, "Hip-Hop": 4 }, words: ["happy", "joy", "bright", "sun", "upbeat", "pop", "funk", "soul"] },
  { id: "reflect", label: "Reflect", icon: "◇", title: "Room to feel", description: "Make space for a quieter moment.", genres: { Folk: 8, Ambient: 6, "Spoken Word": 6, Experimental: 4 }, words: ["reflect", "sad", "melancholy", "intimate", "poetry", "memory", "folk", "story"] },
  { id: "night", label: "Night drive", icon: "↗", title: "After hours", description: "City lights and somewhere to go.", genres: { Electronic: 9, Ambient: 5, "Hip-Hop": 4 }, words: ["night", "drive", "synth", "electronic", "downtempo", "cinematic", "atmosphere"] },
] as const;
export type MoodId = (typeof moodPresets)[number]["id"];
export type MoodPick = { slug: string; name: string; image: string; genre: string; reason: string };
const catalog = [
  { slug: "m3tta", name: "M3TTA", genre: "Electronic", image: "images/m3tta-third-state-sculpture.jpg", text: "progressive house trance synthwave downtempo electronic movement" },
  { slug: "mira-sol", name: "Mira Sol", genre: "Electronic", image: "images/mira-studio-concept.jpg", text: "electronic soul downtempo alternative intimate" },
  ...discoveryArtists.filter(artist => artist.genre !== "Artist spotlight").map(artist => ({ slug: artist.slug, name: artist.name, genre: artist.genre, image: artist.artwork, text: `${artist.tags.join(" ")} ${artist.summary} ${artist.release.title}` })),
];
const ignored = new Set(["a", "an", "the", "and", "or", "for", "my", "me", "i", "to", "with", "some", "something", "music", "playlist", "please", "make", "create", "want", "that", "is", "of", "in", "no", "not", "without", "avoid"]);
function tieBreak(slug: string, variation: number) {
  let value = 2166136261 ^ Math.imul(variation + 1, 2654435761);
  for (const char of slug) value = Math.imul(value ^ char.charCodeAt(0), 16777619);
  return value >>> 0;
}
export function generateMoodPlaylist(mood: MoodId, prompt: string, count = 10, variation = 0): MoodPick[] {
  const preset = moodPresets.find(item => item.id === mood);
  if (!preset) return [];
  const input = prompt.toLowerCase();
  const exclude = [...input.matchAll(/\b(?:no|not|without|avoid)\s+([a-z]+(?:-hop)?)/g)].map(match => match[1]);
  const tokens = [...new Set(input.split(/[^a-z0-9-]+/).filter(token => token.length > 2 && !ignored.has(token) && !exclude.includes(token)))];
  return catalog.map(artist => {
    const text = `${artist.genre} ${artist.name} ${artist.text}`.toLowerCase();
    const excluded = exclude.some(word => text.includes(word));
    const promptMatches = tokens.filter(token => text.includes(token));
    const weights: Partial<Record<string, number>> = preset.genres;
    const genreWeight = weights[artist.genre] ?? 0;
    const moodMatches = preset.words.filter(word => text.includes(word));
    const score = excluded ? 0 : genreWeight * 3 + moodMatches.length * 2 + promptMatches.length * 15;
    return { ...artist, score, tie: tieBreak(artist.slug, variation), reason: promptMatches.length ? `Matches “${promptMatches[0]}” in profile details` : `${artist.genre} profile matches the ${preset.label.toLowerCase()} mood` };
  }).filter(artist => artist.score > 0)
    .sort((a, b) => Math.floor(b.score / 10) - Math.floor(a.score / 10) || b.tie - a.tie)
    .slice(0, Math.min(20, Math.max(1, Math.floor(count) || 10)))
    .map(({ slug, name, image, genre, reason }) => ({ slug, name, image, genre, reason }));
}

export const mixGenres = [...new Set(catalog.map(artist => artist.genre))].sort();
export function generateGenrePlaylist(genres: string[], prompt: string, count = 10, variation = 0): MoodPick[] {
  const selected = [...new Set(genres)].filter(genre => mixGenres.includes(genre));
  if (!selected.length) return [];
  const input = prompt.toLowerCase();
  const excluded = [...input.matchAll(/\b(?:no|not|without|avoid)\s+([a-z]+(?:-hop)?)/g)].map(match => match[1]);
  const tokens = [...new Set(input.split(/[^a-z0-9-]+/).filter(token => token.length > 2 && !ignored.has(token) && !excluded.includes(token)))];
  const buckets = selected.map(genre => catalog.filter(artist => {
    const text = `${artist.genre} ${artist.name} ${artist.text}`.toLowerCase();
    return artist.genre === genre && !excluded.some(word => text.includes(word));
  }).map(artist => {
    const text = `${artist.genre} ${artist.name} ${artist.text}`.toLowerCase();
    const matches = tokens.filter(token => text.includes(token));
    return { ...artist, score: matches.length, tie: tieBreak(artist.slug, variation), reason: matches.length ? `${genre} · matches “${matches[0]}”` : `From your ${genre.toLowerCase()} selection` };
  }).sort((a, b) => b.score - a.score || b.tie - a.tie));
  const picks: MoodPick[] = [];
  const limit = Math.min(20, Math.max(1, Math.floor(count) || 10));
  // Alternate between genres so each selected genre gets space in the mix.
  for (let index = 0; picks.length < limit && buckets.some(bucket => bucket.length > index); index++) {
    for (const bucket of buckets) {
      const artist = bucket[index];
      if (artist && picks.length < limit) {
        const { slug, name, image, genre, reason } = artist;
        picks.push({ slug, name, image, genre, reason });
      }
    }
  }
  return picks;
}
