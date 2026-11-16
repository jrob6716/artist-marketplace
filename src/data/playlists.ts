export type Playlist = { id: string; name: string; items: string[]; mood?: string; genres?: string[]; prompt?: string };
export const playlistStorageKey = "artist-marketplace-playlists";

export function parsePlaylists(value: string | null): Playlist[] {
  try {
    const data: unknown = JSON.parse(value ?? "[]");
    if (!Array.isArray(data)) return [];
    const ids = new Set<string>();
    return data.filter((item): item is Playlist => {
      if (!item || typeof item.id !== "string" || !/^[a-zA-Z0-9-]+$/.test(item.id) || ids.has(item.id) || typeof item.name !== "string" || !item.name.trim() || !Array.isArray(item.items) || !item.items.every((slug: unknown) => typeof slug === "string")) return false;
      ids.add(item.id); return true;
    }).map(item => ({ id: item.id, name: item.name.trim().slice(0, 80), items: [...new Set(item.items)], ...(typeof item.mood === "string" ? { mood: item.mood.slice(0, 40) } : {}), ...(Array.isArray(item.genres) ? { genres: [...new Set(item.genres.filter((genre: unknown): genre is string => typeof genre === "string").map(genre => genre.slice(0, 40)))].slice(0, 12) } : {}), ...(typeof item.prompt === "string" ? { prompt: item.prompt.slice(0, 300) } : {}) }));
  } catch { return []; }
}
export function playlistName(value: string): string {
  const name = value.trim().slice(0, 80);
  if (!name) throw new Error("Give your playlist a name.");
  return name;
}
export function addPlaylistItem(playlists: Playlist[], id: string, slug: string): Playlist[] {
  return playlists.map(playlist => playlist.id === id && !playlist.items.includes(slug) ? { ...playlist, items: [...playlist.items, slug] } : playlist);
}
export function removePlaylistItem(playlists: Playlist[], id: string, slug: string): Playlist[] {
  return playlists.map(playlist => playlist.id === id ? { ...playlist, items: playlist.items.filter(item => item !== slug) } : playlist);
}
