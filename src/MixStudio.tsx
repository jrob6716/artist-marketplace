import GenrePicker from "./GenrePicker";
import { useId, useState } from "react";
import type { FormEvent } from "react";
import { generateGenrePlaylist, generateMoodPlaylist, moodPresets } from "./data/moodPlaylists";
import type { MoodId, MoodPick } from "./data/moodPlaylists";
import type { Playlist } from "./data/playlists";

export default function MixStudio({ onSave }: { onSave: (draft: Pick<Playlist, "name" | "items" | "mood" | "prompt" | "genres">) => void }) {
  const id = useId();
  const [mode, setMode] = useState<"mood" | "genre">("mood");
  const [genres, setGenres] = useState<string[]>([]);
  const [mood, setMood] = useState<MoodId>("focus");
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(10);
  const [variation, setVariation] = useState(0);
  const [picks, setPicks] = useState<MoodPick[] | null>(null);
  const [name, setName] = useState("");
  const preset = moodPresets.find(item => item.id === mood)!;
  function generate(event: FormEvent) {
    event.preventDefault();
    setPicks(mode === "genre" ? generateGenrePlaylist(genres, prompt, count, variation) : generateMoodPlaylist(mood, prompt, count, variation));
    setName(mode === "genre" ? `${genres.join(" + ")} mix`.slice(0, 80) : preset.title); setVariation(variation + 1);
  }
  return <div className="mood-builder">
    <div className="mix-studio-mode" role="group" aria-label="Build a mix by"><button type="button" aria-pressed={mode === "mood"} onClick={() => { setMode("mood"); setPicks(null); }}>◉ By mood</button><button type="button" aria-pressed={mode === "genre"} onClick={() => { setMode("genre"); setPicks(null); }}>♫ By genre</button></div>
    <form onSubmit={generate}>
      {mode === "mood" ? <><fieldset><legend>How are you feeling?</legend><div className="mood-presets">{moodPresets.map(item => <button type="button" key={item.id} aria-pressed={mood === item.id} onClick={() => { setMood(item.id); setPicks(null); }}><span aria-hidden="true">{item.icon}</span>{item.label}</button>)}</div></fieldset>
      <p className="mood-description">{preset.description}</p></> : <>
        <GenrePicker value={genres} onChange={next => { setGenres(next); setPicks(null); }} />
        <p className="mood-description">Blend up to 6 genres or subgenres. Counts show available previews; a smaller selection may produce a shorter mix. Profiles without genre details are excluded.</p>
      </>}
      <label htmlFor={`${id}-prompt`}>Tell us more <span>(optional)</span></label>
      <textarea id={`${id}-prompt`} rows={2} maxLength={300} value={prompt} onChange={event => { setPrompt(event.target.value); setPicks(null); }} placeholder={mode === "genre" ? "Acoustic textures, piano, no heavy guitars…" : "Late-night electronic, soft synths, no rock…"} />
      <div className="mood-generate-row"><label htmlFor={`${id}-count`}>Mix size<select id={`${id}-count`} value={count} onChange={event => { setCount(Number(event.target.value)); setPicks(null); }}><option value={6}>6 previews</option><option value={10}>10 previews</option><option value={15}>15 previews</option></select></label><button type="submit" className="playlist-primary" disabled={mode === "genre" && !genres.length}>{picks ? "↻ Try another mix" : "✧ Build my mix"}</button></div>
    </form>
    {mode === "genre" && !genres.length && <p className="mix-genre-hint">Select at least one genre to build your mix.</p>}
    {picks && <section className="mood-results" aria-label="Generated playlist preview" aria-live="polite">
      <div className="mood-results-heading"><strong>{picks.length ? "A mix for your moment" : "No matches for this combination"}</strong><span>{picks.length} previews</span></div>
      {picks.length ? <>
        {picks.length < count && <p className="mix-short-notice">{picks.length} matches available for your choices. We’ve kept the mix unique rather than repeating previews.</p>}
        <p>Based on profile genres and tags, without analyzing audio. Remove anything that doesn’t fit, then save your mix.</p>
        <div className="mood-picks">{picks.map(pick => <div className="mood-pick" key={pick.slug}><img src={`${import.meta.env.BASE_URL}${pick.image}`} alt="" width="40" height="40"/><div><strong>{pick.name}</strong><small>{pick.reason}</small></div><button type="button" aria-label={`Remove ${pick.name} from mix`} onClick={() => setPicks(picks.filter(item => item.slug !== pick.slug))}>×</button></div>)}</div>
        <form onSubmit={event => { event.preventDefault(); if (name.trim() && picks.length) onSave({ name: name.trim(), items: picks.map(pick => pick.slug), ...(mode === "mood" ? { mood: preset.label } : { genres }), prompt: prompt.trim() }); }}>
          <label htmlFor={`${id}-name`}>Name your mix</label><input id={`${id}-name`} value={name} onChange={event => setName(event.target.value)} maxLength={80} required/>
          <button type="submit" className="playlist-primary mood-save">Save this playlist ↗</button>
        </form>
      </> : <p>Try a different mood or genre selection, or use fewer exclusions.</p>}
    </section>}
  </div>;
}
