import { useId, useState } from "react";
import type { FormEvent } from "react";
import { generateMoodPlaylist, moodPresets } from "./data/moodPlaylists";
import type { MoodId, MoodPick } from "./data/moodPlaylists";
import type { Playlist } from "./data/playlists";

export default function MoodPlaylistBuilder({ onSave }: { onSave: (draft: Pick<Playlist, "name" | "items" | "mood" | "prompt">) => void }) {
  const id = useId();
  const [mood, setMood] = useState<MoodId>("focus");
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(10);
  const [variation, setVariation] = useState(0);
  const [picks, setPicks] = useState<MoodPick[] | null>(null);
  const [name, setName] = useState("");
  const preset = moodPresets.find(item => item.id === mood)!;
  function generate(event: FormEvent) {
    event.preventDefault();
    setPicks(generateMoodPlaylist(mood, prompt, count, variation));
    setName(preset.title); setVariation(variation + 1);
  }
  return <div className="mood-builder">
    <form onSubmit={generate}>
      <fieldset><legend>How are you feeling?</legend><div className="mood-presets">{moodPresets.map(item => <button type="button" key={item.id} aria-pressed={mood === item.id} onClick={() => { setMood(item.id); setPicks(null); }}><span aria-hidden="true">{item.icon}</span>{item.label}</button>)}</div></fieldset>
      <p className="mood-description">{preset.description}</p>
      <label htmlFor={`${id}-prompt`}>Tell us more <span>(optional)</span></label>
      <textarea id={`${id}-prompt`} rows={2} maxLength={300} value={prompt} onChange={event => { setPrompt(event.target.value); setPicks(null); }} placeholder="Late-night electronic, soft synths, no rock…" />
      <div className="mood-generate-row"><label htmlFor={`${id}-count`}>Mix size<select id={`${id}-count`} value={count} onChange={event => { setCount(Number(event.target.value)); setPicks(null); }}><option value={6}>6 previews</option><option value={10}>10 previews</option><option value={15}>15 previews</option></select></label><button type="submit" className="playlist-primary">{picks ? "↻ Try another mix" : "✧ Build my mix"}</button></div>
    </form>
    {picks && <section className="mood-results" aria-label="Generated playlist preview" aria-live="polite">
      <div className="mood-results-heading"><strong>{picks.length ? "A mix for your moment" : "No matches for this combination"}</strong><span>{picks.length} previews</span></div>
      {picks.length ? <>
        <p>Based on profile genres and tags, without analyzing audio. Remove anything that doesn’t fit, then save your mix.</p>
        <div className="mood-picks">{picks.map(pick => <div className="mood-pick" key={pick.slug}><img src={`${import.meta.env.BASE_URL}${pick.image}`} alt="" width="40" height="40"/><div><strong>{pick.name}</strong><small>{pick.reason}</small></div><button type="button" aria-label={`Remove ${pick.name} from mix`} onClick={() => setPicks(picks.filter(item => item.slug !== pick.slug))}>×</button></div>)}</div>
        <form onSubmit={event => { event.preventDefault(); if (name.trim() && picks.length) onSave({ name: name.trim(), items: picks.map(pick => pick.slug), mood: preset.label, prompt: prompt.trim() }); }}>
          <label htmlFor={`${id}-name`}>Name your mix</label><input id={`${id}-name`} value={name} onChange={event => setName(event.target.value)} maxLength={80} required/>
          <button type="submit" className="playlist-primary mood-save">Save this playlist ↗</button>
        </form>
      </> : <p>Try another mood, use fewer exclusions, or add a genre such as ambient, folk, jazz, or electronic.</p>}
    </section>}
  </div>;
}
