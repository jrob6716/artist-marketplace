export type GenreStyleGroup = { genre: string; styles: { label: string; aliases: string[] }[] };
const style = (label: string, ...aliases: string[]) => ({ label, aliases: aliases.length ? aliases : [label] });
export const genreStyleGroups: GenreStyleGroup[] = [
  { genre: "Electronic", styles: [style("House"), style("Progressive House"), style("Deep House"), style("Electro House"), style("Techno"), style("Trance"), style("Synthwave"), style("Downtempo"), style("Disco"), style("Electronica")] },
  { genre: "Ambient", styles: [style("Drone"), style("Dark Ambient"), style("Berlin School"), style("Meditation"), style("Electroacoustic"), style("Minimal"), style("Field Recording", "fieldrecording", "field recording", "field recordings")] },
  { genre: "Rock", styles: [style("Indie Rock"), style("Alternative Rock"), style("Shoegaze"), style("Garage Rock"), style("Garage Punk"), style("Grunge"), style("Psychedelic Rock"), style("Art Rock"), style("Progressive Rock"), style("Post-Rock")] },
  { genre: "Folk", styles: [style("Indie Folk"), style("Alternative Folk"), style("Dark Folk"), style("Neofolk"), style("Folk Rock"), style("Singer-songwriter"), style("Country"), style("World Folk", "world music", "polish")] },
  { genre: "Pop", styles: [style("Indie Pop"), style("Alt Pop", "alt pop", "alternative pop"), style("Dream Pop", "dreampop", "dream pop"), style("Psychedelic Pop")] },
  { genre: "Jazz", styles: [style("Contemporary Jazz"), style("Modern Jazz"), style("Piano Jazz"), style("Ambient Jazz", "ambient jazz", "jazz ambient"), style("Electronic Jazz", "electronic jazz", "jazz electronica"), style("Free Improvisation")] },
  { genre: "Hip-Hop", styles: [style("Rap"), style("Alternative Hip-Hop"), style("Beat Tape"), style("Golden Era"), style("R&B", "rnb", "r b", "r&b")] },
  { genre: "Experimental", styles: [style("Avant-garde", "avant garde", "avant-garde"), style("Neoclassical", "neo classical", "neoclassical"), style("Sound Art"), style("Experimental Electronic")] },
  { genre: "Spoken Word", styles: [style("Poetry", "poetry", "poetic"), style("Conscious Spoken Word", "conscious")] },
];
export function normalizeGenreText(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
export function matchesGenreStyle(artist: { genre: string; text: string }, selection: string): boolean {
  if (genreStyleGroups.some(group => group.genre === selection)) return artist.genre === selection;
  const choice = genreStyleGroups.flatMap(group => group.styles).find(item => item.label === selection);
  if (!choice) return false;
  const text = ` ${normalizeGenreText(artist.text)} `;
  return choice.aliases.some(alias => text.includes(` ${normalizeGenreText(alias)} `));
}
