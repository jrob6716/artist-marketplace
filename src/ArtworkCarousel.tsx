import { useEffect, useRef, useState } from "react";
import { discoveryArtists } from "./data/discovery";
import "./ArtworkCarousel.css";

const selections = ["paris-paloma", "the-hanging-stars", "simon-herody", "nick-schofield", "sunhyun-yoo", "hadamard", "bobbyy", "john-lebanon", "inland-years"];
const albums = selections.flatMap(slug => {
  const artist = discoveryArtists.find(item => item.slug === slug);
  return artist ? [{ slug, artist: artist.name, title: artist.release.title, image: artist.artwork }] : [];
});
const slides = [
  { slug: "m3tta", artist: "M3TTA", title: "Third State", image: "images/m3tta-third-state-sculpture.jpg" },
  ...albums.slice(0, 1),
  { slug: "brand", artist: "", title: "", image: "" },
  ...albums.slice(1, 2),
  { slug: "mira-sol", artist: "Mira Sol", title: "An artist world", image: "images/mira-studio-concept.jpg" },
  ...albums.slice(2),
];

export default function ArtworkCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; active: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [position, setPosition] = useState({ first: 0, atStart: true, atEnd: false });
  function update() {
    const element = track.current;
    if (!element) return;
    const stride = (element.firstElementChild?.getBoundingClientRect().width ?? 250) + 16;
    setPosition({ first: Math.round(element.scrollLeft / stride), atStart: element.scrollLeft < 2, atEnd: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2 });
  }
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const observer = new ResizeObserver(update);
    observer.observe(element); update();
    return () => observer.disconnect();
  }, []);
  function move(direction: number) {
    const element = track.current;
    if (!element) return;
    const stride = (element.firstElementChild?.getBoundingClientRect().width ?? 250) + 16;
    element.scrollBy({ left: stride * direction, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <section className="artwork-carousel" aria-label="Explore artist artwork" aria-roledescription="carousel">
    <p className="carousel-instructions" id="artwork-gallery-help">A glimpse of their worlds. Swipe, drag, or use the arrows to explore.</p>
    <div className="artwork-carousel-track" ref={track} tabIndex={0} aria-label="Scrollable artist artwork" aria-describedby="artwork-gallery-help" onScroll={update}
      onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); }
        if (event.key === "Home" || event.key === "End") { event.preventDefault(); event.currentTarget.scrollTo({ left: event.key === "Home" ? 0 : event.currentTarget.scrollWidth, behavior: "instant" }); }
      }}
      onPointerDown={event => {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        suppressClick.current = false;
        drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, active: false };
      }}
      onPointerMove={event => {
        if (!drag.current || event.pointerType !== "mouse") return;
        const distance = event.clientX - drag.current.x;
        if (!drag.current.active && Math.abs(distance) > 7) {
          drag.current.active = true; suppressClick.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.classList.add("is-dragging");
        }
        if (drag.current.active) { event.preventDefault(); event.currentTarget.scrollLeft = drag.current.left - distance; }
      }}
      onPointerUp={event => {
        drag.current = null;
        event.currentTarget.classList.remove("is-dragging");
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={event => { drag.current = null; event.currentTarget.classList.remove("is-dragging"); }}
      onPointerLeave={event => { if (!drag.current?.active) { drag.current = null; event.currentTarget.classList.remove("is-dragging"); } }}
      onClickCapture={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}>
      {slides.map((slide, index) => slide.slug === "brand" ? <div key="brand" className="carousel-slide carousel-brand" role="group" aria-label={`${index + 1} of ${slides.length}: Every sound, someone’s world`}><span>Every sound.<br/>Someone’s world.</span><strong>am↗</strong></div> : <a className="carousel-slide carousel-album" href={`#/artist/${slide.slug}`} key={slide.slug} draggable={false} aria-label={`${index + 1} of ${slides.length}: Explore ${slide.title} by ${slide.artist}`}>
        <img src={`${import.meta.env.BASE_URL}${slide.image}`} alt={`${slide.title} — ${slide.artist}`} draggable={false} width="600" height="600" loading="lazy" />
        <span className="carousel-album-caption"><span><strong>{slide.artist}</strong><small>{slide.title}</small></span><span aria-hidden="true">↗</span></span>
      </a>)}
    </div>
    <div className="carousel-controls"><span className="carousel-count">{String(Math.min(position.first + 1, slides.length)).padStart(2, "0")} <span>/ {slides.length} worlds</span></span><div><button type="button" aria-label="Previous artwork" disabled={position.atStart} onClick={() => move(-1)}>←</button><button type="button" aria-label="Next artwork" disabled={position.atEnd} onClick={() => move(1)}>→</button></div></div>
  </section>;
}
