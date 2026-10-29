# DBD — Design Brief Documentation (Dokumen Panduan Desain)
## KARTIKA: Kepatuhan Audit Risiko & Teknologi Informasi Keamanan Aplikasi
*(Tactical Command Center Visual Constitution & Anti-Slop Guidelines)*

---

### Informasi Dokumen / Document Information
* **ID Dokumen / Document ID**: `KARTIKA-DOC-DBD-01`
* **Versi / Version**: 1.0.0
* **Status**: Disetujui / Approved
* **Klasifikasi / Classification**: Terbatas / Restricted
* **Standar Acuan / Reference Standard**: `miqdadbadjuber/Anti-Slop` Constitution & Universal Frontend Design System

---

## 1. Arah Desain & Filosofi Visual / Aesthetic Direction

KARTIKA mengusung konsep visual **Tactical Command Center & Professional Defense Grade**. Karakter visual dirancang untuk mencerminkan presisi militer, ketahanan siber, dan keabsahan hukum formal:
* **Fokus Informasi Tinggi**: Mengeliminasi distorsi ornamen yang tidak perlu; data kerentanan dan pasal hukum menjadi pusat perhatian utama.
* **Kontras Terukur**: Permukaan gelap bertingkat tunggal (*single-elevation dark canvas*) dengan garis batas halus (*hairline border 1px*) yang tajam dan bersih.
* **Ketegasan Tipografi**: Hierarki keterbacaan yang kuat untuk membedakan antara judul eksekutif, pasal undang-undang, dan baris kode eksploitasi teknis.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   TACTICAL COMMAND COLOR HIERARCHY (60-30-10)               │
├─────────────────────────────────────────────────────────────────────────────┤
│  60% DOMINANT CANVAS:                                                       │
│  - Deep Dark Slate (#090D16) -> Latar belakang utama aplikasi               │
│                                                                             │
│  30% STRUCTURAL SURFACES & BORDERS:                                         │
│  - Command Bar & Sidebar (#0B1120)                                          │
│  - Card Surfaces (#0D1526)                                                  │
│  - Hairline Separators (#1E293B / rgba(255,255,255,0.08))                   │
│                                                                             │
│  10% ACCENT BUDGET & SEMANTIC STATES:                                       │
│  - Tactical Navy (#2563EB) & Cyan (#06B6D4) -> Primary Actions & Active Tabs│
│  - Semantic Crimson (#EF4444) -> Kritis / Vulnerability Alert               │
│  - Semantic Amber (#F59E0B)   -> Waspada / PII Warning                      │
│  - Semantic Emerald (#10B981) -> Patuh / Encrypted / Verified Secure        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Tipografi & Disiplin Angka Tabular / Typography & Tabular Figures

KARTIKA menerapkan **Aturan 2+1 Font**:
1. **Font Display & Antarmuka Utama**: `Plus Jakarta Sans`
   * Digunakan untuk judul dasbor, navigasi menu, dan teks deskripsi. Karakter geometris modern dengan legibilitas tinggi pada ukuran teks 12px–18px.
2. **Font Body & Dokumen Laporan**: `Plus Jakarta Sans` / `Inter-Free Clean Sans`
   * Digunakan untuk teks pasal hukum UU PDP, penjelasan audit, dan rekomendasi remediasi.
3. **Font Telemetri, Kode & Angka Data**: `JetBrains Mono` (`font-mono tabular-nums`)
   * Wajib digunakan untuk semua representasi angka metrik (persentase skor, jumlah temuan), alamat IP, nomor port, timestamp, payload query SQL, dan hash enkripsi. Menjamin seluruh angka sejajar secara vertikal (*zero horizontal jitter*).

```css
/* Penerapan Tabular Figures pada Index CSS */
@layer base {
  :root {
    --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  }
  
  code, pre, .font-mono {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
  }
}
```

---

## 3. Kontrak Bilah Navigasi Atas / Top Bar Contract

Sesuai aturan antarmuka profesional, bilah navigasi atas mengikuti **Kontrak 3-Zona Satu Baris**:

$$\text{[Zona 1: Wordmark Tunggal]} \quad\text{—}\quad \text{[Zona 2: Telemetri & Acuan Regulasi]} \quad\text{—}\quad \text{[Zona 3: Pengalih Peran Multi-Persona]}$$

* **Zona 1 (Kiri)**: Identitas brand tunggal `KARTIKA` dengan lencana versi monospasi `v1.0-DEF` dan deskripsi singkat satu baris.
* **Zona 2 (Tengah)**: Status telemetri acuan hukum (`UU PDP No. 27/2022 · BSSN SPBE`), status enkripsi AES-256 kredensial, dan penghitung sesi aktif.
* **Zona 3 (Kanan)**: Pengalih peran interaktif (*Role Switcher*) dalam kontrol tersegmentasi untuk memilih persona `Auditor IT`, `Legal Officer`, atau `Komandan`.

---

## 4. Konstitusi Anti-Slop (Anti-Slop Mandates)

KARTIKA dibangun dengan mematuhi secara ketat 6 pilar anti-slop dari repositori **`miqdadbadjuber/Anti-Slop`**:

| Larangan AI Slop | Implementasi pada KARTIKA |
| :--- | :--- |
| **BANNED: Sparkle / Wand Icons** | Menggunakan 100% ikon domain keamanan siber dan hukum: `Shield`, `ShieldAlert`, `Bug`, `Database`, `Lock`, `Scale`, `Terminal`, `FileText`. |
| **BANNED: Purple/Indigo AI Gradients** | Menggunakan palet gelap *Command Slate* (`#090D16`, `#0D1526`) dengan aksen taktis biru militer dan cyan tajam. |
| **BANNED: Pill Badge Sandwiches** | Metadata teks disajikan tanpa kapsul gelembung tebal. Menggunakan teks tipografis bersih dengan pemisah titik tengah (`·`) atau garis miring (`/`). |
| **BANNED: Code-Comment Headers** | Seluruh judul bagian menggunakan bahasa Indonesia formal profesional (misal: `Ringkasan Postur Keamanan & Kepatuhan`), bukan sintaks komentar kode (`// 01 DASHBOARD`). |
| **BANNED: Dead Clicks & Mock Stubs** | Setiap tombol (`Uji Koneksi`, `Mulai Audit`, `Unduh Laporan PDF`, `Detail Temuan`, `Ubah Status`, `Role Switcher`) memiliki event handler aktif dan menghasilkan perubahan state riil. |
| **BANNED: Hallucinated Metrics** | Skor kepatuhan dan jumlah temuan dihitung berdasarkan formula matematis relasional yang terikat langsung pada data tabel `Temuan_Teknis`. |

---

## 5. Arsitektur Dokumen Cetak / Print Design Architecture (`@media print`)

Laporan Kesiapan Kepatuhan didesain khusus agar saat pengguna mencetak atau mengekspor ke format PDF:
1. **Transisi Kontras Otomatis**: Latar belakang aplikasi otomatis berubah menjadi putih bersih (`#ffffff`), teks berubah menjadi hitam legam (`#0f172a`), dan seluruh elemen navigasi (sidebar, topbar, tombol aksi) otomatis disembunyikan via kelas `.no-print`.
2. **Standar Tata Letak Lembar A4**: Menggunakan ukuran kertas A4 dengan margin terstandarisasi 1.5 cm.
3. **Pecahan Halaman Cerdas (`break-inside: avoid`)**: Kartu rincian temuan teknis tidak akan terpotong canggung di antara batas halaman.
4. **Elemen Formal Kenegaraan**: Memuat kop dokumen resmi instansi, nomor dokumen terverifikasi, klasifikasi *RAHASIA / TERBATAS*, dan blok tanda tangan otorisasi ganda.
