import { useEffect, useState } from "react";
import ArtistPage from "./ArtistPage";
import M3ttaPage from "./M3ttaPage";
import "./App.css";

const releases = [
  {
    title: "Third State",
    artist: "M3TTA",
    genre: "Electronic",
    style: "m3tta",
    type: "EP · Storefront concept",
    initials: "M3",
  },
  {
    title: "After the last light",
    artist: "Mira Sol",
    genre: "Electronic",
    style: "sunset",
    type: "EP · 5 tracks",
    initials: "MS",
  },
  {
    title: "Somewhere, slowly",
    artist: "August Blue",
    genre: "Jazz",
    style: "blue",
    type: "EP · 4 tracks",
    initials: "AB",
  },
  {
    title: "Earth / echo",
    artist: "Field Assembly",
    genre: "Ambient",
    style: "earth",
    type: "Album · 7 tracks",
    initials: "FA",
  },
];

export default function App() {
  const [genre, setGenre] = useState("All sounds");
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
  if (route.startsWith("#/artist/")) return <ArtistPage />;
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
              A few sounds to get lost in.
              <br />
              Sample releases for our first chapter.
            </p>
          </div>
          <div className="filters" aria-label="Filter releases by genre">
            {["All sounds", "Electronic", "Jazz", "Ambient"].map((item) => (
              <button
                key={item}
                aria-pressed={genre === item}
                className={genre === item ? "active" : ""}
                onClick={() => setGenre(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="releases">
            {releases
              .filter(
                (release) => genre === "All sounds" || release.genre === genre,
              )
              .map((release) => (
                <button
                  className="release"
                  key={release.title}
                  onClick={() => {
                    window.location.hash =
                      release.artist === "M3TTA"
                        ? "/artist/m3tta"
                        : "/artist/mira-sol";
                  }}
                >
                  <div className={`cover ${release.style}`}>
                    <span className="cover-top">{release.artist}</span>
                    <div className="cover-shape" />
                    <span className="cover-bottom">{release.title}</span>
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
                </button>
              ))}
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
