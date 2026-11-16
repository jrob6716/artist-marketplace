// Stable mock scores for the prototype; these are not streaming or audience metrics.
export function demoPopularity(slug: string): number {
  if (slug === "m3tta") return 99;
  if (slug === "mira-sol") return 98;
  let hash = 2166136261;
  for (const character of slug) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619) >>> 0;
  return 30 + (hash % 68);
}
