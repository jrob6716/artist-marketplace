"""Collect 100 public artist names and profile images. No API credentials or audio."""
import concurrent.futures, gzip, hashlib, html, json, pathlib, re, subprocess, tempfile, unicodedata
ROOT=pathlib.Path(__file__).resolve().parents[1]
COUNT=100
SITEMAP='https://tidal.com/sitemaps/artists/artists-000.xml.gz'
def fetch(url):
 return subprocess.run(['curl','--fail','--location','--silent','--show-error','--max-time','30',url],check=True,capture_output=True).stdout
def normalized(name):return unicodedata.normalize('NFKC',name).casefold().strip()
def collect(url):
 page=fetch(url).decode()
 blocks=re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',page,re.S)
 artist=next((d for d in (json.loads(x) for x in blocks) if d.get('@type')=='MusicGroup'),None)
 if not artist or not artist.get('name') or not artist.get('image'):raise ValueError('Missing public artist name or image')
 name=html.unescape(artist['name']).strip()
 if not name or normalized(name) in existing_names:raise ValueError('Duplicate or empty artist name')
 image=artist['image']
 if not image.startswith('https://resources.tidal.com/images/'):raise ValueError('No public artist image')
 image=re.sub(r'\d+x\d+\.jpg$', '1280x1280.jpg',image)
 blob=fetch(image)
 if len(blob)<15000:raise ValueError('Image too small or placeholder')
 identity=url.rstrip('/').split('/')[-1]
 slug='spotlight-'+identity
 with tempfile.TemporaryDirectory() as tmp:
  path=pathlib.Path(tmp)/'image.jpg';path.write_bytes(blob)
  meta=subprocess.check_output(['sips','-g','pixelWidth','-g','pixelHeight',str(path)],text=True)
  dimensions=[int(x) for x in re.findall(r'pixel(?:Width|Height): (\d+)',meta)]
  if len(dimensions)!=2 or min(dimensions)<1000:raise ValueError('Image under 1000px')
  subprocess.run(['sips','-s','format','jpeg','-s','formatOptions','78',str(path)],check=True,capture_output=True)
  blob=path.read_bytes()
 local=f'images/discovery/{slug}-portrait.jpg'
 record={'slug':slug,'name':name,'genre':'Artist spotlight','summary':'Discover another artist world. This visual profile preview uses public artist information and imagery.','location':'','tags':['Artist spotlight'],'collectedAt':'2026-11-16','artwork':local,'portrait':local,'release':{'title':'Artist spotlight','date':'','trackCount':0,'tracks':[]}}
 source={'artist':name,'url':artist.get('url',url),'imageSource':image,'image':local,'width':dimensions[0],'height':dimensions[1],'sha256':hashlib.sha256(blob).hexdigest()}
 return record,source,blob
if __name__=='__main__':
 dataset=ROOT/'src/data/discovery-artists.json';records=json.loads(dataset.read_text())
 report_path=ROOT/'docs/tidal-collection-report.json'
 if report_path.exists():raise SystemExit('Collection report already exists; refusing duplicate import.')
 existing_names={normalized(r['name']) for r in records}
 urls=re.findall(r'<loc>(.*?)</loc>',gzip.decompress(fetch(SITEMAP)).decode())
 additions=[];sources=[];failures=[];blobs=[];seen_hashes=set()
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
  for start in range(0,min(len(urls),600),9):
   futures=[(url,pool.submit(collect,url)) for url in urls[start:start+9]]
   for url,future in futures:
    try:
     record,source,blob=future.result()
     if len(additions)>=COUNT:continue
     if normalized(record['name']) in existing_names or source['sha256'] in seen_hashes:continue
     additions.append(record);sources.append(source);blobs.append(blob)
     existing_names.add(normalized(record['name']));seen_hashes.add(source['sha256'])
     print(f'{len(additions):03}: {record["name"]} ({len(blob)//1024} KB)',flush=True)
    except Exception as error:
     failures.append({'url':url,'reason':str(error)[:140]})
   if len(additions)>=COUNT:break
 if len(additions)!=COUNT:raise SystemExit(f'Only {len(additions)} suitable artists; dataset unchanged.')
 for record,blob in zip(additions,blobs):(ROOT/'public'/record['portrait']).write_bytes(blob)
 # Put the new collection first while preserving all existing artist records.
 dataset.write_text(json.dumps(additions+records,ensure_ascii=False,indent=2)+'\n')
 report_path.write_text(json.dumps({'collectedAt':'2026-11-16','collected':len(additions),'sourceIndex':SITEMAP,'audioImported':False,'releaseMetadataImported':False,'sources':sources,'skipped':failures},ensure_ascii=False,indent=2)+'\n')
 print(f'Imported {len(additions)} public artist spotlights. Total artist spaces: {len(records)+len(additions)+2}.')
