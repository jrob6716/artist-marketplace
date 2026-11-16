import DesignCredit from "./DesignCredit";
import { usePlaylists } from "./PlaylistContext";
import { PlaylistProvider, PlaylistSidebar, PlaylistLibrary, PlaylistActions, PlaylistItemButton } from "./Playlists";
import { demoPopularity } from "./data/popularity";
import ArtistBadge from "./ArtistBadge";
import { useEffect, useState } from "react";
import LandingPage from "./LandingPage";
import ArtistPage from "./ArtistPage";
import M3ttaPage from "./M3ttaPage";
import "./App.css";
import "./Playlists.css";
import DiscoveryArtistPage from "./DiscoveryArtistPage";
import { discoveryArtists, discoveryGenres } from "./data/discovery";

const releases = [
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

function isSaved(slug: string) {
  try { return localStorage.getItem(`reference-${slug}`) === "yes"; }
  catch { return false; }
}

export default function App() {
  return <PlaylistProvider><AppContent /></PlaylistProvider>;
}

function AppContent() {
  const { playlists } = usePlaylists();
  const [view, setView] = useState<"grid" | "list">(() => {
    try { return localStorage.getItem("discovery-view") === "list" ? "list" : "grid"; }
    catch { return "grid"; }
  });
  function changeView(next: "grid" | "list") {
    setView(next);
    try { localStorage.setItem("discovery-view", next); } catch { /* Preference remains active for this session. */ }
  }
  const [genre, setGenre] = useState("All sounds");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(50);
  const [route, setRoute] = useState(window.location.hash);
  useEffect(() => {
    const update = () => {
      const next = window.location.hash.startsWith("#/") || window.location.hash === "#discover";
      setRoute(window.location.hash);
      if (window.location.hash.startsWith("#/playlist")) {
        setGenre("All sounds"); setQuery(""); setVisibleCount(50);
      }
      if (next || window.location.hash === "") window.scrollTo(0, 0);
      else
        requestAnimationFrame(() =>
          document
            .getElementById(window.location.hash.slice(1))
            ?.scrollIntoView(),
        );
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  if (route === "#/artist/m3tta") return <M3ttaPage />;
  if (route === "#/artist/mira-sol") return <ArtistPage />;
  const referenceArtist = discoveryArtists.find(
    (artist) => route === `#/artist/${artist.slug}`,
  );
  if (referenceArtist)
    return (
      <DiscoveryArtistPage
        key={referenceArtist.slug}
        artist={referenceArtist}
      />
    );
  if (route.startsWith("#/artist/"))
    return (
      <div className="marketplace-page missing-profile">
        <h1>Profile not found.</h1>
        <a className="button light" href="#discover">
          Back to discovery ↗
        </a>
      </div>
    );
  const isPlatform = route === "#/discover" || route === "#discover" || route === "#/collection" || route === "#/playlists" || route.startsWith("#/playlist/");
  if (!isPlatform) return <LandingPage />;
  const collection = route === "#/collection";
  const library = route === "#/playlists";
  const playlistRoute = route.startsWith("#/playlist/");
  const playlist = playlistRoute ? playlists.find(item => `#/playlist/${item.id}` === route) : undefined;
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredReleases = releases.filter(
    (release) =>
      (!playlistRoute || Boolean(playlist?.items.includes(release.slug))) &&
      (!collection || isSaved(release.slug)) &&
      (genre === "All sounds" || release.genre === genre) &&
      `${release.artist} ${release.title} ${release.genre} ${release.location} ${release.searchText}`
        .toLocaleLowerCase()
        .includes(normalizedQuery),
  ).sort((a, b) => playlist ? playlist.items.indexOf(a.slug) - playlist.items.indexOf(b.slug) : a.rank - b.rank);
  return (
    <div className="marketplace-page platform-page">
      <aside className="platform-sidebar">
        <a className="brand" href="#" aria-label="Artist Marketplace home">am<span>↗</span></a>
        <span className="sidebar-caption">YOUR MUSIC UNIVERSE</span>
        <nav aria-label="Platform navigation">
          <a className={!collection && !library && !playlistRoute ? "selected" : ""} href="#/discover"><span>◈</span> Discover</a>
          <a className={collection ? "selected" : ""} href="#/collection"><span>♡</span> Saved previews</a>
          <a className={library || playlistRoute ? "selected" : ""} href="#/playlists"><span>♫</span> Playlists</a>
        </nav>
        <PlaylistSidebar route={route} />
        <div className="sidebar-picks"><span className="sidebar-caption">ARTIST SPOTLIGHTS</span><a href="#/artist/m3tta">M3TTA <span>↗</span></a><a href="#/artist/mira-sol">Mira Sol <span>↗</span></a></div>
        <div className="sidebar-bottom"><p>Independent music.<br/>Individual worlds.</p><a href="#">About artist marketplace ↗</a><small>Working concept / 001</small></div>
      </aside>
      <main className="platform-main">
        <div className="platform-topbar"><span>Music / {playlist?.name ?? (library || playlistRoute ? "Playlists" : collection ? "Your collection" : "Discover")}</span><a href="#">artist marketplace <span>↗</span></a></div>
        {!collection && !library && !playlistRoute && <section className="platform-feature">
          <img src={`${import.meta.env.BASE_URL}images/m3tta-third-state-sculpture.jpg`} alt="Third State by M3TTA"/>
          <div className="platform-feature-copy"><p className="eyebrow">IN THE SPOTLIGHT / M3TTA</p><h1>Find your<br/>third state.</h1><p>Electronic explorations. A world between movement and stillness.</p><a className="brand-cta" href="#/artist/m3tta">Explore M3TTA <span>↗</span></a></div><span className="feature-index">01 / ARTIST CONCEPT</span>
        </section>}
        {library ? <PlaylistLibrary /> : <section id="discover" className="discover">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{playlistRoute ? "Your playlist / local demo" : collection ? "Your collection" : "A little discovery goes a long way"}</p>
              <h2>{playlist?.name ?? (playlistRoute ? "Playlist not found" : collection ? "Saved previews" : "Discover your next favorite")}</h2>
            </div>
            <p>{playlistRoute ? "Your discoveries, all in one place." : collection ? "Artist worlds you’ve saved on this device." : `${releases.length} artist spaces. Endless possibilities.`}</p>
          </div>
          {playlist && <PlaylistActions playlist={playlist} />}
          <div className="discovery-search-row">
            <label className="discovery-search">
              <span>SEARCH THE COLLECTION</span>
              <input
                type="search"
                placeholder="Artist, release, sound, or location…"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisibleCount(50);
                }}
              />
            </label>
            <span className="discovery-result-count" role="status">
              {filteredReleases.length}{" "}
              {filteredReleases.length === 1 ? "artist" : "artists"} to explore
            </span>
          </div>
          <div className="filters" aria-label="Filter releases by genre">
            {discoveryGenres.map((item) => (
              <button
                key={item}
                aria-pressed={genre === item}
                className={genre === item ? "active" : ""}
                onClick={() => {
                  setGenre(item);
                  setVisibleCount(50);
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="discovery-display-bar">
            <div className="discovery-sort-note"><strong>{playlist ? "♫ Playlist order" : "↗ Most popular"}</strong><span>{playlist ? "Your saved mix sequence" : "Generated demo scores · highest first"}</span></div>
            <div className="discovery-view-toggle" role="group" aria-label="Artist display layout">
              <button type="button" aria-pressed={view === "grid"} onClick={() => changeView("grid")}><svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true"><path d="M1 1h5v5H1zM10 1h5v5h-5zM1 10h5v5H1zM10 10h5v5h-5z" stroke="currentColor"/></svg>Grid</button>
              <button type="button" aria-pressed={view === "list"} onClick={() => changeView("list")}><svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true"><path d="M1 3h2m3 0h9M1 8h2m3 0h9M1 13h2m3 0h9" stroke="currentColor" strokeWidth="1.5"/></svg>List</button>
            </div>
          </div>
          {view === "list" && <div className="discovery-list-heading" aria-hidden="true"><span>#</span><span>Artist / release</span><span>Demo popularity</span></div>}
          <div className={`releases${view === "list" ? " releases-list" : ""}`} data-view={view}>
            {filteredReleases.slice(0, visibleCount).map((release) => (
              <div className="release-item" key={release.slug}>
              <a
                className="release"
                data-popularity={release.popularity}
                href={`#/artist/${release.slug}`}
                aria-label={`Explore ${release.artist} artist preview`}
              >
                <span className="release-rank" aria-label={playlist ? `Playlist position ${playlist.items.indexOf(release.slug) + 1}` : `Demo popularity rank ${release.rank}`}>{String(playlist ? playlist.items.indexOf(release.slug) + 1 : release.rank).padStart(2, "0")}</span>
                <div
                  className={`cover ${release.style} ${release.image ? "image-cover" : ""}`}
                >
                  {release.image ? (
                    <img
                      src={`${import.meta.env.BASE_URL}${release.image}`}
                      alt={release.genre === "Artist spotlight" ? `${release.artist} artist portrait` : `${release.title} cover artwork`}
                      width="400"
                      height="400"
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <span className="cover-top">{release.artist}</span>
                      <div className="cover-shape" />
                      <span className="cover-bottom">{release.title}</span>
                    </>
                  )}
                  <span className="card-profile-type">
                    {release.reference ? "REFERENCE PROFILE" : "ARTIST CONCEPT"}
                  </span>
                  <span className="open">↗</span>
                </div>
                <div className="release-info">
                <div className="release-meta">
                  <h3>{release.genre === "Artist spotlight" ? release.artist : release.title}</h3>
                  <span>↗</span>
                </div>
                <p className="release-artist-name"><span>{release.genre === "Artist spotlight" ? "Artist spotlight" : release.artist}</span><ArtistBadge /></p>
                <small>
                  {release.genre} / {release.type}
                </small>
                </div>
                <div className="release-popularity" aria-label={`Demo popularity: ${release.popularity} out of 100. Generated for this mockup.`} title="Generated mock score, not real audience or streaming data.">
                  <span className="popularity-bars" aria-hidden="true">{[1, 2, 3, 4, 5].map(bar => <i key={bar} className={bar <= Math.ceil(release.popularity / 20) ? "lit" : ""} />)}</span>
                  <span><strong>{release.popularity}<small>/100</small></strong><em>DEMO</em></span>
                </div>
              </a>
              <PlaylistItemButton slug={release.slug} artist={release.artist} playlistId={playlist?.id} />
              </div>
            ))}
          </div>
          {filteredReleases.length === 0 && (
            <div className="discovery-empty">
              <h3>{playlistRoute && !query && genre === "All sounds" ? (playlist ? "Your playlist starts here." : "This playlist is no longer available.") : collection && !query && genre === "All sounds" ? "Your collection starts here." : "No matches yet."}</h3>
              <p>{playlistRoute ? "Explore Discover and use the + button to collect artist and release previews." : collection ? "Save a reference artist preview to find it here. You can also search or filter your saved previews." : "Try another name, sound, or location."}</p>
              {(collection || playlistRoute) && <a className="brand-cta" href="#/discover">Discover artists ↗</a>}
              <button
                className="button light"
                onClick={() => {
                  setQuery("");
                  setGenre("All sounds");
                  setVisibleCount(50);
                }}
              >
                Clear filters ↗
              </button>
            </div>
          )}
          <div className="discovery-bottom">
            <p>
              Reference profiles are independent design mockups using public
              artist information and images. No affiliation, audio, or purchases.
            </p>
            {visibleCount < filteredReleases.length && (
              <button
                className="button light"
                onClick={() => setVisibleCount((count) => count + 50)}
              >
                Explore more artists{" "}
                <span>
                  + {Math.min(50, filteredReleases.length - visibleCount)}
                </span>
              </button>
            )}
          </div>
        </section>}
        <footer className="platform-footer"><p>Independent by design.</p><small>2 artist concepts + {discoveryArtists.length} artist reference profiles · Preview only</small><a href="#">About us ↗</a><DesignCredit /></footer>
      </main>
    </div>
  );
}
