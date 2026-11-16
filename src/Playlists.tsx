import MixStudio from "./MixStudio";
import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode, FormEvent } from "react";
import { addPlaylistItem, parsePlaylists, playlistName, playlistStorageKey, removePlaylistItem } from "./data/playlists";
import type { Playlist } from "./data/playlists";
import { PlaylistContextProvider, usePlaylists } from "./PlaylistContext";
import type { PlaylistModal } from "./PlaylistContext";

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try { return parsePlaylists(localStorage.getItem(playlistStorageKey)); } catch { return []; }
  });
  const [modal, setModal] = useState<PlaylistModal | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  const selected = playlists.find(item => item.id === modal?.id);
  useEffect(() => {
    if (modal && !dialog.current?.open) dialog.current?.showModal();
    else if (!modal && dialog.current?.open) dialog.current.close();
  }, [modal]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);
  function commit(next: Playlist[], message: string) {
    setPlaylists(next);
    try { localStorage.setItem(playlistStorageKey, JSON.stringify(next)); setNotice(message); }
    catch { setNotice("Changes are available this session, but this browser could not save them on the device."); }
  }
  function open(next: PlaylistModal) {
    setName(next.mode === "rename" ? playlists.find(item => item.id === next.id)?.name ?? "" : "");
    setError(""); setModal(next);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!modal) return;
    try {
      const title = playlistName(name);
      if (modal.mode === "rename" && selected) {
        commit(playlists.map(item => item.id === selected.id ? { ...item, name: title } : item), "Playlist renamed on this device.");
      } else if (modal.mode === "create") {
        const playlist: Playlist = { id: crypto.randomUUID(), name: title, items: modal.slug ? [modal.slug] : [] };
        commit([...playlists, playlist], "Playlist created on this device.");
        window.location.hash = `/playlist/${playlist.id}`;
      }
      setModal(null);
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Could not create this playlist. Please try again."); }
  }
  function add(playlist: Playlist) {
    if (!modal?.slug || playlist.items.includes(modal.slug)) return;
    commit(addPlaylistItem(playlists, playlist.id, modal.slug), `Added to ${playlist.name} on this device.`);
    setModal(null);
  }
  function saveMix(name: string, items: string[], genres: string[]) {
    const playlist: Playlist = { id: crypto.randomUUID(), name, items: [...new Set(items)], genres };
    commit([...playlists, playlist], "Mix saved to your playlists on this device.");
    window.location.hash = `/playlist/${playlist.id}`;
  }
  function remove(id: string, slug: string) { commit(removePlaylistItem(playlists, id, slug), "Preview removed from playlist."); }
  return <PlaylistContextProvider value={{ playlists, open, remove, saveMix }}>
    {children}
    <dialog className={`playlist-dialog${modal?.mode === "mood" ? " mood-dialog" : ""}`} ref={dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-note`} onCancel={event => { event.preventDefault(); setModal(null); }} onClose={() => setModal(null)}>
      {modal && <>
        <button className="playlist-close" type="button" aria-label="Close playlist dialog" onClick={() => setModal(null)}>×</button>
        <span className="playlist-eyebrow">{modal.mode === "mood" ? "✧ MIX STUDIO / YOUR SOUND, YOUR WAY" : "YOUR OWN LITTLE UNIVERSE"}</span>
        <h2 id={`${id}-title`}>{modal.mode === "mood" ? "Make it your mix." : modal.mode === "add" ? "Add to playlist" : modal.mode === "delete" ? "Delete playlist?" : modal.mode === "rename" ? "Rename playlist" : "Create a playlist"}</h2>
        <p id={`${id}-note`}>{modal.mode === "mood" ? "Mix Studio · Build by mood or genre, using local profile matching. It curates existing artist previews; it does not generate music. Saved on this device only, with no audio playback." : "Local demo · Playlist collections contain artist and release previews. Saved on this device only; no audio playback."}</p>
        {modal.mode === "mood" ? <MixStudio initialGenres={modal.genres} initialMood={modal.mood} onSave={draft => {
          const playlist: Playlist = { ...draft, id: crypto.randomUUID() };
          commit([...playlists, playlist], "Mix Studio playlist created on this device.");
          setModal(null); window.location.hash = `/playlist/${playlist.id}`;
        }} /> : modal.mode === "add" ? <>
          <p className="playlist-item-name">{modal.artist}</p>
          <div className="playlist-choices">{playlists.map(playlist => <button type="button" key={playlist.id} disabled={playlist.items.includes(modal.slug ?? "")} onClick={() => add(playlist)}><span>♫</span><span>{playlist.name}<small>{playlist.items.length} previews</small></span><span>{playlist.items.includes(modal.slug ?? "") ? "Added ✓" : "+"}</span></button>)}</div>
          {!playlists.length && <p>No playlists yet. Create your first one below.</p>}
          <button type="button" className="playlist-primary" onClick={() => open({ mode: "create", slug: modal.slug })}>+ Create new playlist</button>
        </> : modal.mode === "delete" ? <>
          <p>Remove “{selected?.name}” and its {selected?.items.length ?? 0} saved previews from your playlist library? Artist profiles will still be available in Discover.</p>
          <div className="playlist-dialog-actions"><button type="button" className="playlist-secondary" onClick={() => setModal(null)}>Cancel</button><button type="button" className="playlist-danger" onClick={() => {
            if (!selected) return;
            commit(playlists.filter(item => item.id !== selected.id), "Playlist deleted from this device.");
            if (window.location.hash === `#/playlist/${selected.id}`) window.location.hash = "/playlists";
            setModal(null);
          }}>Delete playlist</button></div>
        </> : <form onSubmit={submit}>
          <label htmlFor={`${id}-name`}>Playlist name</label>
          <input id={`${id}-name`} value={name} onChange={event => setName(event.target.value)} required maxLength={80} placeholder="Late-night discoveries" autoFocus />
          {error && <p role="alert">{error}</p>}
          <div className="playlist-dialog-actions"><button type="button" className="playlist-secondary" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="playlist-primary">{modal.mode === "rename" ? "Save name" : "Create playlist"}</button></div>
        </form>}
      </>}
    </dialog>
    <div className={`playlist-toast${notice ? " visible" : ""}`} role="status">{notice}</div>
  </PlaylistContextProvider>;
}

