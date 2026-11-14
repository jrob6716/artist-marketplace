import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import "./M3ttaPage.css";

const tracks = [
  { title: "Arrival", length: "4:12", tag: "INTRO / ATMOSPHERE" },
  { title: "Third State", length: "5:38", tag: "FOCUS TRACK" },
  { title: "Inner Current", length: "4:46", tag: "DEEP / PERCUSSIVE" },
  { title: "No Separation", length: "6:05", tag: "LATE NIGHT" },
  { title: "Body / Mind", length: "5:21", tag: "RHYTHM / RELEASE" },
  { title: "Return to Source", length: "3:58", tag: "OUTRO / STILLNESS" },
];
const releases = [
  {
    title: "Third State",
    type: "EP",
    art: "orbital",
    index: "001",
    price: "$9",
    note: "Six movements. One continuous feeling.",
  },
  {
    title: "Inner Current",
    type: "Single",
    art: "current",
    index: "002",
    price: "$2",
    note: "A signal from somewhere deeper.",
  },
  {
    title: "No Separation",
    type: "Single",
    art: "portal",
    index: "003",
    price: "$2",
    note: "Where the edges fall away.",
  },
];
type Product = {
  title: string;
  price: string;
  art?: string;
  kind?: "shirt" | "record";
};
function Cover({
  variant = "orbital",
  small = false,
}: {
  variant?: string;
  small?: boolean;
}) {
  return (
    <div
      className={`mt-cover ${variant} ${small ? "small" : ""}`}
      role="img"
      aria-label={`Concept cover art for ${variant === "orbital" ? "Third State" : variant === "current" ? "Inner Current" : "No Separation"}`}
    >
      <span className="mt-cover-brand">
        M3TTA
        <span>
          CONCEPT /{" "}
          {variant === "orbital"
            ? "001"
            : variant === "current"
              ? "002"
              : "003"}
        </span>
      </span>
      <div className="mt-cover-object">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="mt-cover-bottom">
        <strong>
          {variant === "orbital" ? (
            <>
              THIRD
              <br />
              STATE
            </>
          ) : variant === "current" ? (
            <>
              INNER
              <br />
              CURRENT
            </>
          ) : (
            <>
              NO
              <br />
              SEPARATION
            </>
          )}
        </strong>
        <span>
          SOUND / ENERGY / CONNECTION
          <br />
          INDEPENDENT RELEASE CONCEPT
        </span>
      </div>
    </div>
  );
}
function Shirt() {
  return (
    <img
      className="mt-tee-photo"
      width="1448"
      height="1086"
      src={`${import.meta.env.BASE_URL}images/m3tta-frequency-tee.jpg`}
      alt="Realistic concept mockup of a washed-black heavyweight tee with a white M3TTA chest print and small red accent"
      loading="lazy"
    />
  );
}

