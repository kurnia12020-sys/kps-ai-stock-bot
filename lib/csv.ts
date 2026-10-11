import type {Candle,Snapshot} from './technical';
// CSV format: date,open,high,low,close,volume (ascending or descending).
// Commas are separators; prices must be unformatted numbers.
export function parseOHLCVCSV(raw:string,ticker:string,source:string):Snapshot {
 const lines=raw.trim().replace(/^\uFEFF/,'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 if(lines.length<3)throw Error('Perlu header dan minimal dua baris OHLCV');
 const columns=lines.shift()!.toLowerCase().split(',').map(x=>x.trim());
 const required=['date','open','high','low','close','volume'];
 const idx=required.map(x=>columns.indexOf(x));if(idx.some(x=>x<0)||new Set(columns).size!==columns.length)throw Error('Header wajib: date,open,high,low,close,volume');
 const candles:Candle[]=lines.map((line,i)=>{const fields=line.split(',').map(x=>x.trim());if(fields.length!==columns.length)throw Error(`CSV baris ${i+2}: jumlah kolom tidak sesuai`);
 const get=(j:number)=>{const v=fields[idx[j]];if(!/^\d+(\.\d+)?$/.test(v))throw Error(`CSV baris ${i+2}: nilai numerik tidak valid`);return Number(v)};
 return {date:fields[idx[0]],open:get(1),high:get(2),low:get(3),close:get(4),volume:get(5)};});
 const dates=candles.map(c=>c.date).sort();return {ticker:ticker.trim().toUpperCase(),source:source.trim(),asOf:dates.at(-1)!,candles};
}
