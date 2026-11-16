import { useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import "./ReportArtist.css";

const reasons = [
  "Suspected AI-generated music",
  "Incorrect verification badge",
  "Impersonation or fake artist",
  "Copyright or ownership concern",
  "Hateful or harmful content",
  "Spam or misleading information",
  "Other",
];

export default function ReportArtist({ slug, name }: { slug: string; name: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function open() {
    setReason(""); setDetails(""); setSaved(false); setError("");
    dialog.current?.showModal();
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reasons.includes(reason)) return;
    try {
      const stored: unknown = JSON.parse(localStorage.getItem("artist-report-previews") ?? "[]");
      const previous = Array.isArray(stored) ? stored : [];
      const report = { artistSlug: slug, artistName: name, reason, details: details.trim(), createdAt: new Date().toISOString() };
      localStorage.setItem("artist-report-previews", JSON.stringify([...previous.slice(-99), report]));
      setSaved(true); setError("");
    } catch {
      setError("Your browser could not save this report. Please enable local storage and try again.");
    }
  }

  return <>
    <button type="button" className="artist-report-trigger" onClick={open} aria-haspopup="dialog" aria-label={`Report ${name}`}>
      <svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 17V3c4-3 8 3 12 0v8c-4 3-8-3-12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      Report
    </button>
    <dialog className="artist-report-dialog" ref={dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-note`} onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <button type="button" className="artist-report-close" aria-label="Close report" onClick={() => dialog.current?.close()}>×</button>
      <span className="artist-report-kicker">HELP KEEP THE COMMUNITY AUTHENTIC</span>
      <h2 id={`${id}-title`}>{saved ? "Report saved locally" : "Report this artist"}</h2>
      <p className="artist-report-name">{name}</p>
      <p id={`${id}-note`} className="artist-report-note">Demo only. Reports stay in this browser and are not sent to the artist or a moderation team.</p>
      {saved ? <div className="artist-report-success">
        <p role="status">Your concern about “{reason}” was saved on this device. No report has been submitted for review.</p>
        <button type="button" className="artist-report-submit" onClick={() => dialog.current?.close()}>Done</button>
      </div> : <form onSubmit={submit}>
        <label htmlFor={`${id}-reason`}>What’s the concern?</label>
        <select id={`${id}-reason`} required value={reason} onChange={event => setReason(event.target.value)}>
          <option value="" disabled>Select a reason</option>
          {reasons.map(item => <option key={item}>{item}</option>)}
        </select>
        <label htmlFor={`${id}-details`}>Additional context <span>(optional)</span></label>
        <textarea id={`${id}-details`} value={details} onChange={event => setDetails(event.target.value)} maxLength={1000} rows={4} placeholder="Tell us what raised your concern. Please leave out personal or sensitive information."/>
        <small className="artist-report-counter">{details.length} / 1000</small>
        {error && <p className="artist-report-error" role="alert">{error}</p>}
        <div className="artist-report-form-actions"><button type="button" className="artist-report-cancel" onClick={() => dialog.current?.close()}>Cancel</button><button type="submit" className="artist-report-submit">Save demo report ↗</button></div>
      </form>}
    </dialog>
  </>;
}
