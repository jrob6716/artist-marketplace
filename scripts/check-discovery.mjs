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
assert.ok(records.length >= 137, "Expected the expanded artist collection");
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
    assert.ok(page.includes("Suspected AI-generated music"));
    assert.ok(page.includes("Reports stay in this browser"));
    assert.ok(page.includes("Save demo report"));
    if (artist.release.title === "Artist spotlight") {
      assert.ok(page.includes("ARTIST PORTRAIT"));
      assert.ok(!page.includes('class="ref-tracklist"'));
      assert.ok(!page.includes("0 TRACKS"));
    }
    assert.ok(page.includes("Verified artist badge demo."));
    assert.ok(page.includes("have not been verified."));
    assert.ok(page.includes("Verified artist · No AI music"));
    assert.ok(!/bandcamp|tidal\.com/i.test(page), `${artist.slug}: unwanted platform mention or link`);
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
  const scores = [...platform.matchAll(/data-popularity="(\d+)"/g)].map(match => Number(match[1]));
  assert.equal(scores.length, 50);
  assert.deepEqual(scores, [...scores].sort((a, b) => b - a));
  assert.ok(platform.includes("Generated demo scores"));
  globalThis.localStorage = { getItem: key => key === "discovery-view" ? "list" : null };
  const list = renderToString(React.createElement(App));
  assert.ok(list.includes('data-view="list"'));
  assert.ok(list.includes('class="releases releases-list"'));
  assert.deepEqual([...list.matchAll(/data-popularity="(\d+)"/g)].map(match => Number(match[1])), scores);
  globalThis.localStorage = { getItem: () => null };
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
  const { genrePages, curatedMixes, genreCatalog, styleSlug } = await server.ssrLoadModule("/src/data/genrePages.ts");
  globalThis.window = { location: { hash: "#/explore" } };
  const explore = renderToString(React.createElement(App));
  assert.ok(explore.includes("Moods &amp; moments"));
  assert.ok(explore.includes('href="#/genre/dance-electronic"'));
  for (const genre of genrePages) {
    assert.ok(genreCatalog(genre.selection).length > 0);
    assert.ok(existsSync(new URL(`../public/${genre.image}`, import.meta.url)));
    assert.ok(explore.includes(`href="#/genre/${genre.id}"`));
    for (const suffix of ["", "/artists", "/releases", ...genre.styles.map(style => `/style/${styleSlug(style)}`)]) {
      globalThis.window = { location: { hash: `#/genre/${genre.id}${suffix}` } };
      const page = renderToString(React.createElement(App));
      assert.ok(page.includes("genre-detail-hero"), `Missing genre page: ${genre.id}${suffix}`);
      assert.ok(!/href="https?:[^"]*(?:tidal|bandcamp)/i.test(page));
    }
  }
  for (const mix of curatedMixes) {
    assert.ok(mix.items.length > 0);
    assert.equal(new Set(mix.items).size, mix.items.length);
    globalThis.window = { location: { hash: `#/curated/${mix.id}` } };
    const page = renderToString(React.createElement(App));
    assert.ok(page.includes("Save to my playlists"));
    assert.ok(page.includes("No audio playback"));
  }
  const { releases } = await server.ssrLoadModule("/src/data/catalog.ts");
  for (const release of releases.filter(item => item.title !== "Artist spotlight")) {
    globalThis.window = { location: { hash: `#/release/${release.slug}` } };
    const page = renderToString(React.createElement(App));
    assert.ok(page.includes("genre-release-hero"));
    assert.ok(page.includes(`href="#/artist/${release.slug}"`));
    assert.ok(page.includes("Add to playlist"));
  }
  for (const hash of ["#/genre/missing", "#/genre/dance-electronic/style/missing", "#/curated/missing", "#/release/missing"]) {
    globalThis.window = { location: { hash } };
    assert.ok(renderToString(React.createElement(App)).includes("That world isn’t here yet."));
  }
  globalThis.window = { location: { hash: "#/discover" } };
  const { generateMoodPlaylist, generateGenrePlaylist, genreMatchCount } = await server.ssrLoadModule("/src/data/moodPlaylists.ts");
  assert.ok(platform.includes("Mix Studio"));
  assert.ok(!platform.includes("AI playlist"));
  const genreMix = generateGenrePlaylist(["Jazz", "Folk"], "", 10);
  assert.equal(genreMix.length, 10);
  assert.ok(genreMix.every(item => ["Jazz", "Folk"].includes(item.genre)));
  assert.deepEqual(genreMix.slice(0, 2).map(item => item.genre), ["Jazz", "Folk"]);
  assert.equal(new Set(genreMix.map(item => item.slug)).size, genreMix.length);
  assert.deepEqual(genreMix, generateGenrePlaylist(["Jazz", "Folk", "Jazz"], "", 10));
  assert.deepEqual(generateGenrePlaylist([], "", 10), []);
  assert.deepEqual(generateGenrePlaylist(["Invalid genre"], "", 10), []);
  assert.deepEqual(generateGenrePlaylist(["Rock"], "no rock", 10), []);
  assert.notDeepEqual(genreMix, generateGenrePlaylist(["Jazz", "Folk"], "", 10, 1));
  const { matchesGenreStyle, genreStyleGroups } = await server.ssrLoadModule("/src/data/genreStyles.ts");
  assert.ok(genreStyleGroups.flatMap(group => group.styles).length >= 50);
  assert.ok(matchesGenreStyle({ genre: "Electronic", text: "Deep House, progressive-house" }, "Deep House"));
  assert.ok(matchesGenreStyle({ genre: "Rock", text: "heavy shoegaze" }, "Shoegaze"));
  assert.ok(!matchesGenreStyle({ genre: "Rock", text: "a trapped feeling" }, "Rap"));
  const subgenreMix = generateGenrePlaylist(["Deep House", "Shoegaze", "Piano Jazz"], "", 10);
  assert.ok(subgenreMix.length > 0);
  assert.ok(subgenreMix.every(item => ["Electronic", "Rock", "Jazz"].includes(item.genre)));
  assert.ok(subgenreMix.some(item => item.slug === "izerolite"));
  assert.ok(subgenreMix.some(item => item.slug === "paul-janoschka"));
  assert.ok(genreMatchCount("Deep House") > 0);
  assert.equal(genreMatchCount("No such style"), 0);
  const overlapping = generateGenrePlaylist(["Electronic", "House", "Deep House"], "", 20);
  assert.equal(new Set(overlapping.map(item => item.slug)).size, overlapping.length);
  const focusMix = generateMoodPlaylist("focus", "soft ambient without rock", 10);
  const energyMix = generateMoodPlaylist("energy", "dance house", 10);
  assert.equal(focusMix.length, 10);
  assert.equal(new Set(focusMix.map(item => item.slug)).size, 10);
  assert.ok(focusMix.every(item => item.genre !== "Rock"));
  assert.ok(focusMix.some(item => item.genre === "Ambient"));
  assert.notDeepEqual(focusMix.map(item => item.slug), energyMix.map(item => item.slug));
  assert.deepEqual(focusMix, generateMoodPlaylist("focus", "soft ambient without rock", 10));
  assert.notDeepEqual(focusMix, generateMoodPlaylist("focus", "soft ambient without rock", 10, 1));
  for (const pick of [...focusMix, ...energyMix]) {
    assert.ok(records.some(item => item.slug === pick.slug) || ["m3tta", "mira-sol"].includes(pick.slug));
    assert.ok(existsSync(new URL(`../public/${pick.image}`, import.meta.url)));
    assert.ok(pick.reason);
  }
  assert.equal(generateMoodPlaylist("unwind", "", 6).length, 6);
  assert.equal(generateMoodPlaylist("focus", "no ambient no electronic no jazz no folk no rock no pop no experimental no hip-hop no spoken", 10).length, 0);
  const { parsePlaylists, playlistName, addPlaylistItem, removePlaylistItem, playlistStorageKey } = await server.ssrLoadModule("/src/data/playlists.ts");
  assert.deepEqual(parsePlaylists("invalid JSON"), []);
  assert.deepEqual(parsePlaylists('{"not":"an array"}'), []);
  assert.throws(() => playlistName("   "));
  assert.equal(playlistName("  Night discoveries  "), "Night discoveries");
  const storedPlaylist = { id: "night-test", name: "Night discoveries", items: [records[0].slug, records[0].slug] };
  const initialPlaylists = parsePlaylists(JSON.stringify([storedPlaylist, { ...storedPlaylist }, { id: "bad" }]));
  assert.equal(initialPlaylists.length, 1);
  assert.deepEqual(initialPlaylists[0].items, [records[0].slug]);
  const added = addPlaylistItem(initialPlaylists, "night-test", "m3tta");
  assert.deepEqual(addPlaylistItem(added, "night-test", "m3tta"), added);
  assert.deepEqual(removePlaylistItem(added, "night-test", records[0].slug)[0].items, ["m3tta"]);
  assert.deepEqual(initialPlaylists[0].items, [records[0].slug], "Playlist edits must not mutate previous state");
  globalThis.localStorage = { getItem: key => key === playlistStorageKey ? JSON.stringify(added) : null };
  globalThis.window = { location: { hash: "#/playlist/night-test" } };
  const playlist = renderToString(React.createElement(App));
  assert.ok(playlist.includes("Night discoveries"));
  assert.ok(playlist.includes("No audio playback"));
  assert.ok(playlist.includes("Remove M3TTA from playlist"));
  assert.equal((playlist.match(/class="release"/g) || []).length, 2);
  const storedGenreMix = { id: "genre-test", name: "Jazz + Folk mix", items: genreMix.map(item => item.slug), genres: ["Jazz", "Folk"] };
  assert.deepEqual(parsePlaylists(JSON.stringify([storedGenreMix]))[0].genres, ["Jazz", "Folk"]);
  const storedMix = { id: "focus-test", name: "In the flow", items: focusMix.map(item => item.slug), mood: "Focus", prompt: "soft ambient without rock" };
  assert.equal(parsePlaylists(JSON.stringify([storedMix]))[0].mood, "Focus");
  globalThis.localStorage = { getItem: key => key === playlistStorageKey ? JSON.stringify([storedMix, ...added]) : null };
  globalThis.window = { location: { hash: "#/playlist/focus-test" } };
  const mixPage = renderToString(React.createElement(App));
  assert.ok(mixPage.includes("Focus<!-- --> mood mix") || mixPage.includes("Focus mood mix"));
  assert.ok(mixPage.includes("Your saved mix sequence"));
  const renderedSlugs = [...mixPage.matchAll(/class="release"[^>]*href="#\/artist\/([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(renderedSlugs, storedMix.items);
  globalThis.window = { location: { hash: "#/playlists" } };
  assert.ok(renderToString(React.createElement(App)).includes("Night discoveries"));
  globalThis.localStorage = { getItem: () => null };
  assert.ok(renderToString(React.createElement(App)).includes("Create your first playlist"));
  globalThis.window = { location: { hash: "#/playlist/missing" } };
  assert.ok(renderToString(React.createElement(App)).includes("Playlist not found"));
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
