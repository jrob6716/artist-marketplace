import { createContext, useContext } from "react";
import type { Playlist } from "./data/playlists";

export type PlaylistModal = { mode: "create" | "rename" | "delete" | "add" | "mood"; id?: string; slug?: string; artist?: string };
type PlaylistContext = { playlists: Playlist[]; open: (modal: PlaylistModal) => void; remove: (id: string, slug: string) => void };
const Context = createContext<PlaylistContext | null>(null);
export const PlaylistContextProvider = Context.Provider;
export function usePlaylists() {
  const context = useContext(Context);
  if (!context) throw new Error("Playlist provider is required");
  return context;
}
