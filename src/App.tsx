import { useEffect, useState } from "react";
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
  ...discoveryArtists.map((artist) => ({
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

export default function App() {
  const [genre, setGenre] = useState("All sounds");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [route, setRoute] = useState(window.location.hash);
  useEffect(() => {
    const update = () => {
      const next = window.location.hash.startsWith("#/artist/");
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
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredReleases = releases.filter(
    (release) =>
      (genre === "All sounds" || release.genre === genre) &&
      `${release.artist} ${release.title} ${release.genre} ${release.location} ${release.searchText}`
        .toLocaleLowerCase()
        .includes(normalizedQuery),
  );
  return (
    <div className="marketplace-page">
      <header>
        <a className="brand" href="#">
          am<span>↗</span>
          <span className="brand-name">artist marketplace</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#discover">Discover music</a>
          <a href="#artists">For artists ↗</a>
        </nav>
        <span className="prototype">Early concept / 001</span>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Independent music. Individual worlds.</p>
            <h1>
              Your music.
              <br />
              Your space.
              <br />
              <em>Your terms.</em>
            </h1>
            <div className="hero-bottom">
              <p>
                A place for artists to build their own world.
                <br />
                And for listeners to find something that stays.
              </p>
              <a className="button" href="#discover">
                Find your next favorite <span>↗</span>
              </a>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="record">
              <div className="record-label">
                am
                <br />
                <small>SIDE A / INDEPENDENT</small>
              </div>
            </div>
            <span className="art-caption">
              Made by artists.
              <br />
              Kept in motion by you.
            </span>
            <span className="art-number">33⅓</span>
          </div>
        </section>
        <div className="ticker">
          <span>ARTIST OWNED SPACES</span>
          <b>✳</b>
          <span>DIRECT CONNECTIONS</span>
          <b>✳</b>
          <span>DISCOVERY WITHOUT LIMITS</span>
          <b>✳</b>
          <span>INDEPENDENT BY DESIGN</span>
        </div>
        <section id="discover" className="discover">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The discovery desk</p>
              <h2>
                Good music.
                <br />
                New connections.
              </h2>
            </div>
            <p>
              27 artist spaces to explore.
              <br />2 artist concepts + 25 Bandcamp reference profiles.
            </p>
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
                <p>{release.artist}</p>
                <small>
                  {release.genre} / {release.type}
                </small>
              </a>
            ))}
          </div>
          {filteredReleases.length === 0 && (
            <div className="discovery-empty">
              <h3>No matches yet.</h3>
              <p>Try another name, sound, or location.</p>
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
              Bandcamp metadata and images. No affiliation, audio, or purchases.
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
        <section id="artists" className="artist-section">
          <p className="eyebrow">A home for your sound</p>
          <h2>
            More than a profile.
            <br />A world of your own.
          </h2>
          <div className="artist-bottom">
            <p>
              Your releases, your story, your visual identity.
              <br />
              We’re building a marketplace around the people who make the music.
            </p>
            <button
              className="button light"
              onClick={() => {
                window.location.hash = "/artist/mira-sol";
              }}
            >
              Explore Mira Sol ↗
            </button>
            <a className="button light" href="#/artist/m3tta">
              Explore M3TTA ↗
            </a>
          </div>
        </section>
      </main>
      <footer>
        <a className="brand" href="#">
          am↗
        </a>
        <p>Independent by design.</p>
        <small>
          Working concept · Sample artists and releases · No purchases available
        </small>
      </footer>
    </div>
  );
}
