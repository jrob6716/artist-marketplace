import ArtistBadge from "./ArtistBadge";
import { useEffect, useState } from "react";
import LandingPage from "./LandingPage";
import ArtistPage from "./ArtistPage";
import M3ttaPage from "./M3ttaPage";
import "./App.css";
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
    type: `${artist.release.trackCount} tracks · Reference profile`,
    image: artist.artwork,
    location: artist.location,
    reference: true,
    searchText: artist.tags.join(" "),
  })),
];

function isSaved(slug: string) {
  try { return localStorage.getItem(`reference-${slug}`) === "yes"; }
  catch { return false; }
}

export default function App() {
  const [genre, setGenre] = useState("All sounds");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [route, setRoute] = useState(window.location.hash);
  useEffect(() => {
    const update = () => {
      const next = window.location.hash.startsWith("#/") || window.location.hash === "#discover";
      setRoute(window.location.hash);
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
  const isPlatform = route === "#/discover" || route === "#discover" || route === "#/collection";
  if (!isPlatform) return <LandingPage />;
  const collection = route === "#/collection";
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredReleases = releases.filter(
    (release) =>
      (!collection || isSaved(release.slug)) &&
      (genre === "All sounds" || release.genre === genre) &&
      `${release.artist} ${release.title} ${release.genre} ${release.location} ${release.searchText}`
        .toLocaleLowerCase()
        .includes(normalizedQuery),
  );
  return (
    <div className="marketplace-page platform-page">
      <aside className="platform-sidebar">
        <a className="brand" href="#" aria-label="Artist Marketplace home">am<span>↗</span></a>
        <span className="sidebar-caption">YOUR MUSIC UNIVERSE</span>
        <nav aria-label="Platform navigation">
          <a className={!collection ? "selected" : ""} href="#/discover"><span>◈</span> Discover</a>
          <a className={collection ? "selected" : ""} href="#/collection"><span>♡</span> Saved previews</a>
        </nav>
        <div className="sidebar-picks"><span className="sidebar-caption">ARTIST SPOTLIGHTS</span><a href="#/artist/m3tta">M3TTA <span>↗</span></a><a href="#/artist/mira-sol">Mira Sol <span>↗</span></a></div>
        <div className="sidebar-bottom"><p>Independent music.<br/>Individual worlds.</p><a href="#">About artist marketplace ↗</a><small>Working concept / 001</small></div>
      </aside>
      <main className="platform-main">
        <div className="platform-topbar"><span>Music / {collection ? "Your collection" : "Discover"}</span><a href="#">artist marketplace <span>↗</span></a></div>
        {!collection && <section className="platform-feature">
          <img src={`${import.meta.env.BASE_URL}images/m3tta-third-state-sculpture.jpg`} alt="Third State by M3TTA"/>
          <div className="platform-feature-copy"><p className="eyebrow">IN THE SPOTLIGHT / M3TTA</p><h1>Find your<br/>third state.</h1><p>Electronic explorations. A world between movement and stillness.</p><a className="brand-cta" href="#/artist/m3tta">Explore M3TTA <span>↗</span></a></div><span className="feature-index">01 / ARTIST CONCEPT</span>
        </section>}
        <section id="discover" className="discover">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{collection ? "Your collection" : "A little discovery goes a long way"}</p>
              <h2>{collection ? "Saved previews" : "Discover your next favorite"}</h2>
            </div>
            <p>{collection ? "Artist worlds you’ve saved on this device." : `${releases.length} artist spaces. Endless possibilities.`}</p>
          </div>
          <div className="discovery-search-row">
            <label className="discovery-search">
              <span>SEARCH THE COLLECTION</span>
              <input
                type="search"
                placeholder="Artist, release, sound, or location…"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisibleCount(12);
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
                  setVisibleCount(12);
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="releases">
            {filteredReleases.slice(0, visibleCount).map((release) => (
              <a
                className="release"
                key={release.slug}
                href={`#/artist/${release.slug}`}
                aria-label={`Explore ${release.artist} artist preview`}
              >
                <div
                  className={`cover ${release.style} ${release.image ? "image-cover" : ""}`}
                >
                  {release.image ? (
                    <img
                      src={`${import.meta.env.BASE_URL}${release.image}`}
                      alt={`${release.title} cover artwork`}
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
                <div className="release-meta">
                  <h3>{release.title}</h3>
                  <span>↗</span>
                </div>
                <p className="release-artist-name"><span>{release.artist}</span><ArtistBadge /></p>
                <small>
                  {release.genre} / {release.type}
                </small>
              </a>
            ))}
          </div>
          {filteredReleases.length === 0 && (
            <div className="discovery-empty">
              <h3>{collection && !query && genre === "All sounds" ? "Your collection starts here." : "No matches yet."}</h3>
              <p>{collection ? "Save a reference artist preview to find it here. You can also search or filter your saved previews." : "Try another name, sound, or location."}</p>
              {collection && <a className="brand-cta" href="#/discover">Discover artists ↗</a>}
              <button
                className="button light"
                onClick={() => {
                  setQuery("");
                  setGenre("All sounds");
                  setVisibleCount(12);
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
                onClick={() => setVisibleCount((count) => count + 12)}
              >
                Explore more artists{" "}
                <span>
                  + {Math.min(12, filteredReleases.length - visibleCount)}
                </span>
              </button>
            )}
          </div>
        </section>
        <footer className="platform-footer"><p>Independent by design.</p><small>2 artist concepts + {discoveryArtists.length} artist reference profiles · Preview only</small><a href="#">About us ↗</a></footer>
      </main>
    </div>
  );
}
