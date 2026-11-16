"""Collect public page metadata and images only. Never save or request audio."""
import concurrent.futures, html, json, pathlib, re, subprocess, tempfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
SEEDS=[
('the-hanging-stars','https://thehangingstars.bandcamp.com/album/just-a-day','Folk','Harmonies and twelve-string guitars connect country, folk, and psychedelic rock.'),
('vanessa-bedoret','https://vanessabedoret.bandcamp.com/album/about-time','Experimental','Explore the artist’s public release details and catalog.'),
('bon','https://soundsofbon.bandcamp.com/album/woven-in-light','Spoken Word','Spoken-word poetry and music explore life, light, and reflection.'),
('wil-bolton','https://wilbolton.bandcamp.com/album/margins','Ambient','Sustained harmonics, quiet melodies, and field recordings shape an immersive sound.'),
('paris-paloma','https://parispaloma.bandcamp.com/album/the-fatal-flaw','Pop','Songwriting moves between alternative pop, indie folk, and intimate storytelling.'),
('blue','https://officialblue.bandcamp.com/album/reflections','Pop','Explore the artist’s public release details and catalog.'),
('kirk-monteux','https://kirkmonteux.bandcamp.com/album/tales-from-far-away','Ambient','An astronomy-inspired ambient release with acoustic and electronic textures.'),
('polky','https://polkyband.bandcamp.com/album/mother-tongue','Folk','Polish folk traditions meet contemporary arrangements and fiddle-led ensemble playing.'),
('izerolite','https://izerolite.bandcamp.com/album/emergence','Electronic','Cinematic electronic production combines melodic ideas with festival-scale dance energy.'),
('hadamard','https://hadamard.bandcamp.com/album/ikeno','Electronic','Sci-fi electro combines synthesizers, bass-driven rhythms, and atmospheric passages.'),
('crooked-mouth','https://crooked-mouth.bandcamp.com/album/cosmic-folklore','Folk','Post-industrial folk draws together traditional music, drone, and psychedelic influences.'),
('andrew-firth','https://andrewfirth.bandcamp.com/album/copernicus','Ambient','Long-form ambient compositions take inspiration from astronomy and Mellotron textures.'),
('fortresses','https://fortressesmusic.bandcamp.com/album/here','Ambient','Sam Ashton explores memory and place through guitars, synthesizers, and field recordings.'),
('amy-hopwood','https://amyhopwood.bandcamp.com/album/gone-to-flowers','Folk','Folk songwriting explores endings, with touches of Americana and other traditions.'),
('hair-control','https://haircontrol.bandcamp.com/album/electric-pleasure','Electronic','A Calgary duo combining experimental dance-pop, synthesizers, and lo-fi production.'),
('ellen-stekert','https://ellenstekert.bandcamp.com/album/all-my-friends-a-queer-folk-songbook','Folk','Archival folk recordings revisit traditional songs and the Greenwich Village folk scene.'),
('the-departures','https://thedepartures.bandcamp.com/album/why-the-long-face','Rock','A Los Angeles band blending angular guitars, melodic hooks, and alternative rock.'),
('bandie','https://bandiemusic.bandcamp.com/album/slow-down','Rock','Los Angeles alternative rock balancing garage-punk energy with melodic restraint.'),
('the-darling-range','https://thedarlingrange.bandcamp.com/album/dearly','Rock','A Chicago-area band built around guitars, keyboards, and shared vocal arrangements.'),
('ballpark','https://ballparktheband.bandcamp.com/album/ballpark','Rock','Fort Collins musicians blend indie rock with progressive and jazz influences.'),
('modern-holiday','https://modernholiday.bandcamp.com/album/modern-holiday','Rock','Brooklyn and Queens indie rock mixing shoegaze, grunge, and power-pop textures.'),
('claud-six','https://claudsix.bandcamp.com/album/grab-a-shovel','Hip-Hop','Portland-based rapper Claud Six joins producer Big Jess on a collaborative release.'),
('focused','https://focusedrap.bandcamp.com/album/blind-sight','Hip-Hop','Toronto rap combining storytelling, spontaneous writing, and experimental approaches.'),
('paul-janoschka','https://pauljanoschka.bandcamp.com/album/trio','Jazz','Piano-led trio music brings together jazz improvisation and beat-based influences.'),
('chris-madsen','https://chrismadsen.bandcamp.com/album/threefold','Jazz','A saxophone, bass, and drums trio explores original contemporary jazz compositions.'),
]
def fetch(url):
 # Use the operating system curl trust store; keep TLS verification enabled.
 return subprocess.run(['curl','--fail','--location','--silent','--show-error','--max-time','35',url],check=True,capture_output=True).stdout
def clean(value):return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',value))).strip()
def extract(s,pattern):
 m=re.search(pattern,s,re.S);return html.unescape(m.group(1)).strip() if m else ''
