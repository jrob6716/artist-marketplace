import ReportArtist from "./ReportArtist";
import ArtistBadge from "./ArtistBadge";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { DiscoveryArtist } from "./data/discovery";
import { discoveryArtists } from "./data/discovery";
import "./DiscoveryArtistPage.css";

const palettes: Record<string, [string, string]> = {
  Electronic: ["#ea8664", "#3d2525"],
  Ambient: ["#a3b99e", "#293832"],
  Rock: ["#e2b77b", "#3c3025"],
  Folk: ["#d4c0a1", "#3e382c"],
  Jazz: ["#b3c7e0", "#283749"],
  "Hip-Hop": ["#c5b3e4", "#392c4b"],
  Pop: ["#e4afbf", "#4a2d3c"],
  Experimental: ["#bdc5a6", "#33382d"],
  "Spoken Word": ["#d9bd8d", "#423422"],
};
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
function displayDuration(duration: string) {
  const match = duration.match(
    /(?:P)?(?:T)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/,
  );
  if (!match || !duration) return "—";
  return `${Number(match[1] ?? 0) * 60 + Number(match[2] ?? 0)}:${String(Number(match[3] ?? 0)).padStart(2, "0")}`;
}
function releaseDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "See release details"
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
}

export default function DiscoveryArtistPage({
  artist,
}: {
  artist: DiscoveryArtist;
}) {
  const [saved, setSaved] = useState(() => {
    try {
      return localStorage.getItem(`reference-${artist.slug}`) === "yes";
    } catch {
      return false;
    }
  });
  const artistOnly = artist.release.trackCount === 0;
  const [copied, setCopied] = useState(false);
  const [accent, tone] = palettes[artist.genre] ?? palettes.Electronic;
  const related = discoveryArtists
    .filter((item) => item.slug !== artist.slug)
    .sort(
      (a, b) =>
        Number(b.genre === artist.genre) - Number(a.genre === artist.genre),
    )
    .slice(0, 4);
  useEffect(() => {
    document.title = `${artist.name} — Artist Preview`;
    return () => {
      document.title = "Artist Marketplace — Independent by design";
    };
  }, [artist.name]);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 3500);
    return () => clearTimeout(t);
  }, [copied]);
  function toggleSaved() {
    const next = !saved;
    setSaved(next);
    try {
      localStorage.setItem(`reference-${artist.slug}`, next ? "yes" : "no");
    } catch {
      /* Preference remains in memory. */
    }
  }
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <div
      className="reference-world"
      style={{ "--ref-accent": accent, "--ref-tone": tone } as CSSProperties}
    >
      <div className="ref-platform">
        <a className="ref-am" href="#">
          am↗
        </a>
        <a href="#discover">← Back to discovery</a>
        <span>DESIGN STUDY / ARTIST PROFILE</span>
      </div>
      <div className="ref-disclosure">
        Independent mockup based on public artist information. This artist has
        not joined or endorsed this marketplace.
      </div>
      <section className="ref-hero">
        <img
          className={`ref-hero-image ${artist.portrait ? "portrait" : "artwork"}`}
          src={asset(artist.portrait || artist.artwork)}
          alt=""
          width="1000"
          height="1000"
          fetchPriority="high"
        />
        <div className="ref-hero-shade" />
        <div className="ref-hero-top">
          <span>INDEPENDENT WORLDS / {artist.genre.toUpperCase()}</span>
          <span>{artist.location || "PUBLIC ARTIST REFERENCE"}</span>
        </div>
        <div className="ref-hero-copy">
          <p className="ref-label">An artist worth discovering</p>
          <h1>{artist.name}</h1>
          <p>{artist.summary}</p>
        </div>
        <span className="ref-hero-bottom">
          ARTIST MARKETPLACE / VISUAL PREVIEW
        </span>
      </section>
      <div className="ref-profile">
        <img
          src={asset(artist.portrait || artist.artwork)}
          alt={
            artist.portrait
              ? `${artist.name} profile image`
              : `${artist.release.title} release artwork`
          }
          width="80"
          height="80"
        />
        <div>
          <strong>{artist.name}</strong><ArtistBadge />
          <p>{artist.location || artist.genre}</p>
          <div className="ref-tags">
            {artist.tags.slice(0, 5).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="ref-profile-actions">
          <ReportArtist slug={artist.slug} name={artist.name} />
          <button
            className="ref-button"
            onClick={toggleSaved}
            aria-pressed={saved}
          >
            {saved ? "✓ Saved preview" : "+ Save preview"}
          </button>
          <button
            className="ref-share"
            aria-label="Copy profile preview link"
            onClick={() => void share()}
          >
            ↗
          </button>
        </div>
      </div>
      <main className="ref-main">
        <section className="ref-feature" aria-labelledby="ref-release-title">
          <div className="ref-feature-art">
            <img
              src={asset(artist.artwork)}
              alt={artistOnly ? `${artist.name} artist portrait` : `${artist.release.title} by ${artist.name} — original release artwork`}
              width="700"
              height="700"
            />
            <div className="ref-art-caption">
              <span>{artistOnly ? "ARTIST PORTRAIT" : "RELEASE ARTWORK"}</span>
              <span>{artist.genre.toUpperCase()}</span>
            </div>
          </div>
          <div className="ref-release-copy">
            <p className="ref-label">{artistOnly ? "Artist spotlight" : "Selected release"}</p>
            <h2 id="ref-release-title">{artistOnly ? artist.name : artist.release.title}</h2>
            {!artistOnly && <p className="ref-byline">by <strong>{artist.name}</strong></p>}
            {!artistOnly && <div className="ref-release-facts">
              <span>{artist.release.trackCount} TRACKS</span>
              <span>{releaseDate(artist.release.date)}</span>
            </div>}
            <p className="ref-release-intro">
              {artistOnly ? `Meet ${artist.name}. Step into another artist world and keep exploring the collection below.` : `A window into ${artist.name}’s catalog. Explore the release details below and discover the tracks behind the artwork.`}
            </p>
            <p className="ref-player-note">
              {artistOnly ? "Artist preview only. Release and track information is not included in this profile. No music is hosted or played here." : "Track listing preview only. No music is hosted or played here."}
            </p>
            {!artistOnly && <div
              className="ref-tracklist"
              role="list"
              aria-label={`${artist.release.title} track listing`}
            >
              {artist.release.tracks.map((track, index) => (
                <div
                  role="listitem"
                  className="ref-track"
                  key={`${index}-${track.title}`}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{track.title}</strong>
                  <time>{displayDuration(track.duration)}</time>
                </div>
              ))}
            </div>}
          </div>
        </section>
        <section className="ref-about">
          <div>
            <p className="ref-label">Behind the name</p>
            <h2>
              A world of
              <br />
              their own.
            </h2>
          </div>
          <div>
            <h3>{artist.name}</h3>
            <p>{artist.summary}</p>
            {artist.location && (
              <p className="ref-location">Based in {artist.location}</p>
            )}
            <div className="ref-tags">
              {artist.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </section>
        <section className="ref-related">
          <div className="ref-section-heading">
            <div>
              <p className="ref-label">Keep exploring</p>
              <h2>Another world awaits.</h2>
            </div>
            <a href="#discover">All artists ↗</a>
          </div>
          <div className="ref-related-grid">
            {related.map((item) => (
              <a key={item.slug} href={`#/artist/${item.slug}`}>
                <img
                  src={asset(item.artwork)}
                  alt={item.release.trackCount === 0 ? `${item.name} artist portrait` : `${item.release.title} cover artwork`}
                  width="300"
                  height="300"
                  loading="lazy"
                />
                <h3>
                  {item.name}
                  <span>↗</span>
                </h3>
                <ArtistBadge />
                <p>{item.release.title}</p>
                <small>{item.genre}</small>
              </a>
            ))}
          </div>
        </section>
        <aside className="ref-provenance">
          <strong>About this preview</strong>
          <p>
            This is a design mockup using public artist and release information,
            collected {releaseDate(artist.collectedAt)}. Artwork and artist imagery belong to
            their respective owners. Summaries are editorial descriptions. Save
            actions apply only to this device. No artist account, endorsement,
            audio upload, or sale is implied.
          </p>
        </aside>
      </main>
      <footer className="ref-footer">
        <a className="ref-am" href="#">
          am↗
        </a>
        <p>Independent by design.</p>
        <a href="#discover">Back to discovery ↗</a>
      </footer>
      <div role="status" className={`ref-toast ${copied ? "show" : ""}`}>
        {copied ? "Preview link copied." : ""}
      </div>
    </div>
  );
}