const time = (value: number) =>
  `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;

export default function M3ttaPage() {
  const [following, setFollowing] = useState(
    () => localStorage.getItem("m3tta-follow") === "yes",
  );
  const [active, setActive] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(30);
  const [filter, setFilter] = useState("All releases");
  const [product, setProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [notice, setNotice] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    document.title = "M3TTA — Artist Marketplace";
    return () => {
      document.title = "Artist Marketplace — Independent by design";
    };
  }, []);
  useEffect(() => {
    if (product) dialog.current?.showModal();
  }, [product]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  async function play(index: number) {
    if (!audio.current) return;
    if (index === active && playing) {
      audio.current.pause();
      return;
    }
    if (index !== active) {
      audio.current.currentTime = 0;
      setActive(index);
      setProgress(0);
    }
    try {
      await audio.current.play();
    } catch {
      setNotice("Preview could not start. Please try again.");
    }
  }
  function follow() {
    const next = !following;
    setFollowing(next);
    localStorage.setItem("m3tta-follow", next ? "yes" : "no");
    setNotice(
      next
        ? "Following M3TTA on this device."
        : "M3TTA removed from your follows.",
    );
  }
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice("M3TTA artist link copied.");
    } catch {
      setNotice(
        "Share M3TTA by copying this page’s address from your browser.",
      );
    }
  }
  function navigate(event: MouseEvent<HTMLDivElement>) {
    const anchor = (event.target as HTMLElement).closest(
      'a[href^="#mt-"]',
    ) as HTMLAnchorElement | null;
    if (!anchor) return;
    event.preventDefault();
    document.getElementById(anchor.hash.slice(1))?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  function close() {
    dialog.current?.close();
    setProduct(null);
  }
  return (
    <div className="m3tta-world" onClick={navigate}>
      <div className="mt-platform">
        <a className="mt-am" href="#" aria-label="Artist Marketplace home">
          am↗
        </a>
        <a href="#discover">← Discovery</a>
        <a href="#/artist/mira-sol" className="mt-other">
          Mira Sol mockup ↗
        </a>
        <span>ARTIST SPACE / 002</span>
      </div>
      <section className="mt-hero mt-photo-hero">
        <img
          className="mt-hero-photo"
          src={`${import.meta.env.BASE_URL}images/m3tta-studio-concept.jpg`}
          alt="AI-generated concept photo of an electronic musician listening in a recording studio"
          width="1536"
          height="1024"
          fetchPriority="high"
        />
        <div className="mt-photo-shade" />
        <div className="mt-hero-grid" />
        <div className="mt-hero-orbit" aria-hidden="true">
          <div />
          <div />
          <div />
          <span />
        </div>
        <div className="mt-hero-top">
          <span>
            <i /> INDEPENDENT FREQUENCY
          </span>
          <span>EXPERIENCE / M3TTA</span>
        </div>
        <div className="mt-hero-type">
          <p>SOUND. ENERGY. CONNECTION.</p>
          <h1>
            M3TTA<span aria-hidden="true">✳</span>
          </h1>
          <div className="mt-hero-bottom">
            <p>
              Sound is a<br />
              <em>state of being.</em>
            </p>
            <a href="#mt-music">
              ENTER THE FREQUENCY <span>↓</span>
            </a>
          </div>
        </div>
        <span className="mt-hero-caption">
          M3TTA / STUDIO PORTRAIT CONCEPT · AI-GENERATED
        </span>
      </section>
      <div className="mt-identity">
        <div className="mt-monogram mt-photo-avatar" aria-hidden="true">
          <img
            src={`${import.meta.env.BASE_URL}images/m3tta-studio-concept.jpg`}
            alt=""
            width="65"
            height="65"
          />
        </div>
        <div>
          <strong>
            M3TTA <span>✳</span>
          </strong>
          <p>Jason Robinson · Producer, composer & programmer.</p>
          <div className="mt-tags">
            <span>PROGRESSIVE HOUSE</span>
            <span>TRANCE</span>
            <span>SYNTHWAVE</span>
            <span>TECHNO</span>
          </div>
        </div>
        <div className="mt-identity-actions">
          <button
            className="mt-button"
            onClick={follow}
            aria-pressed={following}
          >
            {following ? "✓ FOLLOWING" : "+ FOLLOW M3TTA"}
          </button>
          <button
            className="mt-share"
            aria-label="Copy M3TTA artist link"
            onClick={share}
          >
            ↗
          </button>
        </div>
      </div>
      <nav className="mt-nav" aria-label="M3TTA sections">
        <div>
          <a href="#mt-music">01 / MUSIC</a>
          <a href="#mt-releases">02 / RELEASES</a>
          <a href="#mt-sessions">03 / SESSIONS</a>
          <a href="#mt-objects">04 / OBJECTS</a>
          <a href="#mt-about">05 / THE ARTIST</a>
        </div>
        <span>DIRECT FROM THE ARTIST</span>
      </nav>
      <main className="mt-main">
        <section id="mt-music" className="mt-feature">
          <div className="mt-feature-art">
            <Cover />
            <div className="mt-art-caption">
              <span>M3 / 001</span>
              <span>PROPOSED RELEASE ARTWORK</span>
            </div>
            <div className="mt-art-message">
              <span>↳</span>
              <p>
                Less distance between
                <br />
                the artist and the listener.
              </p>
            </div>
          </div>
          <div className="mt-release-details">
            <p className="mt-label">
              <i /> FEATURED RELEASE CONCEPT
            </p>
            <h2>
              THIRD
              <br />
              <span>STATE.</span>
            </h2>
            <p className="mt-deck">
              Somewhere between movement and stillness.
              <br />
              Six tracks. One shared frequency.
            </p>
            <div className="mt-release-meta">
              <span>6 TRACKS</span>
              <span>30 MIN</span>
              <span>DIGITAL EP / MOCKUP</span>
            </div>
            <div className="mt-buy-row">
              <button className="mt-button" onClick={() => void play(1)}>
                {playing && active === 1 ? "Ⅱ PAUSE DEMO" : "▶ PLAY DEMO"}
              </button>
              <button
                className="mt-button secondary"
                onClick={() =>
                  setProduct({ title: "Third State · Digital EP", price: "$9" })
                }
              >
                COLLECT THE EP <span>$9 ↗</span>
              </button>
            </div>
            <p className="mt-fine-print">
              Concept pricing · WAV / FLAC / MP3 · Checkout preview
            </p>
            <div className="mt-tracks">
              {tracks.map((track, index) => (
                <button
                  key={track.title}
                  className={playing && active === index ? "active" : ""}
                  aria-label={`${playing && active === index ? "Pause" : "Preview"} ${track.title}`}
                  onClick={() => void play(index)}
                >
                  <span className="mt-track-no">
                    {playing && active === index ? "Ⅱ" : `0${index + 1}`}
                  </span>
                  <span className="mt-track-name">
                    <strong>{track.title}</strong>
                    <small>{track.tag}</small>
                  </span>
                  <span className="mt-track-length">{track.length}</span>
                  <span className="mt-track-play">
                    {playing && active === index ? "Ⅱ" : "▷"}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-demo-note">
              All titles are placeholders. Each preview plays the same
              synthesized 30-second demo, not a M3TTA recording.
            </p>
            <details className="mt-credits">
              <summary>
                THE RELEASE / NOTES & CREDITS <span>+</span>
              </summary>
              <p>
                A proposed release story exploring space, rhythm, and
                connection. Track names, descriptions, running times, artwork,
                and prices are for this storefront mockup. Actual M3TTA releases
                and credits can replace them.
              </p>
            </details>
          </div>
        </section>
        <section id="mt-releases" className="mt-section">
          <div className="mt-section-heading">
            <div>
              <p className="mt-label">02 / THE CATALOG</p>
              <h2>EXPLORE THE SIGNAL.</h2>
            </div>
            <div className="mt-filters" aria-label="Filter M3TTA releases">
              {["All releases", "EPs", "Singles"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  aria-pressed={filter === item}
                  className={filter === item ? "selected" : ""}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-release-grid">
            {releases
              .filter(
                (item) =>
                  filter === "All releases" ||
                  (filter === "EPs"
                    ? item.type === "EP"
                    : item.type === "Single"),
              )
              .map((item) => (
                <button
                  className="mt-release-card"
                  key={item.title}
                  onClick={() =>
                    setProduct({
                      title: `${item.title} · Digital ${item.type}`,
                      price: item.price,
                      art: item.art,
                    })
                  }
                >
                  <Cover variant={item.art} />
                  <div className="mt-card-title">
                    <h3>{item.title}</h3>
                    <span>↗</span>
                  </div>
                  <p>{item.note}</p>
                  <div className="mt-card-meta">
                    <span>
                      {item.type.toUpperCase()} / CONCEPT {item.index}
                    </span>
                    <span>{item.price}</span>
                  </div>
                </button>
              ))}
          </div>
        </section>
        <section className="mt-statement">
          <span>✳</span>
          <p>
            NOT JUST SOMETHING
            <br />
            YOU HEAR.
            <br />
            <em>SOMETHING YOU FEEL.</em>
          </p>
          <small>PROPOSED BRAND LANGUAGE / M3TTA</small>
        </section>
        <section id="mt-sessions" className="mt-sessions">
          <div className="mt-session-art">
            <img
              src={`${import.meta.env.BASE_URL}images/m3tta-sessions-reference.jpg`}
              alt="M3TTA Sessions series artwork: white M3TTA wordmark, thin Sessions lettering and red Episode 002 caption on charcoal"
              loading="lazy"
            />
          </div>
          <div className="mt-session-copy">
            <p className="mt-label">03 / THE SESSIONS</p>
            <h2>
              M3TTA
              <br />
              <span>SESSIONS.</span>
            </h2>
            <p className="mt-session-intro">
              A longer journey.
              <br />A different state of mind.
            </p>
            <div className="mt-session-row">
              <div>
                <span>THE ARCHIVE / 001</span>
                <h3>M3TTA Sessions #001</h3>
                <p>March 2, 2021 · 1 hr 12 min · DJ mix</p>
              </div>
              <a
                href="https://music.amazon.com/podcasts/f49790e6-2e1f-4289-a97a-8bd93219b708/episodes/9514ae60-78c3-4e12-8aa9-fbd35a195ae8/metta-sessions-m3tta-sessions-001"
                target="_blank"
                rel="noreferrer"
                aria-label="Listen to M3TTA Sessions 001 on Amazon Music in a new tab"
              >
                ↗
              </a>
            </div>
            <p className="mt-fine-print">
              Listen on Amazon Music. Series artwork shown as supplied by the
              reference page.
            </p>
          </div>
        </section>
        <section id="mt-objects" className="mt-section">
          <div className="mt-section-heading">
            <div>
              <p className="mt-label">04 / PHYSICAL CONNECTION</p>
              <h2>TAKE THE ENERGY WITH YOU.</h2>
            </div>
            <span className="mt-small-note">
              Merchandise concepts / not for sale
            </span>
          </div>
          <div className="mt-merch-grid">
            <button
              className="mt-merch-card"
              onClick={() =>
                setProduct({
                  title: "Third State · Smoke vinyl",
                  price: "$30",
                  kind: "record",
                })
              }
            >
              <div className="mt-product-scene">
                <div className="mt-vinyl">
                  <span>M3</span>
                </div>
                <div className="mt-sleeve">
                  <Cover />
                </div>
                <span className="mt-scene-label">OBJECT 001 / SMOKE VINYL</span>
              </div>
              <div className="mt-card-title">
                <h3>Third State / 12-inch vinyl</h3>
                <span>$30</span>
              </div>
              <p>Smoke pressing concept + digital EP</p>
              <span className="mt-text-link">VIEW OBJECT ↗</span>
            </button>
            <button
              className="mt-merch-card"
              onClick={() =>
                setProduct({
                  title: "Frequency · Heavyweight tee",
                  price: "$38",
                  kind: "shirt",
                })
              }
            >
              <div className="mt-product-scene tee">
                <Shirt />
                <span className="mt-scene-label">
                  OBJECT 002 / FREQUENCY UNIFORM
                </span>
              </div>
              <div className="mt-card-title">
                <h3>Frequency / Heavyweight tee</h3>
                <span>$38</span>
              </div>
              <p>Oversized silhouette concept · Faded black</p>
              <span className="mt-text-link">VIEW OBJECT ↗</span>
            </button>
          </div>
        </section>
        <section id="mt-about" className="mt-about">
          <div className="mt-about-visual mt-photo-story">
            <img
              src={`${import.meta.env.BASE_URL}images/m3tta-studio-concept.jpg`}
              alt="Illustrative studio portrait of a fictional producer at a synthesizer"
              width="1536"
              height="1024"
              loading="lazy"
            />
            <span>
              BE HERE.
              <br />
              <em>FEEL SOMETHING.</em>
            </span>
            <small>AI-GENERATED CONCEPT PORTRAIT / NOT A PHOTO OF M3TTA</small>
          </div>
          <div className="mt-about-copy">
            <p className="mt-label">05 / THE ARTIST</p>
            <h2>
              JASON ROBINSON.
              <br />
              <span className="mt-bio-alias">M3TTA / DIRTYFREQS</span>
            </h2>
            <p className="mt-bio-role">PRODUCER / COMPOSER / PROGRAMMER</p>
            <div
              className="mt-bio-scroll"
              role="region"
              aria-label="Jason Robinson biography"
              tabIndex={0}
            >
              <p>
                Jason Robinson is a Southern California–based music producer,
                composer, and programmer whose work spans pop, electronic music,
                and original composition for film, television, and advertising.
                Also known as DIRTYFREQS and M3TTA, he brings a love of melody,
                rhythm, and sonic detail to both his collaborations and
                independent releases.
              </p>
              <p>
                Jason’s interest in music began with a Casio keyboard and
                guitar, sparking a curiosity that developed into a career in
                production. Through his longstanding collaboration with
                Grammy-winning remixer Dave Audé, he has contributed production
                and programming to projects involving Selena Gomez, Lady Gaga,
                Beyoncé, Keri Hilson, Paul Oakenfold, and Hilary Duff. His
                credits include work with Rock Mafia and Audé on Selena Gomez’s
                “Kill Em with Kindness,” along with production and reprogramming
                contributions to seven tracks on Sting’s <em>My Songs</em>. His
                collaborations with Justin Caruso have also reached millions of
                streams.
              </p>
              <p>
                As M3TTA, Jason explores the intersection of progressive house,
                trance, synthwave, and techno, pairing nostalgic textures with
                driving basslines and emotive melodies. His releases and remixes
                have received support from Armin van Buuren’s{" "}
                <em>A State of Trance</em>, Above &amp; Beyond’s{" "}
                <em>Group Therapy</em>, Paul van Dyk, Paul Oakenfold, and
                Christopher Lawrence.
              </p>
              <p>
                Through Dirtyfreqs, Jason applies that range to music for
                picture, creating everything from intimate atmospheric pieces to
                energetic electronic productions. Whether supporting an artist’s
                vision or shaping the mood of a scene, his focus is on music
                that serves the project and connects with the listener.
              </p>
            </div>
            <span className="mt-bio-scroll-hint">SCROLL TO READ BIO ↓</span>
            <button className="mt-text-link" onClick={share}>
              SHARE THE FREQUENCY ↗
            </button>
          </div>
        </section>
        <section className="mt-transmissions">
          <div>
            <p className="mt-label">TRANSMISSIONS / THE NEXT CHAPTER</p>
            <h2>
              STAY ON THE
              <br />
              <span>FREQUENCY.</span>
            </h2>
            <p>New releases. Physical drops. A closer connection.</p>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubscribed(true);
            }}
          >
            <label htmlFor="m3tta-email">YOUR EMAIL ADDRESS</label>
            <div className="mt-email-field">
              <input
                id="m3tta-email"
                type="email"
                placeholder="you@yourworld.com"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setSubscribed(false);
                }}
              />
              <button type="submit" aria-label="Preview M3TTA email signup">
                ↗
              </button>
            </div>
            <p role="status">
              {subscribed
                ? "Demo signup complete. Your address was not saved or sent."
                : "Preview signup. No email is collected in this mockup."}
            </p>
          </form>
        </section>
      </main>
      <footer className="mt-footer">
        <a href="#mt-music">
          M3TTA<span>✳</span>
        </a>
        <p>
          INDEPENDENT SOUND. DIRECT CONNECTION.
          <small>M3TTA brand mockup · Concept catalog & merchandise.</small>
        </p>
        <a className="mt-footer-am" href="#">
          A SPACE ON <strong>am↗</strong>
        </a>
      </footer>
      <div
        className="mt-player"
        role="region"
        aria-label="M3TTA demo audio player"
      >
        <div className="mt-player-track">
          <Cover small />
          <div>
            <strong>{tracks[active].title}</strong>
            <span>M3TTA / SYNTHESIZED DEMO</span>
          </div>
        </div>
        <div className="mt-player-controls">
          <button
            aria-label="Previous preview"
            onClick={() =>
              void play((active + tracks.length - 1) % tracks.length)
            }
          >
            Ⅰ◁
          </button>
          <button
            className="mt-player-play"
            aria-label={playing ? "Pause demo" : "Play demo"}
            onClick={() => void play(active)}
          >
            {playing ? "Ⅱ" : "▶"}
          </button>
          <button
            aria-label="Next preview"
            onClick={() => void play((active + 1) % tracks.length)}
          >
            ▷Ⅰ
          </button>
        </div>
        <div className="mt-player-seek">
          <span>{time(progress)}</span>
          <input
            type="range"
            aria-label="Seek M3TTA demo audio"
            min="0"
            max={duration}
            step="0.1"
            value={progress}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (audio.current) audio.current.currentTime = value;
              setProgress(value);
            }}
          />
          <span>{time(duration)}</span>
        </div>
        <button
          className="mt-player-collect"
          onClick={() =>
            setProduct({ title: "Third State · Digital EP", price: "$9" })
          }
        >
          COLLECT EP ↗
        </button>
      </div>
      <audio
        ref={audio}
        src={`${import.meta.env.BASE_URL}audio/ambient-preview.wav`}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={() => setDuration(audio.current?.duration ?? 30)}
        onTimeUpdate={() => setProgress(audio.current?.currentTime ?? 0)}
      />
      <dialog
        ref={dialog}
        className="mt-dialog"
        aria-labelledby="mt-product-title"
        onCancel={() => setProduct(null)}
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
      >
        <button
          className="mt-dialog-close"
          autoFocus
          aria-label="Close product preview"
          onClick={close}
        >
          ✕
        </button>
        <p className="mt-label">M3TTA / OBJECT PREVIEW</p>
        {product?.kind === "shirt" ? (
          <div className="mt-dialog-scene mt-tee-detail">
            <Shirt />
          </div>
        ) : product?.kind === "record" ? (
          <div className="mt-dialog-scene">
            <div className="mt-vinyl">
              <span>M3</span>
            </div>
            <div className="mt-sleeve">
              <Cover />
            </div>
          </div>
        ) : (
          <Cover variant={product?.art} />
        )}
        <h2 id="mt-product-title">{product?.title}</h2>
        <strong className="mt-dialog-price">{product?.price}</strong>
        <p>A preview of the direct-to-fan purchase experience.</p>
        <div className="mt-dialog-note">
          <strong>CONCEPT PRODUCT / NO CHECKOUT</strong>
          <p>
            Names, artwork, and prices are placeholders. No order or payment
            will be made.
          </p>
        </div>
        <button className="mt-button" onClick={close}>
          BACK TO THE FREQUENCY ↗
        </button>
      </dialog>
      <div className={`mt-toast ${notice ? "show" : ""}`} role="status">
        {notice}
      </div>
    </div>
  );
}
