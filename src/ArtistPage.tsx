import DesignCredit from "./DesignCredit";
import ReportArtist from "./ReportArtist";
import ArtistBadge from "./ArtistBadge";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import "./ArtistPage.css";

const tracks = [
  {
    title: "A little closer to the sun",
    duration: "4:32",
    mood: "Warm synths / slow beginnings",
  },
  { title: "After the last light", duration: "5:18", mood: "The title track" },
  {
    title: "Everything in its own time",
    duration: "3:46",
    mood: "Piano / tape / breathing room",
  },
  {
    title: "Rooms we used to know",
    duration: "4:57",
    mood: "Late-night electronics",
  },
  {
    title: "Stay until the morning",
    duration: "6:02",
    mood: "One more sunrise",
  },
];
const catalog = [
  {
    name: "After the last light",
    year: "2026",
    kind: "EP",
    art: "dusk",
    caption: "The new chapter",
    price: "$8",
  },
  {
    name: "Slow bloom",
    year: "2025",
    kind: "Album",
    art: "bloom",
    caption: "Let it take its time",
    price: "$12",
  },
  {
    name: "Blue hour studies",
    year: "2024",
    kind: "EP",
    art: "night",
    caption: "Notes from the in-between",
    price: "$7",
  },
];
function Artwork({
  art = "dusk",
  className = "",
}: {
  art?: string;
  className?: string;
}) {
  return (
    <div
      className={`ms-art ${art} ${className}`}
      role="img"
      aria-label={`${art === "dusk" ? "After the last light" : art === "bloom" ? "Slow bloom" : "Blue hour studies"} abstract album artwork`}
    >
      <span className="art-topline">
        MIRA SOL{" "}
        <span>
          MS / {art === "dusk" ? "003" : art === "bloom" ? "002" : "001"}
        </span>
      </span>
      <div className="art-sun" />
      <div className="art-horizon" />
      <span className="art-title">
        {art === "dusk" ? (
          <>
            after the
            <br />
            last light.
          </>
        ) : art === "bloom" ? (
          <>
            slow
            <br />
            bloom.
          </>
        ) : (
          <>
            blue hour
            <br />
            studies.
          </>
        )}
      </span>
      <span className="art-edition">SOUND FOR THE IN-BETWEEN</span>
    </div>
  );
}
const formatTime = (time: number) =>
  `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`;

