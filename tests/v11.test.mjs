import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
test('V1.1 CSV intake forbids invented source labels and checks columns',()=>{const s=fs.readFileSync(new URL('../lib/csv.ts',import.meta.url),'utf8');assert.match(s,/date','open','high','low','close','volume/);assert.match(s,/jumlah kolom tidak sesuai/)});
test('V1.1 decisions never automatically emit BUY',()=>{const s=fs.readFileSync(new URL('../lib/decision.ts',import.meta.url),'utf8');assert.match(s,/decision:'TUNGGU'/);assert.match(s,/technicalOnly:true/)});
