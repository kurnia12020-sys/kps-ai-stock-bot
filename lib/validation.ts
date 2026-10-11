import {z} from 'zod';
export const candleSchema=z.object({date:z.string(),open:z.number(),high:z.number(),low:z.number(),close:z.number(),volume:z.number()});
export const snapshotSchema=z.object({ticker:z.string().trim().toUpperCase().min(3).max(8),source:z.string().trim().min(2).max(120),asOf:z.string(),candles:z.array(candleSchema).min(2).max(400)});
