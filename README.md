# KPS AI STOCK BOT V1.0 — Private

Website analisis saham pribadi. **Ini source code, belum terdeploy.** Data market otomatis, broker summary, dan foreign flow belum terintegrasi. Editor OHLCV memuat *angka fiktif sebagai contoh format* yang **tidak boleh dipakai sebagai harga pasar**.

## 1. Buat Supabase BARU
1. Supabase Dashboard → New Project (jangan pilih proyek KPS lama atau Wedding).
2. SQL Editor → jalankan `sql/schema.sql` pada proyek baru.
3. Authentication → Providers → Email, nonaktifkan **Allow new users to sign up** setelah membuat owner.
4. Authentication → Users → **Add user** → buat user owner, set email confirmed.
5. Salin UUID user owner ke `OWNER_USER_ID`. **UUID bukan email.**
6. Settings/API Keys: salin Project URL dan **publishable** key. Jangan pernah masukkan secret/service_role ke browser.
7. Authentication URL Configuration: Site URL = URL Vercel final; tambahkan localhost saat development bila diperlukan.

## 2. Environment
Copy `.env.example` → `.env.local`, isi Supabase URL, publishable key, UUID owner, AI_GATEWAY_API_KEY dan AI_MODEL. Untuk Vercel AI Gateway, buat key melalui dashboard gateway serta isi variable server-side `AI_GATEWAY_API_KEY`. Tidak ada endpoint untuk pengguna anonim.

## 3. Local development
```bash
npm install
npm run dev
# buka http://localhost:3000
npm run build
npm test
```
Node.js >=20.9. Jangan commit `.env.local`.

## 4. GitHub dan Vercel
1. Buat repo **private** baru di GitHub.
2. Upload semua file root dari direktori ini, bukan ZIP sebagai satu file. Pertahankan folder `app`, `lib`, `components`, `sql`.
3. Import repo di Vercel → Framework Next.js → Root directory `./`.
4. Tambahkan semua environment variables sesuai `.env.example` (nilai asli). 
5. Deploy; cek `/login`, `/dashboard`, `/chat`, `/analyze/BRMS` dan `/watchlist`.
6. Di Supabase atur Site URL agar sesuai domain deploy.

## 5. Tes keamanan dan fungsi
- Anonymous membuka `/dashboard` → redirect login; `/api/chat` dan `/api/snapshot` → 401.
- Akun bukan OWNER_USER_ID → tetap tidak dapat akses.
- Owner login, chat, logout; verifikasi riwayat tersimpan di DB. Chat membutuhkan AI Gateway berbayar/kuota sesuai provider.
- Coba masukkan data OHLCV sungguhan dengan sumber dan tanggal yang benar; cek MA dan volume. Angka contoh harus diganti.
- Uji smartphone; pastikan menu bawah tidak menutupi field chat.

## Catatan V1
- Tidak mengklaim real-time market data, tidak ada auto broker/foreign scanner.
- `verified=false` bermakna input user belum diverifikasi independen.
- Analisis ekstrem high/low 20 hari hanya indikator, bukan trading recommendation otomatis.
- Tanggal `asOf` wajib sesuai candle terakhir. Minimal 2 candle; MA20 memerlukan 20, rasio volume 20D memerlukan 21 candle.
- History V1 hanya daftar percakapan, belum membuka percakapan lama secara interaktif; chat baru menggunakan session ID baru.
- API `onFinish` menyimpan chat setelah respons selesai; kegagalan persistensi tidak menggagalkan teks chat. Periksa database bila history kosong.

## Struktur
- `app/(private)` halaman berlogin
- `app/api` endpoint dilindungi `owner()`
- `lib/technical.ts` kalkulasi deterministik
- `lib/supabase` klien server/browser
- `proxy.ts` refresh cookies di Next 16
- `sql/schema.sql` database dan RLS

**DISCLAIMER**: Edukasi bukan ajakan beli/jual. Semua keputusan investasi dan risiko menjadi tanggung jawab pengguna. DYOR.

## Upgrade V1.1 (input praktis & keputusan lebih aman)

- Analyzer menerima CSV `date,open,high,low,close,volume` dari ekspor data terpercaya, tanpa mengetik JSON.
- MA5, MA20, MA50, volume 3D dan ratio volume 20D dihitung deterministik.
- Evaluasi teknikal `LAYAK DIPANTAU / TUNGGU / DATA BELUM CUKUP` hanya dari angka input, **bukan** sinyal beli.
- Keputusan transaksi selalu `TUNGGU` sampai ada verifikasi harga, pemeriksaan broker jika relevan, penentuan tick size, dan risk/reward valid.
- Versi ini **belum** menarik data harga, foreign flow, atau broker summary secara otomatis. Penyedia data resmi/perizinan harus dipilih sebelum fitur ini bisa diaktifkan.
- Tidak ada perubahan skema SQL atau project Supabase lama yang diperlukan untuk upgrade ini.
