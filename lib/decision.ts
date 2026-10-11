import type {Snapshot} from './technical';import {analyze} from './technical';
export function technicalDecision(snapshot:Snapshot){const a=analyze(snapshot);
 const complete=a.ma50!==null&&a.volumeRatio20D!==null;
 const bullish=a.close>(a.ma20??Infinity)&&a.ma5!==null&&a.close>a.ma5&&a.volumeRatio20D!==null&&a.volumeRatio20D>=1.2;
 const weak=a.ma20!==null&&a.close<a.ma20&&a.volumeRatio20D!==null&&a.volumeRatio20D<0.8;
 const status=!complete?'DATA BELUM CUKUP':bullish?'LAYAK DIPANTAU':weak?'TUNGGU':'TUNGGU KONFIRMASI';
 const reasons=[`Harga ${a.close} ${a.ma20===null?'belum mempunyai MA20':a.close>a.ma20?'di atas MA20':'di bawah/setara MA20'}`,a.volumeRatio20D===null?'Volume 20D tidak cukup':`Volume ratio 20D ${a.volumeRatio20D}×`, 'Status broker/foreign belum diperiksa'];
 return {status,reasons,technicalOnly:true,decision:'TUNGGU',entry:null,tp1:null,tp2:null,cutLoss:null,riskReward:null,note:'Status ini hanya pemeringkatan teknikal dari input yang belum diverifikasi independen. Level trading tidak dihasilkan otomatis tanpa evaluasi support, tick size IDX, dan rasio risiko.'};
}
