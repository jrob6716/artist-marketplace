"""Add six curated hip-hop artist and release previews using public metadata and images."""
import concurrent.futures, importlib.util, json, pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('collector',ROOT/'scripts/collect-genre-releases.py')
collector=importlib.util.module_from_spec(spec);spec.loader.exec_module(collector)
ALBUMS=['496439179','244890547','81893085','71281371','192216890','308765026']
if __name__=='__main__':
 path=ROOT/'src/data/discovery-artists.json';records=json.loads(path.read_text())
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(lambda album:collector.collect(album,'Hip-Hop'),ALBUMS))
 by_slug={record['slug']:record for record in records}
 for record,source in results:
  if record['slug'] in by_slug:by_slug[record['slug']].update(record)
 known={record['name'].casefold().strip() for record in records}
 additions=[record for record,source in results if record['name'].casefold().strip() not in known]
 path.write_text(json.dumps(additions+records,ensure_ascii=False,indent=2)+'\n')
 (ROOT/'docs/hip-hop-collection-sources.json').write_text(json.dumps({'collectedAt':'2026-11-16','audioImported':False,'sources':[source for record,source in results]},ensure_ascii=False,indent=2)+'\n')
 print(f'Added {len(additions)} hip-hop artist previews.')
