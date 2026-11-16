import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { releases } from "./data/catalog";
import type { CatalogRelease } from "./data/catalog";
import { curatedMixes, genreCatalog, genrePages, styleSlug } from "./data/genrePages";
import { discoveryArtists } from "./data/discovery";
import { moodPresets } from "./data/moodPlaylists";
import { usePlaylists } from "./PlaylistContext";
import { PlaylistItemButton } from "./Playlists";
import ArtistBadge from "./ArtistBadge";
import "./GenrePages.css";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path || "images/mira-studio-concept.jpg"}`;
const artistImage = (release: CatalogRelease) => discoveryArtists.find(artist => artist.slug === release.slug)?.portrait || release.image;
const title = (release: CatalogRelease) => release.title === "Artist spotlight" ? release.artist : release.title;
function Shelf({ name, more, children }: { name: string; more?: string; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  function update() {
    const element = track.current;
    if (element) setEdges({ start: element.scrollLeft <= 4, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4 });
  }
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const observer = new ResizeObserver(update); observer.observe(element); update();
    return () => observer.disconnect();
  }, []);
  function move(direction: number) {
    const element = track.current;
    if (element) element.scrollBy({ left: Math.max(200, element.clientWidth * .8) * direction, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <section className="genre-shelf" aria-label={name}><div className="genre-section-heading"><h2>{name}</h2><div><button type="button" disabled={edges.start} aria-label={`Previous ${name}`} onClick={() => move(-1)}>←</button><button type="button" disabled={edges.end} aria-label={`Next ${name}`} onClick={() => move(1)}>→</button>{more && <a href={more}>View all ↗</a>}</div></div><div className="genre-shelf-track" ref={track} onScroll={update} tabIndex={0} aria-label={`Scroll ${name}`}>{children}</div></section>;
}
function ArtistCard({ release }: { release: CatalogRelease }) {
  return <div className="genre-artist-card"><a href={`#/artist/${release.slug}`}><img src={asset(artistImage(release))} alt={`${release.artist} artist preview`} width="250" height="250" loading="lazy"/><h3>{release.artist}</h3><small>Artist preview · Demo score {release.popularity}</small></a><ArtistBadge /><PlaylistItemButton slug={release.slug} artist={release.artist} /></div>;
}
function AlbumCard({ release }: { release: CatalogRelease }) {
  return <div className="genre-album-card"><a href={`#/release/${release.slug}`}><img src={asset(release.image)} alt={`${release.title} artwork`} width="300" height="300" loading="lazy"/><h3>{title(release)}</h3><p>{release.artist}</p><small>Release preview</small></a><PlaylistItemButton slug={release.slug} artist={release.artist} /></div>;
}
function MixCard({ mix }: { mix: (typeof curatedMixes)[number] }) {
  const cover = releases.find(item => item.slug === mix.items[0]);
  return <a className="genre-mix-card" href={`#/curated/${mix.id}`}><div className="genre-mix-cover" style={{ "--genre-color": mix.color, "--genre-tone": mix.tone } as CSSProperties}><img src={asset(cover?.image ?? "")} alt="" width="300" height="300" loading="lazy"/><span>AM / SELECTS</span><strong>{mix.title}</strong><small>MOCK COLLECTION</small></div><h3>{mix.title}</h3><p>Artist Marketplace</p><small>{mix.items.length} {mix.items.length === 1 ? "preview" : "previews"} · Demo mix</small></a>;
}
function MissingGenrePage() {
  return <section className="genre-empty"><h1>That world isn’t here yet.</h1><p>Explore the genres and collections available in this mockup.</p><a href="#/explore">Back to Explore ↗</a></section>;
}
function ExplorePage() {
  const [search, setSearch] = useState("");
  const { open } = usePlaylists();
  const genres = genrePages.filter(genre => `${genre.name} ${genre.styles.join(" ")}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <div className="genre-page explore-page"><header className="genre-page-header"><div><p className="eyebrow">Follow your curiosity</p><h1>Explore</h1><p>Different sounds. New connections. Find a world that feels like you.</p></div><button type="button" className="genre-outline-button" onClick={() => open({ mode: "mood" })}>✧ Open Mix Studio</button></header>
    <Shelf name="Featured"><a className="genre-featured-card" href="#/artist/m3tta"><img src={asset("images/m3tta-third-state-sculpture.jpg")} alt="Third State by M3TTA"/><span>ARTIST SPOTLIGHT</span><h2>M3TTA</h2><p>Find your third state.</p></a><a className="genre-featured-card" href="#/genre/dance-electronic"><img src={asset(genrePages[0].image)} alt="Panic Attack release artwork"/><span>FIND YOUR FREQUENCY</span><h2>Dance & Electronic</h2><p>New releases and after-hours discoveries.</p></a><a className="genre-featured-card" href="#/genre/jazz"><img src={asset("images/discovery/simon-herody-release.jpg")} alt="Water From Mars release artwork"/><span>LISTEN DIFFERENTLY</span><h2>New directions in jazz</h2><p>Leave room for the unexpected.</p></a></Shelf>
    <section className="genre-browse" aria-labelledby="genre-browse-title"><div className="genre-section-heading"><h2 id="genre-browse-title">Genres</h2><label className="genre-hub-search"><span className="sr-only">Find a genre</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Find a genre or style…" /></label></div><div className="genre-tile-grid">{genres.map(genre => <a key={genre.id} className="genre-tile" href={`#/genre/${genre.id}`} style={{ "--genre-tone": genre.tone, "--genre-color": genre.color } as CSSProperties}><img src={asset(genre.image)} alt="" loading="lazy"/><span>{genre.name}</span><small>{genreCatalog(genre.selection).length} {genreCatalog(genre.selection).length === 1 ? "artist preview" : "artist previews"}</small><b aria-hidden="true">↗</b></a>)}</div>{!genres.length && <p className="genre-no-matches">No matching genres. Try electronic, rock, jazz, or folk.</p>}</section>
    <section className="genre-mood-section"><div className="genre-section-heading"><h2>Moods & moments</h2><span>Make it your own in Mix Studio</span></div><div className="genre-mood-grid">{moodPresets.map(mood => <button type="button" key={mood.id} onClick={() => open({ mode: "mood", mood: mood.id })}><span>{mood.icon}</span><strong>{mood.label}</strong><small>{mood.description}</small><b aria-hidden="true">↗</b></button>)}</div></section>
    <p className="genre-demo-note">A curated design mockup using public artist and release information. Selections and popularity scores are illustrative. No affiliation or playback is implied.</p>
  </div>;
}
function GenreDetail({ segments }: { segments: string[] }) {
  const { open } = usePlaylists();
  const genre = genrePages.find(item => item.id === segments[0]);
  if (!genre) return <MissingGenrePage />;
  const mode = segments[1];
  const selectedStyle = mode === "style" ? genre.styles.find(style => styleSlug(style) === segments[2]) : undefined;
  if ((mode && !["style", "artists", "releases"].includes(mode)) || (mode === "style" && !selectedStyle)) return <MissingGenrePage />;
  const selection = selectedStyle ?? genre.selection;
  const artists = genreCatalog(selection);
  const albums = [...artists].filter(item => item.title !== "Artist spotlight").sort((a, b) => {
    const date = (slug: string) => discoveryArtists.find(item => item.slug === slug)?.release.date ?? "";
    return date(b.slug).localeCompare(date(a.slug));
  });
  const mixes = curatedMixes.filter(mix => mix.genreId === genre.id);
  const tracks = artists.flatMap(artist => {
    const record = discoveryArtists.find(item => item.slug === artist.slug);
    return record?.release.tracks.slice(0, 1).map(track => ({ ...track, artist })) ?? [];
  }).slice(0, 5);
  return <div className="genre-page genre-detail" style={{ "--genre-tone": genre.tone, "--genre-color": genre.color } as CSSProperties}>
    <div className="genre-breadcrumb"><a href="#/explore">Explore</a><span>/</span><a href={`#/genre/${genre.id}`}>{genre.name}</a>{selectedStyle && <><span>/</span><span>{selectedStyle}</span></>}</div>
    <header className="genre-detail-hero"><div><p className="eyebrow">{selectedStyle ? "Go a little deeper" : "A world of sound"}</p><h1>{selectedStyle ?? genre.name}</h1><p>{genre.description}</p><button type="button" className="genre-light-button" onClick={() => open({ mode: "mood", genres: [selection] })}>✧ Build your mix</button></div><img src={asset(genre.image)} alt={`${genre.name} featured artwork`}/></header>
    <nav className="genre-style-nav" aria-label={`${genre.name} subgenres`}><a href={`#/genre/${genre.id}`} aria-current={!selectedStyle ? "page" : undefined}>All {genre.name}</a>{genre.styles.map(style => <a key={style} href={`#/genre/${genre.id}/style/${styleSlug(style)}`} aria-current={selectedStyle === style ? "page" : undefined}>{style}</a>)}</nav>
    {mode === "artists" ? <section><div className="genre-section-heading"><h2>All {genre.name} artists</h2><span>Most popular · Demo scores</span></div><div className="genre-full-grid">{artists.map(release => <ArtistCard key={release.slug} release={release}/>)}</div></section> : mode === "releases" ? <section><div className="genre-section-heading"><h2>{genre.name} releases</h2><span>{albums.length} release previews</span></div><div className="genre-full-grid">{albums.map(release => <AlbumCard key={release.slug} release={release}/>)}</div></section> : <>
      {!selectedStyle && <Shelf name="Selected playlists">{mixes.map(mix => <MixCard key={mix.id} mix={mix}/>)}</Shelf>}
      <Shelf name={selectedStyle ? `${selectedStyle} discoveries` : "Featured releases"} more={!selectedStyle ? `#/genre/${genre.id}/releases` : undefined}>{albums.slice(0, 10).map(release => <AlbumCard key={release.slug} release={release}/>)}</Shelf>
      {tracks.length > 0 && <section className="genre-track-section"><div className="genre-section-heading"><h2>Tracks to discover</h2><span>Metadata preview only</span></div><div className="genre-track-head"><span>Title / artist</span><span>Release</span><span>Time</span></div>{tracks.map((track, index) => <a className="genre-track-row" href={`#/release/${track.artist.slug}`} key={track.artist.slug}><span className="genre-track-number">{index + 1}</span><img src={asset(track.artist.image)} alt="" width="42" height="42" loading="lazy"/><span><strong>{track.title}</strong><small>{track.artist.artist}</small></span><span>{track.artist.title}</span><time>{duration(track.duration)}</time></a>)}</section>}
      <Shelf name="Popular artists" more={!selectedStyle ? `#/genre/${genre.id}/artists` : undefined}>{artists.map(release => <ArtistCard key={release.slug} release={release}/>)}</Shelf>
    </>}
    {!artists.length && <div className="genre-empty"><h2>More discoveries are on the way.</h2><p>There are no previews for this style yet. Explore another style above.</p></div>}
    <section className="genre-other-section"><div className="genre-section-heading"><h2>Keep exploring</h2><a href="#/explore">All genres ↗</a></div><div className="genre-related-links">{genrePages.filter(item => item.id !== genre.id).slice(0, 5).map(item => <a key={item.id} href={`#/genre/${item.id}`}>{item.name}<span>↗</span></a>)}</div></section>
    <p className="genre-demo-note">Mock editorial collections and generated popularity scores. Public metadata and imagery are used for this design preview. No music is hosted on this page.</p>
  </div>;
}
function duration(value: string) {
  const match = value.match(/(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  return !match || !value ? "—" : `${Number(match[1] ?? 0) * 60 + Number(match[2] ?? 0)}:${String(Number(match[3] ?? 0)).padStart(2, "0")}`;
}
function CuratedDetail({ id }: { id: string }) {
  const { saveMix } = usePlaylists();
  const mix = curatedMixes.find(item => item.id === id);
  if (!mix) return <MissingGenrePage />;
  const genre = genrePages.find(item => item.id === mix.genreId)!;
  const items = mix.items.flatMap(slug => { const release = releases.find(item => item.slug === slug); return release ? [release] : []; });
  return <div className="genre-page"><div className="genre-breadcrumb"><a href="#/explore">Explore</a><span>/</span><a href={`#/genre/${genre.id}`}>{genre.name}</a></div><header className="genre-curated-hero"><MixCard mix={mix}/><div><p className="eyebrow">Artist Marketplace / mock collection</p><h1>{mix.title}</h1><p>{items.length} artist and release previews, selected around {mix.selection.toLowerCase()}.</p><p className="genre-demo-note">A demo editorial mix, not an imported playlist. No audio playback.</p><button type="button" className="genre-light-button" onClick={() => saveMix(mix.title, mix.items, [mix.selection])}>+ Save to my playlists</button></div></header><div className="genre-section-heading"><h2>Inside this mix</h2><span>{items.length} previews</span></div><div className="genre-full-grid">{items.map(release => <AlbumCard key={release.slug} release={release}/>)}</div></div>;
}
function ReleaseDetail({ slug }: { slug: string }) {
  const { open } = usePlaylists();
  const release = releases.find(item => item.slug === slug);
  if (!release || release.title === "Artist spotlight") return <MissingGenrePage />;
  const record = discoveryArtists.find(item => item.slug === slug);
  return <div className="genre-page"><div className="genre-breadcrumb"><a href="#/explore">Explore</a><span>/</span><a href={`#/artist/${release.slug}`}>{release.artist}</a></div><header className="genre-release-hero"><img src={asset(release.image)} alt={`${release.title} release artwork`} width="450" height="450"/><div><p className="eyebrow">Release preview</p><h1>{release.title}</h1><a href={`#/artist/${release.slug}`} className="genre-release-artist">{release.artist} ↗</a><ArtistBadge/><p>{record?.release.date ? new Date(record.release.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }) : "Artist concept"} · {release.genre}</p><button type="button" className="genre-light-button" onClick={() => open({ mode: "add", slug, artist: release.artist })}>+ Add to playlist</button><p className="genre-demo-note">Metadata and artwork preview only. No audio playback or purchases.</p></div></header>{record && record.release.tracks.length > 0 ? <section><div className="genre-section-heading"><h2>Track listing</h2><span>{record.release.trackCount} tracks</span></div>{record.release.tracks.map((track, index) => <div className="genre-release-track" key={`${index}-${track.title}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{track.title}</strong><time>{duration(track.duration)}</time></div>)}</section> : <div className="genre-release-note"><h2>Explore the artist behind the release.</h2><p>A track listing is not included in this mock profile.</p><a href={`#/artist/${release.slug}`}>Visit {release.artist} ↗</a></div>}</div>;
}
export default function GenrePages({ route }: { route: string }) {
  useEffect(() => { document.title = "Explore — Artist Marketplace"; return () => { document.title = "Artist Marketplace — Independent by design"; }; }, [route]);
  if (route === "#/explore" || route === "#/genres") return <ExplorePage/>;
  if (route.startsWith("#/genre/")) return <GenreDetail segments={route.slice("#/genre/".length).split("/")}/>;
  if (route.startsWith("#/curated/")) return <CuratedDetail id={route.slice("#/curated/".length)}/>;
  if (route.startsWith("#/release/")) return <ReleaseDetail slug={route.slice("#/release/".length)}/>;
  return <MissingGenrePage/>;
}
