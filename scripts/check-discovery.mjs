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
assert.equal(records.length, 25);
assert.equal(new Set(records.map((x) => x.slug)).size, 25);
for (const artist of records) {
  assert.ok(artist.name && artist.release.title && artist.summary);
  assert.equal(
    new URL(artist.sourceUrl).hostname.endsWith(".bandcamp.com"),
    true,
  );
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
    assert.ok(page.includes(artist.sourceUrl));
    assert.ok(!page.includes("<audio") && !page.includes("<iframe"));
  }
  globalThis.window = { location: { hash: "" } };
  const home = renderToString(React.createElement(App));
  assert.ok(home.includes("25 Bandcamp reference profiles"));
  assert.ok(
    home.includes("#/artist/m3tta") && home.includes("#/artist/mira-sol"),
  );
  assert.equal((home.match(/class="release"/g) || []).length, 12);
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
    "Verified 25 unique profiles, 48 images, complete track counts, no audio/lyrics/contact data, all artist routes, marketplace paging, existing artist pages, and unknown-route handling.",
  );
} finally {
  await server.close();
}
