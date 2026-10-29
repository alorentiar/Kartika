# Modul Autentikasi & Manajemen Akun KARTIKA (Login & Register)

Rencana implementasi ini merinci penambahan sistem autentikasi lengkap pada platform KARTIKA, mencakup antarmuka Login, Registrasi Pengguna Baru, kredensial dummy siap pakai untuk 3 persona instansi, fitur Quick-Login satu klik, serta persistensi sesi lokal.

> [!IMPORTANT]
> **Keputusan Pengguna yang Dikonfirmasi**:
> 1. **Tombol Quick-Login**: Menyediakan tombol pengisian otomatis / *One-Click Quick Login* untuk 3 kredensial dummy persona (*Auditor IT*, *Legal Officer*, *Komandan Satuan*) agar penguji dapat langsung beralih akun tanpa mengetik manual.
> 2. **Persistensi Sesi**: Sesi pengguna tersimpan di `localStorage` peramban sehingga sesi tidak hilang saat halaman di-refresh. Tombol Logout tersedia untuk keluar dan membersihkan sesi.
> 3. **Registrasi Akun Instansi**: Formulir pendaftaran memuat pemilihan peran resmi (*IT Security*, *Legal Officer*, *Komandan Satuan*), nama lengkap, email instansi, nama instansi/satuan, jabatan struktural, serta konfirmasi kata sandi.

---

## 1. Ikhtisar & Kredensial Dummy

### Daftar Kredensial Dummy Siap Pakai:
| Peran (Role) | Nama & Jabatan | Email Dinas | Password | Hak Akses Utama |
| :--- | :--- | :--- | :--- | :--- |
| **IT Security / Auditor Siber** | Ahmad Fauzi, S.Kom., CEH<br>*(Lead Cyber Security Auditor)* | `ahmad.fauzi@tni-ad.mil.id` | `KartikaSec#2026` | DAST Engine, Uji Koneksi, Bukti Payload, Edit Status Remediasi |
| **Compliance & Legal Officer** | Maya Anggraini, S.H., LL.M<br>*(Chief Compliance & Legal Counsel)* | `maya.anggraini@kemhan.go.id` | `KartikaLegal#2026` | Matriks Regulasi UU PDP, Kalkulator Denda Pasal 57, Batas Waktu Pasal 46 |
| **Komandan Satuan / C-Level** | Kolonel (Inf) Bambang Wijaya<br>*(Komandan Satuan Siber)* | `bambang.wijaya@satuan.mil.id` | `KartikaKomandan#2026` | Dasbor Eksekutif, Pengesahan & Cetak Laporan PDF Resmi |

---

## 2. Pengalaman Pengguna & Desain Antarmuka (UX/UI)

### Alur Antarmuka
1. **Layar Masuk / Login View**:
   - Desain *Command Center* gelap berwibawa (`#090D16` / `#0B1120`).
   - Kartu kredensial dummy dengan tombol **"Quick Login"** instan untuk setiap persona.
   - Form input manual (Email dan Password) dengan opsi *toggle* lihat/sembunyikan kata sandi.
   - Tautan navigasi ke halaman **Registrasi Akun**.
2. **Layar Pendaftaran / Register View**:
   - Pilihan peran interaktif (*Security*, *Legal*, *Commander*).
   - Form registrasi instansi lengkap: Nama Lengkap, Email, Instansi/Satuan, Jabatan, Password.
   - Validasi formulir instan (panjang password minimal 6 karakter, format email valid).
   - Registrasi otomatis memasukkan akun baru ke dalam daftar `Pengguna` dan langsung mengarahkan ke Dasbor dengan sesi aktif.
3. **Menu Profil & Keluar (Logout)**:
   - Tombol *Log Out* di bilah samping (*Sidebar*) dan profil pengguna untuk mengakhiri sesi dan kembali ke layar login secara aman.

---

## 3. Arsitektur Komponen & Alur Data

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       KARTIKA AUTHENTICATION ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  AUTH ROUTER & STATE CONTROLLER:                                            │
│  - localStorage Token / Session Store (`kartika_active_user`)               │
│  - Auth Guard: Jika null -> Render AuthView (Login / Register Tabs)          │
│  - Auth Guard: Jika terotentikasi -> Render Main Tactical Dashboard         │
├───────────────────────────────┬─────────────────────────────────────────────┤
│  LOGIN COMPONENT              │  REGISTER COMPONENT                         │
│  - One-Click Quick Login Bar  │  - Persona Role Selector                    │
│  - Manual Email & Pass Form   │  - Instansi & Jabatan Fields                │
│  - Error Notice on Invalid    │  - Immediate Activation & Session Start     │
├───────────────────────────────┴─────────────────────────────────────────────┤
│  IMMUTABLE AUDIT TRAIL LOGGING:                                             │
│  - Setiap kejadian LOGIN, REGISTER, dan LOGOUT dicatat dalam log jejak audit│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Rencana Eksekusi Berkas

1. **`src/types/kartika.ts`**: Menambahkan properti password hash/terenkripsi pada antarmuka `Pengguna`.
2. **`src/data/defaultData.ts`**: Menambahkan password terenkripsi pada masing-masing akun dummy default.
3. **`src/components/auth/AuthPage.tsx`**: Komponen autentikasi terpadu (Tab Login & Tab Register, kartu kredensial dummy, quick login, dan validasi).
4. **`src/components/layout/Sidebar.tsx`**: Menambahkan tombol Logout interaktif dengan konfirmasi.
5. **`src/App.tsx`**: Menghubungkan sesi `currentUser` ke `localStorage` dengan penanganan login/logout serta pencatatan jejak audit.
