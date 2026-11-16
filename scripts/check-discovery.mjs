import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";
import { createServer } from "vite";
import React from "react";
import { renderToString } from "react-dom/server";
const records = JSON.parse(
  readFileSync(
    new URL("../src/data/discovery-artists.json", import.meta.url),
    "utf8",
  ),
);
assert.ok(records.length >= 37, "Expected the expanded artist collection");
assert.equal(new Set(records.map((x) => x.slug)).size, records.length);
for (const artist of records) {
  assert.ok(artist.name && artist.release.title && artist.summary);
  for (const field of ["artwork", "portrait"])
    if (artist[field])
      assert.ok(
        existsSync(new URL(`../public/${artist[field]}`, import.meta.url)),
        `${artist.slug}: missing ${field}`,
      );
  assert.equal(
    artist.release.tracks.length,
    artist.release.trackCount,
    `${artist.slug}: inconsistent track count`,
  );
}
const serialized = JSON.stringify(records);
assert.ok(
  !serialized.match(
    /mp3-128|streaming_url|"lyrics"|"email"|https?:[^" ]+\.(?:mp3|flac|wav)(?:[?"])/i,
  ),
  "No audio URLs, lyrics or contact fields should be imported",
);
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
globalThis.localStorage = { getItem: () => null };
try {
  const { default: App } = await server.ssrLoadModule("/src/App.tsx");
  for (const artist of records) {
    globalThis.window = { location: { hash: `#/artist/${artist.slug}` } };
    const page = renderToString(React.createElement(App));
    assert.ok(
      page.includes("This artist has not joined or endorsed this marketplace."),
    );
    assert.ok(page.includes(artist.artwork));
    assert.ok(page.includes("Verified artist badge demo."));
    assert.ok(page.includes("have not been verified."));
    assert.ok(page.includes("Verified artist · No AI music"));
    assert.ok(!/bandcamp/i.test(page), `${artist.slug}: unwanted platform mention or link`);
    assert.ok(!page.includes("<audio") && !page.includes("<iframe"));
  }
  globalThis.window = { location: { hash: "" } };
  const home = renderToString(React.createElement(App));
  assert.ok(home.includes("Music brings us."));
  assert.ok(home.includes("#/discover"));
  assert.ok(!home.includes('class="release"'));
  globalThis.window = { location: { hash: "#/discover" } };
  const platform = renderToString(React.createElement(App));
  assert.ok(platform.includes("Discover your next favorite"));
  assert.ok(platform.includes(`${records.length}<!-- --> artist reference profiles`));
  assert.ok(!/bandcamp/i.test(home), "Homepage contains unwanted platform copy or links");
  assert.ok(
    platform.includes("#/artist/m3tta") && platform.includes("#/artist/mira-sol"),
  );
  assert.equal((platform.match(/class="release"/g) || []).length, Math.min(50, records.length + 2));
  assert.equal((platform.match(/Verified artist badge demo\./g) || []).length, Math.min(50, records.length + 2));
  for (const hash of ["#discover", "#/collection"]) {
    globalThis.window = { location: { hash } };
    const page = renderToString(React.createElement(App));
    assert.ok(page.includes("Platform navigation"));
    if (hash === "#/collection") {
      assert.ok(page.includes("Saved previews"));
      assert.ok(page.includes("Your collection starts here."));
    }
  }
  globalThis.localStorage = { getItem: key => key === `reference-${records[0].slug}` ? "yes" : null };
  globalThis.window = { location: { hash: "#/collection" } };
  const saved = renderToString(React.createElement(App));
  assert.equal((saved.match(/class="release"/g) || []).length, 1);
  assert.ok(saved.includes(records[0].release.title));
  globalThis.localStorage = { getItem: () => null };
  for (const [route, marker] of [
    ["m3tta", "JASON ROBINSON."],
    ["mira-sol", "Mira Sol"],
  ]) {
    globalThis.window = { location: { hash: `#/artist/${route}` } };
    assert.ok(renderToString(React.createElement(App)).includes(marker));
  }
  globalThis.window = { location: { hash: "#/artist/not-a-real-artist" } };
  assert.ok(
    renderToString(React.createElement(App)).includes("Profile not found."),
  );
  console.log(
    `Verified ${records.length} unique reference profiles, complete track counts, no audio/lyrics/contact data, all artist routes, landing and platform routes, and saved previews.`,
  );
} finally {
  await server.close();
}