export default function ArtistPage() {
  const [following, setFollowing] = useState(
    () => localStorage.getItem("mira-follow") === "yes",
  );
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(30);
  const [volume, setVolume] = useState(0.65);
  const [product, setProduct] = useState<{
    name: string;
    price: string;
  } | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [tab, setTab] = useState("All releases");
  const [notice, setNotice] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    document.title = "Mira Sol — Artist Marketplace";
    return () => {
      document.title = "Artist Marketplace — Independent by design";
    };
  }, []);
  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
  }, [volume]);
  useEffect(() => {
    if (product) {
      dialog.current?.showModal();
      closeButton.current?.focus();
    }
  }, [product]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);
  async function play(index: number) {
    if (!audio.current) return;
    if (index === track && playing) {
      audio.current.pause();
      setPlaying(false);
      return;
    }
    if (index !== track) {
      audio.current.currentTime = 0;
      setPosition(0);
      setTrack(index);
    }
    try {
      await audio.current.play();
      setPlaying(true);
    } catch {
      setNotice("The preview could not start. Please try again.");
    }
  }
  function follow() {
    const next = !following;
    setFollowing(next);
    localStorage.setItem("mira-follow", next ? "yes" : "no");
    setNotice(
      next
        ? "Mira Sol added to your follows on this device."
        : "Mira Sol removed from your follows.",
    );
  }
  function closeProduct() {
    dialog.current?.close();
    setProduct(null);
  }
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice("Artist page link copied.");
    } catch {
      setNotice(
        "Copy the page address from your browser to share this artist.",
      );
    }
  }
  function navigateSection(event: MouseEvent<HTMLDivElement>) {
    const anchor = (event.target as HTMLElement).closest(
      'a[href^="#"]',
    ) as HTMLAnchorElement | null;
    if (!anchor || anchor.hash === "#" || anchor.hash === "#discover") return;
    const target = document.getElementById(anchor.hash.slice(1));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
  }
  return (
    <div className="artist-world" onClick={navigateSection}>
      <div className="ms-platform">
        <a
          href="#"
          className="ms-platform-brand"
          aria-label="Artist Marketplace home"
        >
          am<span>↗</span>
        </a>
        <a href="#discover" className="back-market">
          ← Back to discovery
        </a>
        <span className="platform-note">An independent artist space</span>
        <span className="concept-label">ARTIST PREVIEW</span>
      </div>
      <section className="ms-banner ms-photo-banner" aria-labelledby="ms-name">
        <img
          className="ms-hero-photo"
          src={`${import.meta.env.BASE_URL}images/mira-studio-concept.jpg`}
          alt="AI-generated concept portrait of a musician in a sunlit home studio"
          width="1536"
          height="1024"
          fetchPriority="high"
        />
        <div className="ms-photo-shade" />
        <div className="banner-grain" />
        <span className="banner-coordinates">
          LOS ANGELES, CA &nbsp; / &nbsp; 34°03′ N 118°15′ W
        </span>
        <div className="banner-copy">
          <p className="ms-kicker">Electronic soul. Human feeling.</p>
          <h1 id="ms-name">
            Mira Sol<span>®</span>
          </h1>
          <p>Music for the spaces between.</p>
        </div>
        <div className="banner-stamp">
          <span>MS</span>
          <small>
            INDEPENDENT
            <br />
            BY NATURE
          </small>
        </div>
        <span className="banner-edition">
          ARTIST PORTRAIT CONCEPT / AI-GENERATED
        </span>
      </section>
      <div className="ms-profile">
        <div className="ms-avatar ms-photo-avatar" aria-hidden="true">
          <img
            src={`${import.meta.env.BASE_URL}images/mira-studio-concept.jpg`}
            alt=""
            width="90"
            height="90"
          />
        </div>
        <div className="profile-description">
          <strong>
            Mira Sol{" "}
            <span className="artist-dot" aria-label="Independent artist">
              ✳
            </span>
          </strong>
          <ArtistBadge />
          <p>Producer, songwriter & collector of small moments.</p>
          <div className="ms-tags">
            <span>Electronic</span>
            <span>Downtempo</span>
            <span>Alternative soul</span>
          </div>
        </div>
        <div className="profile-actions">
          <ReportArtist slug="mira-sol" name="Mira Sol" />
          <button
            className={`ms-button ${following ? "is-following" : ""}`}
            onClick={follow}
            aria-pressed={following}
          >
            {following ? "✓ Following" : "+ Follow artist"}
          </button>
          <button
            className="ms-icon-button"
            aria-label="Copy artist page link"
            onClick={share}
          >
            ↗
          </button>
        </div>
      </div>
      <nav className="ms-nav" aria-label="Artist sections">
        <div>
          <a href="#music">Music</a>
          <a href="#collection">Releases</a>
          <a href="#merch">Merch</a>
          <a href="#about">About</a>
          <a href="#journal">Journal</a>
        </div>
        <span>Made independently. Shared directly.</span>
      </nav>
      <main className="ms-content">
        <section id="music" className="ms-feature">
          <div className="feature-visual">
            <Artwork />
            <div className="art-footnote">
              <span>MS003 / SELF-RELEASED</span>
              <span>2026 © MIRA SOL</span>
            </div>
            <div className="artist-note">
              <span>↳</span>
              <p>
                “Made slowly, mostly after midnight.
                <br />I hope it finds you at the right time.”
                <br />
                <strong>— Mira</strong>
              </p>
            </div>
          </div>
          <div className="feature-detail">
            <p className="ms-kicker">
              <span className="live-dot" /> The latest release / EP
            </p>
            <h2>
              After the
              <br />
              last light.
            </h2>
            <p className="release-subtitle">
              Five songs about letting go, starting over, and the quiet in
              between.
            </p>
            <div className="release-facts">
              <span>5 TRACKS</span>
              <span>24 MIN</span>
              <span>OCTOBER 23, 2026</span>
            </div>
            <div className="release-actions">
              <button className="ms-button" onClick={() => void play(0)}>
                {playing && track === 0 ? "Ⅱ Pause preview" : "▶ Play preview"}
              </button>
              <button
                className="ms-button outline"
                onClick={() =>
                  setProduct({
                    name: "After the last light · Digital EP",
                    price: "$8",
                  })
                }
              >
                Buy digital EP <span>$8 ↗</span>
              </button>
            </div>
            <p className="purchase-caption">
              Yours to keep. WAV, FLAC & MP3. Direct artist support.
            </p>
            <div className="ms-tracklist">
              {tracks.map((item, index) => (
                <button
                  key={item.title}
                  className={`ms-track ${index === track && playing ? "playing" : ""}`}
                  onClick={() => void play(index)}
                  aria-label={`${index === track && playing ? "Pause" : "Preview"} ${item.title}`}
                >
                  <span className="track-number">
                    {index === track && playing
                      ? "Ⅱ"
                      : String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="track-copy">
                    <strong>{item.title}</strong>
                    <small>{item.mood}</small>
                  </span>
                  <span className="track-duration">{item.duration}</span>
                  <span className="track-play">
                    {index === track && playing ? "Ⅱ" : "▷"}
                  </span>
                </button>
              ))}
            </div>
            <p className="demo-audio-note">
              ♪ Mockup audio: each track plays the same original 30-second
              ambient demo.
            </p>
            <details className="release-credits">
              <summary>
                Release notes & credits <span>+</span>
              </summary>
              <p>
                Written, produced, and mixed by Mira Sol. Recorded at home in
                Los Angeles. Artwork by Mira Sol. All names, credits, and
                release details are fictional for this concept.
              </p>
              <p>
                A collection of warm electronics, worn-out keys, and field
                recordings, inspired by the feeling of driving home before
                sunrise.
              </p>
            </details>
          </div>
        </section>
        <section id="collection" className="ms-section">
          <div className="ms-section-heading">
            <div>
              <p className="ms-kicker">The collection</p>
              <h2>A little more of my world.</h2>
            </div>
            <div className="ms-tabs" aria-label="Filter releases">
              {["All releases", "Albums", "EPs"].map((label) => (
                <button
                  key={label}
                  aria-pressed={tab === label}
                  onClick={() => setTab(label)}
                  className={tab === label ? "selected" : ""}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="ms-catalog">
            {catalog
              .filter(
                (item) =>
                  tab === "All releases" ||
                  (tab === "Albums"
                    ? item.kind === "Album"
                    : item.kind === "EP"),
              )
              .map((item) => (
                <button
                  className="catalog-item"
                  key={item.name}
                  onClick={() =>
                    setProduct({
                      name: `${item.name} · Digital ${item.kind}`,
                      price: item.price,
                    })
                  }
                >
                  <Artwork art={item.art} />
                  <div className="catalog-title">
                    <h3>{item.name}</h3>
                    <span>↗</span>
                  </div>
                  <p>{item.caption}</p>
                  <div className="catalog-meta">
                    <span>
                      {item.year} · {item.kind}
                    </span>
                    <span>{item.price}</span>
                  </div>
                </button>
              ))}
          </div>
        </section>
        <section id="merch" className="ms-section">
          <div className="ms-section-heading">
            <div>
              <p className="ms-kicker">Something to hold on to</p>
              <h2>Beyond the download.</h2>
            </div>
            <span className="small-note">Small runs. Made with intention.</span>
          </div>
          <div className="ms-merch-grid">
            <button
              className="merch-item"
              onClick={() =>
                setProduct({
                  name: "After the last light · Sunset vinyl",
                  price: "$28",
                })
              }
            >
              <div className="merch-art vinyl-scene">
                <div className="merch-record">
                  <span>ms</span>
                </div>
                <Artwork className="vinyl-sleeve" />
                <span className="merch-badge">
                  LIMITED EDITION / 150 COPIES
                </span>
              </div>
              <div className="catalog-title">
                <h3>After the last light — Sunset vinyl</h3>
                <span>$28</span>
              </div>
              <p>12-inch translucent amber vinyl + digital EP</p>
              <span className="merch-link">Take a closer look ↗</span>
            </button>
            <button
              className="merch-item"
              onClick={() =>
                setProduct({
                  name: "The small hours · Studio tee",
                  price: "$32",
                })
              }
            >
              <div className="merch-art shirt-scene">
                <div className="ms-shirt">
                  <span>
                    MIRA SOL
                    <small>
                      the small hours club
                      <br />
                      LOS ANGELES / 2026
                    </small>
                    <b>☼</b>
                  </span>
                </div>
                <span className="merch-badge">EVERYDAY UNIFORM</span>
              </div>
              <div className="catalog-title">
                <h3>The small hours — Studio tee</h3>
                <span>$32</span>
              </div>
              <p>Heavyweight organic cotton · Washed bone</p>
              <span className="merch-link">Take a closer look ↗</span>
            </button>
          </div>
        </section>
        <section id="about" className="ms-about">
          <div className="about-art ms-photo-story">
            <img
              src={`${import.meta.env.BASE_URL}images/mira-studio-concept.jpg`}
              alt="Fictional musician with headphones beside a keyboard, photographed in warm window light"
              width="1536"
              height="1024"
              loading="lazy"
            />
            <span>
              A LITTLE MUSIC.
              <br />A LITTLE EVERYDAY LIFE.
            </span>
            <small>AI-GENERATED CONCEPT PORTRAIT</small>
          </div>
          <div className="about-copy">
            <p className="ms-kicker">The person behind the sound</p>
            <h2>
              Hi, I’m Mira.
              <br />
              Glad you’re here.
            </h2>
            <p>
              I make music somewhere between electronic soul and the sound of a
              room at 2 a.m. A little rough around the edges. A little warmer
              than you’d expect.
            </p>
            <p>
              This is my corner of the internet. Every release starts in my
              little home studio in Los Angeles, usually with a voice memo, an
              old keyboard, and no particular plan.
            </p>
            <p>
              When you pick up a record or share a song, you’re part of what
              makes the next one possible. Thanks for listening closely.
            </p>
            <span className="ms-signature">Mira x</span>
            <div className="about-links">
              <a href="mailto:hello@example.com">Contact / demo address ↗</a>
              <button onClick={share}>Share this space ↗</button>
            </div>
          </div>
        </section>
        <section id="journal" className="ms-section ms-journal">
          <div className="ms-section-heading">
            <div>
              <p className="ms-kicker">From the studio</p>
              <h2>Notes along the way.</h2>
            </div>
            <span className="small-note">A slower kind of feed.</span>
          </div>
          <div className="journal-grid">
            <article>
              <span className="journal-date">OCT 23, 2026 / RELEASE DAY</span>
              <h3>It’s yours now.</h3>
              <p>
                After the last light is out in the world. These songs kept me
                company for the better part of a year. Today, they get to keep
                you company, too.
              </p>
              <p className="journal-signoff">
                Thank you for making room for them. ♡
              </p>
            </article>
            <article>
              <span className="journal-date">OCT 08, 2026 / PROCESS</span>
              <h3>The sounds we almost miss.</h3>
              <p>
                The opening texture on “Rooms we used to know” started as a
                recording of rain on my kitchen window. Sometimes the best
                instruments are already around us.
              </p>
              <p className="journal-signoff">
                A small reminder to keep your ears open.
              </p>
            </article>
          </div>
        </section>
        <section className="ms-newsletter">
          <div>
            <p className="ms-kicker">Letters, not noise.</p>
            <h2>Stay in my orbit.</h2>
            <p>New music, studio notes, and first dibs on the small stuff.</p>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubscribed(true);
            }}
          >
            <label htmlFor="artist-email">Your email address</label>
            <div className="email-field">
              <input
                id="artist-email"
                type="email"
                placeholder="you@somewhere.com"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setSubscribed(false);
                }}
              />
              <button type="submit" aria-label="Preview newsletter signup">
                ↗
              </button>
            </div>
            <p role="status">
              {subscribed
                ? "You’re on the mockup list! No email was sent or saved."
                : "Just the good things. Unsubscribe whenever. Demo signup."}
            </p>
          </form>
        </section>
      </main>
      <footer className="ms-footer">
        <span className="footer-mira">
          Mira Sol<span>✳</span>
        </span>
        <p>
          Made independently in Los Angeles.
          <br />
          <small>
            © 2026 Mira Sol · Fictional artist & storefront concept.
          </small>
        </p>
        <a href="#">
          A space on <strong>am↗</strong>
        </a>
      <DesignCredit /></footer>
      <div
        className="ms-player"
        role="region"
        aria-label="Music preview player"
      >
        <div className="player-song">
          <Artwork />
          <div>
            <strong>{tracks[track].title}</strong>
            <small>
              Mira Sol <span>· Demo preview</span>
            </small>
          </div>
        </div>
        <div className="player-controls">
          <button
            aria-label="Previous track preview"
            onClick={() =>
              void play((track + tracks.length - 1) % tracks.length)
            }
          >
            Ⅰ◁
          </button>
          <button
            className="main-play"
            aria-label={playing ? "Pause preview" : "Play preview"}
            onClick={() => void play(track)}
          >
            {playing ? "Ⅱ" : "▶"}
          </button>
          <button
            aria-label="Next track preview"
            onClick={() => void play((track + 1) % tracks.length)}
          >
            ▷Ⅰ
          </button>
        </div>
        <div className="player-progress">
          <span>{formatTime(position)}</span>
          <input
            aria-label="Seek audio preview"
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={position}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (audio.current) audio.current.currentTime = next;
              setPosition(next);
            }}
          />
          <span>{formatTime(duration)}</span>
        </div>
        <label className="player-volume">
          VOL
          <input
            type="range"
            aria-label="Volume"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
          />
        </label>
        <button
          className="player-buy"
          onClick={() =>
            setProduct({
              name: "After the last light · Digital EP",
              price: "$8",
            })
          }
        >
          Get the EP ↗
        </button>
      </div>
      <audio
        ref={audio}
        src={`${import.meta.env.BASE_URL}audio/ambient-preview.wav`}
        preload="metadata"
        onTimeUpdate={() => setPosition(audio.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audio.current?.duration ?? 30)}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
      <dialog
        ref={dialog}
        className="ms-product-dialog"
        aria-labelledby="product-title"
        onCancel={() => setProduct(null)}
        onClick={(event) => {
          if (event.target === dialog.current) closeProduct();
        }}
      >
        <button
          ref={closeButton}
          className="product-close"
          aria-label="Close product preview"
          onClick={closeProduct}
        >
          ✕
        </button>
        <p className="ms-kicker">A little closer to the music</p>
        {product?.name.includes("Studio tee") ? (
          <div className="merch-art shirt-scene product-merch">
            <div className="ms-shirt">
              <span>
                MIRA SOL
                <small>
                  the small hours club
                  <br />
                  LOS ANGELES / 2026
                </small>
                <b>☼</b>
              </span>
            </div>
          </div>
        ) : product?.name.includes("vinyl") ? (
          <div className="merch-art vinyl-scene product-merch">
            <div className="merch-record">
              <span>ms</span>
            </div>
            <Artwork className="vinyl-sleeve" />
          </div>
        ) : (
          <Artwork
            art={
              product?.name.startsWith("Slow bloom")
                ? "bloom"
                : product?.name.startsWith("Blue hour")
                  ? "night"
                  : "dusk"
            }
          />
        )}
        <h2 id="product-title">{product?.name}</h2>
        <strong className="product-price">{product?.price}</strong>
        <p>
          Purchased music would appear in your collection, with a download link
          delivered to your inbox. Physical items would include shipping options
          at checkout.
        </p>
        <div className="checkout-demo">
          <strong>Storefront preview</strong>
          <p>
            This is a fictional product. Checkout and payments are not
            connected, and no order will be placed.
          </p>
        </div>
        <button className="ms-button" onClick={closeProduct}>
          Keep exploring ↗
        </button>
      </dialog>
      <div className={`ms-toast ${notice ? "visible" : ""}`} role="status">
        {notice}
      </div>
    </div>
  );
}
