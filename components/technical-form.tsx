'use client';
import {useEffect,useState} from 'react';
import {parseOHLCVCSV} from '@/lib/csv';
import {technicalDecision} from '@/lib/decision';
import {analyze,type Snapshot} from '@/lib/technical';
const demo='date,open,high,low,close,volume\n2026-10-08,100,105,98,103,100000\n2026-10-09,103,106,101,104,120000';
export function TechnicalForm({ticker}:{ticker:string}){
 const [csv,setCsv]=useState(''),[source,setSource]=useState(''),[result,setResult]=useState<Record<string,unknown>|null>(null),[err,setErr]=useState(''),[saving,setSaving]=useState(false),[mode,setMode]=useState<'csv'|'json'>('csv'),[json,setJson]=useState(''),[last,setLast]=useState<Snapshot|null>(null);
 useEffect(()=>{setResult(null);setLast(null);fetch('/api/analyze?ticker='+encodeURIComponent(ticker)).then(r=>r.json()).then(x=>{if(x?.analysis)setResult({...x.analysis,verified:x.verified,previouslySaved:true})}).catch(()=>{})},[ticker]);
 function readSnapshot():Snapshot{if(!source.trim())throw Error('Masukkan sumber data asli, misalnya ekspor historis dari penyedia data.');return mode==='csv'?parseOHLCVCSV(csv,ticker,source):{...JSON.parse(json),ticker,source};}
 async function save(){setSaving(true);setErr('');try{const s=readSnapshot();const computed=analyze(s);if(s.candles.length<2)throw Error('Minimal dua candle');const res=await fetch('/api/snapshot',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(s)});const output=await res.json();if(!res.ok)throw Error(output.error||'Gagal menyimpan');setResult({...computed,verified:false});setLast(s)}catch(e){setErr(e instanceof Error?e.message:'Gagal membaca data')}finally{setSaving(false)}}
 const verdict=last?technicalDecision(last):null;
 return <div className="stack">
 <div className="notice">🔎 <b>Data sungguhan saja.</b> Tempel ekspor historis OHLCV, minimal 21 sesi untuk rasio volume, atau 50 sesi untuk MA50. Belum ada koneksi otomatis IDX dan data dari input ini tetap berstatus <b>BELUM TERVERIFIKASI INDEPENDEN</b>.</div>
 <div className="report"><h2>Input data {ticker}</h2><div className="row"><button type="button" className={mode==='csv'?'primary':'secondary-button'} onClick={()=>setMode('csv')}>Tempel CSV</button><button type="button" className={mode==='json'?'primary':'secondary-button'} onClick={()=>setMode('json')}>JSON (lanjutan)</button></div>
 <label>Sumber data asli<input value={source} onChange={e=>setSource(e.target.value)} placeholder="Contoh: ekspor historis dari penyedia data, tanggal akses..."/></label>
 {mode==='csv'?<><label>Data OHLCV CSV<textarea rows={11} value={csv} onChange={e=>setCsv(e.target.value)} placeholder={"date,open,high,low,close,volume\n2026-10-09,..."} spellCheck={false}/></label><details><summary>Contoh FORMAT CSV (angka simulasi, jangan digunakan untuk trading)</summary><pre className="sample">{demo}</pre></details></>:<label>Snapshot JSON<textarea rows={12} value={json} onChange={e=>setJson(e.target.value)} placeholder='{"ticker":"BRMS","source":"...","asOf":"YYYY-MM-DD","candles":[...]}' spellCheck={false}/></label>}
 <button className="primary" disabled={saving} onClick={save}>{saving?'Menghitung...':'Hitung dan Simpan Analisis'}</button>{err&&<p className="error" role="alert">{err}</p>}</div>
 {result&&<div className="report"><div className="row" style={{justifyContent:'space-between',alignItems:'center'}}><h2>Hasil · {String(result.ticker)}</h2><span className="status-wait">BELUM DIVERIFIKASI</span></div><small>{String(result.asOf)} • {String(result.source)}</small><div className="stats">{Object.entries(result).filter(([k])=>['close','changePct','ma5','ma20','ma50','volume','averagePrior3D','averagePrior20D','volumeRatio20D','support20','resistance20','trend'].includes(k)).map(([key,value])=><div className="stat" key={key}><small>{key}</small><strong>{value===null?'N/A':String(value)}</strong></div>)}</div>
 {verdict?<section className="decision"><h3>{verdict.status}</h3><p>{verdict.reasons.join(' • ')}</p><b>Keputusan transaksi: TUNGGU</b><p className="muted">{verdict.note}</p></section>:<p className="muted">Untuk keputusan teknikal terbaru, tempel data OHLCV aktual. Laporan tersimpan tidak menampilkan keputusan transaksi otomatis.</p>}
 <small>Support20/resistance20 hanya ekstrem historis, bukan area entry/TP otomatis. Disclaimer &amp; DYOR.</small></div>}
 </div>
}
