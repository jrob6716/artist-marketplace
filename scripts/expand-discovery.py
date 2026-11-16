"""Append curated public artist previews without changing existing profiles or importing audio."""
import concurrent.futures, importlib.util, json, pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('collector',ROOT/'scripts/collect-bandcamp.py')
collector=importlib.util.module_from_spec(spec);spec.loader.exec_module(collector)
SEEDS=[
 ('simon-herody','https://simonherody.bandcamp.com/album/water-from-mars','Jazz','Acoustic instruments and electronics meet in an imagined journey through space.'),
 ('binaural-space','https://binaural-space.bandcamp.com/album/neural-bloom','Electronic','Layered synthesizer compositions explore melodic patterns and shifting atmospheres.'),
 ('fritz-mayr','https://fritzmayr.bandcamp.com/album/droplets','Ambient','Berlin School sequences unfold through spacious synthesizers and gentle melodic movement.'),
 ('sunhyun-yoo','https://sunhyunyoo.bandcamp.com/album/plaide','Jazz','Saxophone-led quartet interplay opens into electronic textures and collective improvisation.'),
 ('nick-schofield','https://nickschofield.bandcamp.com/album/blue-hour','Ambient','Synthesizer textures and improvisation trace the quieter edges of electronic music.'),
 ('laurence-pike','https://laurencepike.bandcamp.com/album/possible-utopias-for-jazz-quintet','Jazz','Percussion and ensemble improvisation open a conversation between jazz and experimental sound.'),
 ('danxgerous','https://wwnbb.bandcamp.com/album/old-soul','Pop','Dreamy pop melodies and fingerpicked guitars frame reflective songwriting.'),
 ('static-soul','https://staticsoul.bandcamp.com/album/souliloquy','Hip-Hop','Rap, soulful production, and guest voices come together in a debut solo collection.'),
 ('bobbyy','https://bobbyy.bandcamp.com/album/tackyy','Electronic','Sampler-led production brings together adventurous beats, jazz, and a wide circle of collaborators.'),
 ('john-lebanon','https://johnlebanonmusic.bandcamp.com/album/kite-without-a-string','Folk','Twelve-string folk textures grow into layered indie rock and synth-driven arrangements.'),
 ('inland-years','https://inlandyears.bandcamp.com/album/nowadays','Rock','Concise songwriting blends jangling guitars, lo-fi textures, and folk influences.'),
 ('july-morning','https://julymorningmusic.bandcamp.com/album/the-colours-of-darkness','Rock','Sydney art rock draws together psychedelic color, folk influences, and progressive arrangements.'),
]
if __name__=='__main__':
 dataset=ROOT/'src/data/discovery-artists.json'
 records=json.loads(dataset.read_text());existing={r['slug'] for r in records}
 seeds=[s for s in SEEDS if s[0] not in existing]
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
  additions=list(pool.map(collector.collect,seeds))
 private={'sourceUrl','artistUrl','provenance','artworkSource','portraitSource'}
 for r in additions:r['collectedAt']='2026-11-16'
 records.extend({k:v for k,v in r.items() if k not in private} for r in additions)
 dataset.write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
 report_path=ROOT/'docs/bandcamp-collection-report.json'
 report=json.loads(report_path.read_text())
 report['sources'].extend({'artist':r['name'],'url':r['sourceUrl'],'artwork':collector.full_size_portrait(r['artworkSource']),'portrait':r['portraitSource'] if r['portrait'] else ''} for r in additions)
 report['collected']=len(records)
 report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 print(f'Added {len(additions)} artist previews; {len(records)+2} total artist spaces.')
