// Stable mock scores for the prototype; these are not streaming or audience metrics.
// Editorially placed artists get fixed demo scores so the Hip-Hop shelf feels populated.
const featuredHipHop: Record<string, number> = {
  "genre-artist-3905394": 94, // Mac Miller
  "genre-artist-3652822": 97, // J. Cole
  "genre-artist-3816041": 96, // Kendrick Lamar
  "genre-artist-7061089": 95, // JID
  "genre-artist-4953055": 93, // Isaiah Rashad
  "genre-artist-71647262": 92, // Smino
};
export function demoPopularity(slug: string): number {
  if (slug === "m3tta") return 99;
  if (slug === "mira-sol") return 98;
  if (featuredHipHop[slug] !== undefined) return featuredHipHop[slug];
  let hash = 2166136261;
  for (const character of slug) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619) >>> 0;
  return 30 + (hash % 68);
}
