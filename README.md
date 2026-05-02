<div align="center">

```
██████╗ ██╗███╗   ███╗██████╗  █████╗ ███████╗███╗   ███╗██╗████████╗ █████╗
██╔══██╗██║████╗ ████║██╔══██╗██╔══██╗██╔════╝████╗ ████║██║╚══██╔══╝██╔══██╗
██████╔╝██║██╔████╔██║██████╔╝███████║███████╗██╔████╔██║██║   ██║   ███████║
██╔══██╗██║██║╚██╔╝██║██╔══██╗██╔══██║╚════██║██║╚██╔╝██║██║   ██║   ██╔══██║
██║  ██║██║██║ ╚═╝ ██║██████╔╝██║  ██║███████║██║ ╚═╝ ██║██║   ██║   ██║  ██║
╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝
```

### _"Setiap langkah punya cerita."_

**Platform sosial media niche untuk pendaki dan pecinta alam Indonesia — dan dunia.**

---

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

[![License: MIT](https://img.shields.io/badge/License-MIT-2d6b2d.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-3d8b3d.svg?style=flat-square)](CONTRIBUTING.md)
[![Made in Indonesia](https://img.shields.io/badge/Made_in-Indonesia-cc0001.svg?style=flat-square)](https://github.com)

</div>

---

## 🌿 Tentang Rimbasmita

**Rimbasmita** adalah _digital sanctuary_ bagi para pendaki dan pecinta alam. Platform ini dirancang bukan untuk viralitas, tapi untuk **kedalaman** — tempat berbagi kisah perjalanan yang bermakna, merefleksikan pertumbuhan diri melalui alam, dan membangun koneksi emosional sejati melalui storytelling.

> _Rimba_ — hutan, alam liar, petualangan  
> _Smita_ — senyum, ketenangan, refleksi

### Untuk Siapa?

| Pengguna                 | Kebutuhan                                                 |
| ------------------------ | --------------------------------------------------------- |
| 🥾 Pendaki Pemula        | Referensi persiapan & panduan jalur dari pengalaman nyata |
| 🏔️ Pendaki Berpengalaman | Dokumentasi perjalanan & berbagi wawasan mendalam         |
| 🌲 Pecinta Alam          | Slow travel, eksplorasi, dan koneksi dengan komunitas     |
| 🧘 Pencari Ketenangan    | Refleksi diri, ketenangan mental, jurnal pribadi          |

---

## ✨ Fitur Utama

### 📖 Story Creation System

- Editor kaya dengan dukungan **Markdown & WYSIWYG**
- Upload multiple gambar dengan preview instan
- Metadata lengkap: tingkat kesulitan, durasi, elevasi
- Klasifikasi mood: `calm` · `challenging` · `reflective`
- Tag fleksibel: sunrise, solo, extreme, spiritual
- Sistem **draft & publish** + edit & delete
- Bagian tips dan peringatan terpisah

### 📰 Story Feed System

- Feed personal berdasarkan **follows & minat**
- Global feed dengan cerita terbaru
- Sorting: terbaru · terpopuler · trending
- Infinite scroll + story preview cards yang elegan

### 🗺️ Trail Explorer

- Halaman explore dengan filter canggih
- Filter: lokasi · kesulitan · elevasi
- Halaman detail trail dengan cerita terkait
- Integrasi peta (opsional)

### 👤 User Profile System

- Profil publik lengkap dengan statistik
- Statistik: jumlah cerita · total likes · jalur dikunjungi
- Seksi cerita & cerita tersimpan
- Sistem **follow / unfollow**

### 💬 Social Interaction

- Like system (toggle)
- Komentar bersarang dengan replies
- Bookmark / save cerita
- Notifikasi: like baru · komentar baru · follower baru

### 📔 Personal Journal

- Mode privat (hanya terlihat oleh pemilik)
- Dashboard jurnal tersendiri
- Auto-save draft
- Tagging untuk refleksi personal

### 🔍 Search System

- Pencarian global di seluruh platform
- Kategori: cerita · pengguna · jalur
- Autocomplete & suggestion cerdas

### 🏅 Gamification

- Badge pencapaian: cerita pertama · mountain collector · milestone
- Leaderboard pengguna paling aktif

---

## 🛠️ Tech Stack

```
Frontend
├── Next.js 15        → App Router, Server Components, SSR/SSG
├── TypeScript        → Type safety & developer experience
├── Tailwind CSS      → Utility-first styling
└── Framer Motion     → Smooth, immersive animations

Backend & Database
├── Auth.js           → Google OAuth, session management
├── PostgreSQL        → Primary database
├── Prisma ORM        → Type-safe database client
└── Cloudinary        → Image storage & optimization

Infrastructure
└── Vercel            → Edge deployment, analytics
```

---

## 🚀 Memulai Proyek

### Prasyarat

- Node.js `v18+`
- PostgreSQL (lokal atau cloud: Neon, Railway, Supabase)
- Akun Google Cloud (untuk OAuth)
- Akun Cloudinary

### Instalasi

```bash
# 1. Clone repositori
git clone https://github.com/username/rimbasmita.git
cd rimbasmita

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Setup database
npx prisma generate
npx prisma db push

# 5. Seed data awal (opsional)
npx prisma db seed

# 6. Jalankan development server
npm run dev
```

Buka `http://localhost:3000` di browser.

---

## ⚙️ Environment Variables

Buat file `.env.local` di root project dengan konfigurasi berikut:

```env
# =====================
# DATABASE
# =====================
DATABASE_URL="postgresql://username:password@host:5432/rimbasmita"

# =====================
# AUTH.JS (NextAuth)
# =====================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"

# Google OAuth
# Dapatkan dari: https://console.cloud.google.com
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# =====================
# APP CONFIG
# =====================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Rimbasmita"
```

---

## 📁 Struktur Proyek

```
rimbasmita/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   └── login/               # Halaman login
│   ├── (main)/
│   │   ├── dashboard/           # Feed utama
│   │   ├── explore/             # Trail explorer
│   │   ├── journal/             # Jurnal pribadi
│   │   ├── create/              # Story editor
│   │   ├── story/[slug]/        # Detail cerita
│   │   └── profile/[username]/  # Profil pengguna
│   ├── api/                     # API Routes
│   │   ├── auth/[...nextauth]/  # Auth.js handler
│   │   ├── stories/             # CRUD cerita
│   │   ├── trails/              # CRUD jalur
│   │   ├── users/               # User management
│   │   └── upload/              # Image upload
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
│
├── components/                  # React components
│   ├── ui/                      # Base UI components
│   ├── story/                   # Story-related components
│   ├── trail/                   # Trail components
│   └── shared/                  # Shared components
│
├── lib/                         # Utilities
│   ├── prisma.ts                # Prisma client
│   ├── auth.ts                  # Auth configuration
│   ├── cloudinary.ts            # Image upload helpers
│   └── utils.ts                 # General utilities
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed data
│
└── public/                      # Static assets
```

---


## 🗺️ Peta Halaman

| Route                 | Deskripsi                             | Auth |
| --------------------- | ------------------------------------- | ---- |
| `/`                   | Landing page — hero, fitur, CTA       | ❌   |
| `/dashboard`          | Feed utama — cerita personal & global | ✅   |
| `/story/[slug]`       | Detail cerita dengan komentar         | ❌   |
| `/create`             | Editor cerita dengan upload gambar    | ✅   |
| `/profile/[username]` | Profil publik & statistik pengguna    | ❌   |
| `/explore`            | Trail explorer dengan filter          | ❌   |
| `/journal`            | Jurnal pribadi — hanya pemilik        | ✅   |

---

## 🎨 Design System

### Prinsip UI

- **Glassmorphism** dengan transparansi halus
- **Dark mode** sebagai default, light mode opsional
- Komponen **rounded-2xl** konsisten
- Transisi **300–500ms** yang smooth
- Fokus pada **readability** dan ketenangan

### Palet Warna

```css
/* Dark Mode */
--color-bg-primary: #071407; /* deep forest */
--color-bg-surface: #0a1f0a; /* dark green */
--color-accent: #3d8b3d; /* forest green */
--color-accent-light: #7ec87e; /* leaf green */
--color-text: #c8e6c8; /* soft green white */
--color-muted: #8faa8f; /* muted sage */

/* Light Mode */
--color-bg-primary: #f5f0e8; /* warm cream */
--color-bg-surface: #ede8df; /* soft beige */
--color-accent: #2d6b2d; /* deep green */
--color-text: #1a2e1a; /* dark forest */
```

### Typography

```css
/* Heading */
font-family: "Playfair Display", serif; /* Emosional & premium */

/* Body */
font-family: "DM Sans", sans-serif; /* Bersih & mudah dibaca */

/* Code / Mono */
font-family: "DM Mono", monospace; /* Technical content */
```

---

### Konvensi Commit

```
feat:     Fitur baru
fix:      Bug fix
docs:     Perubahan dokumentasi
style:    Perubahan styling/format
refactor: Refactoring kode
test:     Menambah tests
chore:    Update dependencies & konfigurasi
```

Baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan lengkap.

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah **MIT License** — lihat file [LICENSE](LICENSE) untuk detail.

---

<div align="center">

**Rimbasmita** dibuat dengan ❤️ untuk komunitas pendaki Indonesia dan dunia.

_"Bukan seberapa tinggi puncaknya, tapi seberapa dalam ceritanya."_

---

[🌐 Demo](https://rimbasmita.vercel.app) · [📖 Dokumentasi](https://docs.rimbasmita.com) · [🐛 Laporkan Bug](https://github.com/username/rimbasmita/issues) · [💡 Request Fitur](https://github.com/username/rimbasmita/discussions)

</div>
