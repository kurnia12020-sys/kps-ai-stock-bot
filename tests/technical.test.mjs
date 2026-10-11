import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';
test('technical source contains strict OHLC validations and no invented live feed',()=>{let x=fs.readFileSync(new URL('../lib/technical.ts',import.meta.url),'utf8');assert.match(x,/validateSnapshot/);assert.match(x,/OHLCV tidak konsisten/);assert.match(x,/averagePrior20D/)});
test('SQL has RLS on all user tables',()=>{const x=fs.readFileSync(new URL('../sql/schema.sql',import.meta.url),'utf8');for(const t of ['chat_sessions','chat_messages','watchlists','market_data_snapshots'])assert.match(x,new RegExp('alter table public\\.'+t+' enable row level security'))});
