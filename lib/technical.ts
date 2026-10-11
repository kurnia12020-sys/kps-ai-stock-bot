export type Candle={date:string;open:number;high:number;low:number;close:number;volume:number};
export type Snapshot={ticker:string;source:string;asOf:string;candles:Candle[]};
const round=(n:number)=>Math.round(n*100)/100;
export function validateSnapshot(input:Snapshot):Snapshot{
 if(!/^[A-Z0-9]{3,8}$/.test(input.ticker))throw Error('Kode saham tidak valid');
 if(!input.source.trim()||input.source.length>120)throw Error('Sumber wajib diisi');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(input.asOf)||Number.isNaN(Date.parse(input.asOf)))throw Error('Tanggal tidak valid');
 const seen=new Set<string>();
 if(input.candles.length<2||input.candles.length>400)throw Error('Minimal 2 dan maksimal 400 candle');
 for(const c of input.candles){if(!/^\d{4}-\d{2}-\d{2}$/.test(c.date)||Number.isNaN(Date.parse(c.date))||seen.has(c.date)||c.date>input.asOf)throw Error('Tanggal candle duplikat/invalid');seen.add(c.date);
 const a=[c.open,c.high,c.low,c.close,c.volume];if(a.some(x=>!Number.isFinite(x)||x<0)||Math.min(c.open,c.close,c.high,c.low)<=0||c.high<Math.max(c.open,c.close,c.low)||c.low>Math.min(c.open,c.close,c.high)||!Number.isInteger(c.volume))throw Error('OHLCV tidak konsisten');}
 const ordered=[...input.candles].sort((a,b)=>a.date.localeCompare(b.date));if(ordered.at(-1)?.date!==input.asOf)throw Error('Tanggal asOf harus sama dengan candle terakhir');return {...input,ticker:input.ticker.toUpperCase(),candles:ordered};
}
export function sma(values:number[],n:number){return values.length<n?null:round(values.slice(-n).reduce((a,b)=>a+b,0)/n)}
export function analyze(snapshot:Snapshot){const s=validateSnapshot(snapshot),cs=s.candles,last=cs.at(-1)!,previous=cs.at(-2)!,closes=cs.map(x=>x.close),vols=cs.map(x=>x.volume),prior=vols.slice(0,-1);
 const avg3=sma(prior,3),avg20=sma(prior,20);const change=round((last.close/previous.close-1)*100);
 const ratio=avg20&&avg20>0?round(last.volume/avg20):null;
 const highs=cs.slice(-20).map(x=>x.high),lows=cs.slice(-20).map(x=>x.low);
 return {ticker:s.ticker,source:s.source,asOf:s.asOf,close:last.close,previousClose:previous.close,open:last.open,high:last.high,low:last.low,changePct:change,ma5:sma(closes,5),ma20:sma(closes,20),ma50:sma(closes,50),volume:last.volume,averagePrior3D:avg3,averagePrior20D:avg20,volumeRatio20D:ratio,support20:cs.length>=20?Math.min(...lows):null,resistance20:cs.length>=20?Math.max(...highs):null,trend:closes.length<20?'DATA TERBATAS':last.close>(sma(closes,20)??0)?'DI ATAS MA20':'DI BAWAH/SETARA MA20',warning:cs.length<21?'Butuh setidaknya 21 candle untuk rata-rata volume 20 hari sebelumnya.':null,disclaimer:'Edukasi, bukan rekomendasi transaksi. DYOR.'};
}
