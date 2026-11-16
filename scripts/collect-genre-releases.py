"""Collect public release metadata and high-resolution images for genre page mocks. No audio."""
import concurrent.futures, importlib.util, json, pathlib, re, subprocess, tempfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('tidal',ROOT/'scripts/collect-tidal.py')
tidal=importlib.util.module_from_spec(spec);spec.loader.exec_module(tidal)
ALBUMS=['569596764','563818141','565357871','576452519','563043987','43710473','59962969']
def metadata(url,kind):
 page=tidal.fetch(url).decode()
 for block in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',page,re.S):
  data=json.loads(block)
  if data.get('@type')==kind:return data
 raise ValueError(f'No public {kind} metadata: {url}')
def image(url,path):
 url=re.sub(r'\d+x\d+\.jpg$','1280x1280.jpg',url)
 if not url.startswith('https://resources.tidal.com/images/'):raise ValueError('Unexpected image source')
 blob=tidal.fetch(url)
 with tempfile.TemporaryDirectory() as tmp:
  temp=pathlib.Path(tmp)/'image.jpg';temp.write_bytes(blob)
  meta=subprocess.check_output(['sips','-g','pixelWidth','-g','pixelHeight',str(temp)],text=True)
  dims=[int(x) for x in re.findall(r'pixel(?:Width|Height): (\d+)',meta)]
  if len(dims)!=2 or min(dims)<1000:raise ValueError('Low resolution image')
  subprocess.run(['sips','-s','format','jpeg','-s','formatOptions','78',str(temp)],check=True,capture_output=True)
  (ROOT/'public'/path).write_bytes(temp.read_bytes())
 return url
def collect(album_id):
 url=f'https://tidal.com/album/{album_id}';album=metadata(url,'MusicAlbum')
 artist=album['byArtist'][0];artist_data=metadata(artist['url'],'MusicGroup')
 artist_id=artist['url'].rstrip('/').split('/')[-1];slug='genre-artist-'+artist_id
 cover=f'images/discovery/{slug}-release.jpg';portrait=f'images/discovery/{slug}-portrait.jpg'
 cover_source=image(album['image'],cover)
 try:portrait_source=image(artist_data['image'],portrait)
 except Exception:portrait='';portrait_source=''
 record={'slug':slug,'name':artist['name'],'genre':'Electronic','summary':'Explore this artist’s electronic music catalog through a public release preview.','location':'','tags':['Electronic'],'collectedAt':'2026-11-16','artwork':cover,'portrait':portrait,'release':{'title':album['name'],'date':album.get('datePublished',''),'trackCount':0,'tracks':[]}}
 source={'artist':artist['name'],'artistUrl':artist['url'],'releaseUrl':url,'artwork':cover_source,'portrait':portrait_source,'trackMetadataAvailable':False}
 print(artist['name'],album['name'],flush=True)
 return record,source
if __name__=='__main__':
 path=ROOT/'src/data/discovery-artists.json';existing=json.loads(path.read_text())
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(collect,ALBUMS))
 slugs={r['slug'] for r in existing}
 additions=[r for r,s in results if r['slug'] not in slugs]
 path.write_text(json.dumps(additions+existing,ensure_ascii=False,indent=2)+'\n')
 (ROOT/'docs/genre-page-sources.json').write_text(json.dumps({'collectedAt':'2026-11-16','audioImported':False,'layoutReferences':['https://tidal.com/view/pages/explore','https://tidal.com/view/pages/genre_dance_electronic'],'sources':[s for r,s in results]},ensure_ascii=False,indent=2)+'\n')