export function PlaylistSidebar({ route }: { route: string }) {
  const { playlists, open } = usePlaylists();
  return <section className="sidebar-playlists" aria-label="Your playlists">
    <div className="sidebar-playlist-heading"><a href="#/playlists">YOUR PLAYLISTS</a><button type="button" onClick={() => open({ mode: "create" })} aria-label="Create playlist">+</button></div>
    <button type="button" className="playlist-create" onClick={() => open({ mode: "create" })}><span>＋</span> Create playlist</button>
    <button type="button" className="playlist-create playlist-mood-create" onClick={() => open({ mode: "mood" })}><span>✧</span> Mix Studio <small>DEMO</small></button>
    <div className="sidebar-playlist-links">{playlists.map(playlist => <a key={playlist.id} href={`#/playlist/${playlist.id}`} aria-current={route === `#/playlist/${playlist.id}` ? "page" : undefined}><span>♫</span><span>{playlist.name}<small>{playlist.items.length} previews</small></span></a>)}</div>
    <p className="playlist-local-note">Saved on this device · Demo</p>
  </section>;
}
export function PlaylistLibrary() {
  const { playlists, open } = usePlaylists();
  return <section className="playlist-library">
    <div className="playlist-library-heading"><div><p className="eyebrow">Your collection / local demo</p><h1>Your playlists</h1><p>Make a little room for your next favorite. Collect artist and release previews on this device.</p></div><div className="playlist-library-buttons"><button className="playlist-primary playlist-mood-launch" type="button" onClick={() => open({ mode: "mood" })}>✧ Mix Studio <small>DEMO</small></button><button className="playlist-primary" type="button" onClick={() => open({ mode: "create" })}>+ Create playlist</button></div></div>
    {playlists.length ? <div className="playlist-library-grid">{playlists.map(playlist => <a href={`#/playlist/${playlist.id}`} key={playlist.id}><span className="playlist-tile">♫</span><h2>{playlist.name}</h2><p>{playlist.items.length} previews · {playlist.genres?.length ? `${playlist.genres.join(" + ")} mix · ` : playlist.mood ? `${playlist.mood} mood mix · ` : ""}Local demo</p></a>)}</div> : <div className="playlist-empty"><span>♫</span><h2>A collection of your own.</h2><p>Create a playlist, then use the + button on any discovery to add it.</p><button className="playlist-primary" type="button" onClick={() => open({ mode: "create" })}>Create your first playlist</button></div>}
  </section>;
}
export function PlaylistActions({ playlist }: { playlist: Playlist }) {
  const { open } = usePlaylists();
  return <div className="playlist-page-actions"><p>♫ {playlist.items.length} previews · {playlist.genres?.length ? `${playlist.genres.join(" + ")} mix · ` : playlist.mood ? `${playlist.mood} mood mix · ` : ""}Saved on this device · No audio playback{(playlist.mood || playlist.genres?.length) && <span className="playlist-mood-note">Mix Studio · Local mood and genre matching · Curated previews, no music generation</span>}</p><div><a href="#/discover">+ Add discoveries</a><button type="button" onClick={() => open({ mode: "rename", id: playlist.id })}>Rename</button><button type="button" onClick={() => open({ mode: "delete", id: playlist.id })}>Delete</button></div></div>;
}
export function PlaylistItemButton({ slug, artist, playlistId }: { slug: string; artist: string; playlistId?: string }) {
  const { open, remove } = usePlaylists();
  return <button type="button" className="playlist-item-button" aria-label={playlistId ? `Remove ${artist} from playlist` : `Add ${artist} to playlist`} title={playlistId ? "Remove from playlist" : "Add to playlist"} onClick={() => playlistId ? remove(playlistId, slug) : open({ mode: "add", slug, artist })}>{playlistId ? "−" : "+"}</button>;
}
