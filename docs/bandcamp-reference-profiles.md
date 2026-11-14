# Bandcamp reference profiles

Collected November 14, 2026. There are 25 distinct reference profiles alongside the M3TTA and Mira Sol artist concepts.

## Collection method

The requested Discover page returned a JavaScript/client access challenge. The live Discover feed was not scraped or bypassed. Instead, public search-indexed artist release pages were collected directly, using their public structured metadata. This is a varied sample, not a claim about current Discover placement or ranking.

Only allowlisted metadata was saved: artist name, location where attributable to the artist, tags, selected release title/date, track names/durations, source URLs, cover artwork, and artist photos where the page publisher matched the release artist. Short summaries were written for the mockups. No audio URLs, audio files, lyrics, email addresses, fan data, prices, or purchase functionality were imported.

Public presentation: each reference page identifies itself as a design mockup, disclaims artist affiliation, and links to the original artist and release. Save preview is a device-local demo action. Images remain the property of their respective owners. These artists do not have accounts on this marketplace.

## Sources

| Artist | Genre | Selected release | Profile | Original source |
| --- | --- | --- | --- | --- |
| The Hanging Stars | Folk | Just A Day | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/the-hanging-stars) | [Bandcamp](https://thehangingstars.bandcamp.com/album/just-a-day) |
| Vanessa Bedoret | Experimental | About Time | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/vanessa-bedoret) | [Bandcamp](https://vanessabedoret.bandcamp.com/album/about-time) |
| BON | Spoken Word | Woven In Light | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/bon) | [Bandcamp](https://soundsofbon.bandcamp.com/album/woven-in-light) |
| Wil Bolton | Ambient | Margins | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/wil-bolton) | [Bandcamp](https://wilbolton.bandcamp.com/album/margins) |
| Paris Paloma | Pop | The Fatal Flaw | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/paris-paloma) | [Bandcamp](https://parispaloma.bandcamp.com/album/the-fatal-flaw) |
| Blue | Pop | Reflections | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/blue) | [Bandcamp](https://officialblue.bandcamp.com/album/reflections) |
| Kirk Monteux | Ambient | Tales From Far Away | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/kirk-monteux) | [Bandcamp](https://kirkmonteux.bandcamp.com/album/tales-from-far-away) |
| Polky | Folk | Mother Tongue | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/polky) | [Bandcamp](https://polkyband.bandcamp.com/album/mother-tongue) |
| iZerolite | Electronic | EMERGENCE | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/izerolite) | [Bandcamp](https://izerolite.bandcamp.com/album/emergence) |
| Hadamard | Electronic | IKENO | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/hadamard) | [Bandcamp](https://hadamard.bandcamp.com/album/ikeno) |
| Crooked Mouth | Folk | Cosmic Folklore | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/crooked-mouth) | [Bandcamp](https://crooked-mouth.bandcamp.com/album/cosmic-folklore) |
| Andrew Firth | Ambient | Copernicus | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/andrew-firth) | [Bandcamp](https://andrewfirth.bandcamp.com/album/copernicus) |
| Fortresses | Ambient | Here | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/fortresses) | [Bandcamp](https://fortressesmusic.bandcamp.com/album/here) |
| Amy Hopwood | Folk | Gone to flowers | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/amy-hopwood) | [Bandcamp](https://amyhopwood.bandcamp.com/album/gone-to-flowers) |
| HAIR CONTROL | Electronic | Electric Pleasure | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/hair-control) | [Bandcamp](https://haircontrol.bandcamp.com/album/electric-pleasure) |
| Ellen Stekert | Folk | All My Friends: A Queer Folk Songbook | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/ellen-stekert) | [Bandcamp](https://ellenstekert.bandcamp.com/album/all-my-friends-a-queer-folk-songbook) |
| The Departures | Rock | Why The Long Face? | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/the-departures) | [Bandcamp](https://thedepartures.bandcamp.com/album/why-the-long-face) |
| Bandie | Rock | Slow Down | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/bandie) | [Bandcamp](https://bandiemusic.bandcamp.com/album/slow-down) |
| The Darling Range | Rock | Dearly | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/the-darling-range) | [Bandcamp](https://thedarlingrange.bandcamp.com/album/dearly) |
| Ballpark! | Rock | BALLPARK! | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/ballpark) | [Bandcamp](https://ballparktheband.bandcamp.com/album/ballpark) |
| Modern Holiday | Rock | Modern Holiday | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/modern-holiday) | [Bandcamp](https://modernholiday.bandcamp.com/album/modern-holiday) |
| Claud Six & Big Jess | Hip-Hop | Grab a Shovel | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/claud-six) | [Bandcamp](https://claudsix.bandcamp.com/album/grab-a-shovel) |
| Focused | Hip-Hop | Blind Sight | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/focused) | [Bandcamp](https://focusedrap.bandcamp.com/album/blind-sight) |
| Paul Janoschka | Jazz | TRIO | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/paul-janoschka) | [Bandcamp](https://pauljanoschka.bandcamp.com/album/trio) |
| Chris Madsen | Jazz | Threefold | [Preview](https://jrob6716.github.io/artist-marketplace/#/artist/chris-madsen) | [Bandcamp](https://chrismadsen.bandcamp.com/album/threefold) |

## Files and checks

- Dataset: `src/data/discovery-artists.json`
- Profile template: `src/DiscoveryArtistPage.tsx`
- Local image assets: `public/images/discovery/`
- Detailed source/image provenance: `docs/bandcamp-collection-report.json`
- Collection script: `scripts/collect-bandcamp.py` (three concurrent requests; no challenge bypass; incomplete collections do not overwrite the dataset)
- Verification: `npm run check:discovery` checks all 25 profiles, image files, exact track counts, absence of audio/lyrics/contact fields, each profile route, the main page, both established artist pages, and missing-profile routing.
- `npm run lint` and `npm run build` validate the application.
- Browser automation was unavailable during this task; rendered desktop/mobile layout and browser interactions have not been visually verified.
