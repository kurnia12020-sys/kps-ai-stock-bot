import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
export async function proxy(request:NextRequest){let response=NextResponse.next({request});
const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if(!url||!key)return response;
const db=createServerClient(url,key,{cookies:{getAll(){return request.cookies.getAll()},setAll(changes){changes.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});changes.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}});
await db.auth.getClaims();return response;}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|webp)$).*)']};
