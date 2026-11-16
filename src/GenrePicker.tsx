import { useId, useState } from "react";
import { genreStyleGroups } from "./data/genreStyles";
import { genreMatchCount } from "./data/moodPlaylists";

const groups = genreStyleGroups.map(group => ({ ...group, options: [group.genre, ...group.styles.map(style => style.label)].map(label => ({ label, count: genreMatchCount(label) })) }));
export default function GenrePicker({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const [search, setSearch] = useState("");
  const id = useId();
  const query = search.trim().toLowerCase();
  const filtered = groups.map(group => ({ ...group, options: group.genre.toLowerCase().includes(query) ? group.options : group.options.filter(option => option.label.toLowerCase().includes(query)) })).filter(group => group.options.length);
  function toggle(label: string) {
    if (value.includes(label)) onChange(value.filter(item => item !== label));
    else if (value.length < 6) onChange([...value, label]);
  }
  return <fieldset className="genre-picker"><legend>Find your sound</legend>
    <label className="genre-search-label" htmlFor={`${id}-search`}>Search genres &amp; subgenres</label>
    <input type="search" id={`${id}-search`} value={search} onChange={event => setSearch(event.target.value)} placeholder="Try deep house, shoegaze, piano jazz…" />
    <div className="genre-selection-heading"><span>{value.length} / 6 selected</span>{value.length > 0 && <button type="button" onClick={() => onChange([])}>Clear all</button>}</div>
    {value.length > 0 && <div className="genre-selected-tags" aria-label="Selected genres">{value.map(label => <button type="button" key={label} onClick={() => toggle(label)} aria-label={`Remove ${label}`}>{label}<span aria-hidden="true">×</span></button>)}</div>}
    <div className="genre-picker-groups" role="group" aria-label="Genres and subgenres">
      {filtered.map(group => <section className="genre-picker-group" key={group.genre} aria-label={group.genre}><h3>{group.genre}<span>{group.options.length - (group.options.some(option => option.label === group.genre) ? 1 : 0)} styles</span></h3><div className="mix-genre-buttons">{group.options.map(option => <button type="button" key={option.label} aria-pressed={value.includes(option.label)} disabled={!option.count || (!value.includes(option.label) && value.length >= 6)} title={!option.count ? "No matching previews in this demo yet" : `${option.count} matching artist previews`} onClick={() => toggle(option.label)}>{value.includes(option.label) ? "✓ " : "+ "}{option.label === group.genre ? `All ${option.label}` : option.label}<small>{option.count}</small></button>)}</div></section>)}
      {!filtered.length && <p className="genre-no-results">No matching styles. Try house, folk, jazz, or rock.</p>}
    </div>
    {value.length >= 6 && <p className="genre-limit" role="status">Six sounds selected. Remove one to try another.</p>}
  </fieldset>;
}
