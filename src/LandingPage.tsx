import ArtworkCarousel from "./ArtworkCarousel";
export default function LandingPage() {
  return <div className="brand-page">
    <header className="brand-header">
      <a className="brand" href="#" aria-label="Artist Marketplace home">am<span>↗</span><span className="brand-name">artist marketplace</span></a>
      <nav aria-label="Main navigation"><a href="#about">Our idea</a><a href="#artists">For artists</a></nav>
      <a className="brand-entry" href="#/discover">Explore the platform ↗</a>
    </header>
    <main>
      <section className="brand-hero">
        <p className="eyebrow">Independent music. Individual worlds.</p>
        <h1>Music brings us.<br/><em>Closer.</em></h1>
        <p className="brand-intro">Discover the music. Meet the people behind it.<br/>A new space for independent artists and curious listeners.</p>
        <a className="brand-cta" href="#/discover">Explore the platform <span>↗</span></a>
        <ArtworkCarousel />
      </section>
      <section className="brand-about" id="about"><p className="eyebrow">Independent by design</p><h2>A deeper connection<br/>to the music you love.</h2><div className="brand-principles"><article><span>01 / DISCOVER</span><h3>Follow your curiosity.</h3><p>Find a new sound, explore a release, and step into an artist’s world. There’s always another connection to make.</p></article><article><span>02 / CONNECT</span><h3>Know the story.</h3><p>Go beyond the cover. Explore the ideas, identities, and people that give the music its meaning.</p></article><article id="artists"><span>03 / CREATE</span><h3>A space that feels like you.</h3><p>Your releases, your story, your visual identity. We’re building a home around the people who make the music.</p></article></div></section>
      <section className="brand-invite"><p className="eyebrow">Find your next connection</p><h2>Your next favorite<br/>is out there.</h2><a className="brand-cta" href="#/discover">Step inside <span>↗</span></a><p className="brand-demo-note">Explore our working concept with sample artists and releases.</p></section>
    </main>
    <footer><a className="brand" href="#">am↗</a><p>Independent by design.</p><small>Working concept · No purchases available</small></footer>
  </div>;
}