def full_size_portrait(url):
 # Sidebar photos are 120px thumbnails; use the original for large hero images.
 return re.sub(r'_\d+(?=\.(?:jpg|png)(?:\?|$))', '_0', url)

def save_image(url,slug,kind):
 if not url:return ''
 if not re.match(r'https://[^/]*bcbits\.com/img/',url):return ''
 ext='.jpg'
 path=f'images/discovery/{slug}-{kind}{ext}'
 blob=fetch(full_size_portrait(url))
 if len(blob)<1000:raise ValueError('Image response too small')
 with tempfile.TemporaryDirectory() as tmp:
  original=pathlib.Path(tmp)/('image'+ext)
  original.write_bytes(blob)
  metadata=subprocess.check_output(['sips','-g','pixelWidth','-g','pixelHeight',str(original)],text=True)
  dimensions=[int(n) for n in re.findall(r'pixel(?:Width|Height): (\d+)',metadata)]
  # Never enlarge thumbnails. Use release artwork when a portrait is too small.
  if len(dimensions)!=2 or min(dimensions)<800:
   if kind=='portrait':return ''
   raise ValueError(f'{slug}: artwork too small: {dimensions}')
  subprocess.run(['sips','-Z','2000','-s','format','jpeg','-s','formatOptions','75',str(original)],check=True,capture_output=True)
  (ROOT/'public'/path).write_bytes(original.read_bytes())
 return path
def collect(seed):
 slug,url,genre,summary=seed
 s=fetch(url).decode('utf-8')
 m=re.search(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',s,re.S)
 if not m:raise ValueError(f'No public metadata for {slug}; not retrying access challenges')
 d=json.loads(m.group(1)); artist=d.get('byArtist',{}); publisher=d.get('publisher',{})
 image=d.get('image','');image=image[0] if isinstance(image,list) else image
 # The sidebar portrait belongs to the publisher; only use it when that is the actual artist.
 portrait=extract(s,r'<img[^>]*src="([^"]+)"[^>]*class="band-photo"') if publisher.get('name','').casefold()==artist.get('name','').casefold() else ''
 portrait=full_size_portrait(portrait)
 location=clean(extract(s,r'<span class="location secondaryText">(.*?)</span>')) if portrait else ''
 items=d.get('track',{}).get('itemListElement',[])
 tracks=[{'title':x['item'].get('name',''),'duration':x['item'].get('duration','')} for x in items if x.get('item',{}).get('name')]
 keywords=d.get('keywords',[])
 if isinstance(keywords,str):keywords=[x.strip() for x in keywords.split(',')]
 result={'slug':slug,'name':artist.get('name',''),'genre':genre,'summary':summary,'location':location,'tags':keywords[:8], 'sourceUrl':url,'artistUrl':artist.get('@id',url),'collectedAt':'2026-11-14','provenance':'Public Bandcamp release page; Discover feed was inaccessible.','artworkSource':image,'portraitSource':portrait,'artwork':save_image(image,slug,'release'),'portrait':save_image(portrait,slug,'portrait'),'release':{'title':d.get('name',''),'date':d.get('datePublished',''),'trackCount':d.get('numTracks',len(tracks)),'tracks':tracks}}
 if not result['name'] or not result['artwork']:raise ValueError(f'Incomplete metadata for {slug}')
 print(f'Collected {slug}: {result["name"]} / {len(tracks)} track titles',flush=True)
 return result
if __name__=='__main__':
 results=[]; failures=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
  futures={pool.submit(collect,s):s for s in SEEDS}
  for f in concurrent.futures.as_completed(futures):
   try:results.append(f.result())
   except Exception as e:failures.append({'slug':futures[f][0],'error':str(e)[:250]});print('FAILED',failures[-1],flush=True)
 order={s[0]:i for i,s in enumerate(SEEDS)};results.sort(key=lambda x:order[x['slug']])
 if failures or len(results)!=len(SEEDS):
  raise SystemExit('Collection incomplete; keeping the existing profile dataset unchanged. '+str(failures))
 # Keep source attribution in the collection report, outside the public app dataset.
 private_fields={'sourceUrl','artistUrl','provenance','artworkSource','portraitSource'}
 public_results=[{key:value for key,value in record.items() if key not in private_fields} for record in results]
 (ROOT/'src/data/discovery-artists.json').write_text(json.dumps(public_results,ensure_ascii=False,indent=2)+'\n')
 (ROOT/'docs/bandcamp-collection-report.json').write_text(json.dumps({'collected':len(results),'audioImported':False,'discoverFeedAccessible':False,'failures':failures,'sources':[{'artist':r['name'],'url':r['sourceUrl'],'artwork':r['artworkSource'],'portrait':r['portraitSource']} for r in results]},ensure_ascii=False,indent=2)+'\n')
 print(f'Finished: {len(results)} profiles; {len(failures)} failures; no audio requested.',flush=True)
