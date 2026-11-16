import "./ArtistBadge.css";

const explanation = "Design preview only. Artist identity, authenticity, and use of AI have not been verified.";

export default function ArtistBadge() {
  return (
    <span className="artist-verification" title={explanation} aria-label={`Verified artist badge demo. No AI music claim is illustrative only. ${explanation}`}>
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
        <path d="m12 2 3 2 3.6.4.9 3.5L22 11l-1.5 3.3-.9 3.5-3.6.4-4 2.8-4-2.8-3.6-.4-.9-3.5L2 11l2.5-3.1.9-3.5L9 4Z" fill="currentColor"/>
        <path d="m7.5 11.5 3 3 6-6" stroke="#101b17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>Verified artist · No AI music</span><small>DEMO</small>
    </span>
  );
}
