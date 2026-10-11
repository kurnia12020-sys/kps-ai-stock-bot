import 'server-only';
import { serverDb } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
export async function owner(){const db=await serverDb();const {data,error}=await db.auth.getClaims();const sub=data?.claims?.sub;const expected=process.env.OWNER_USER_ID;if(error||!sub||!expected||sub!==expected)return null;return {db,id:sub};}
export async function requireOwner(){const auth=await owner();if(!auth)redirect('/login');return auth;}
