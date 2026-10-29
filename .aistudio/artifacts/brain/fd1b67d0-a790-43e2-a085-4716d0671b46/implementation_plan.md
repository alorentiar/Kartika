# Mekanisme Basis Data PostgreSQL & Tools Scanner KARTIKA untuk Deployment VPS

Rencana ini merinci implementasi mekanisme basis data persisten PostgreSQL dan backend scanning tools yang dirancang khusus untuk deployment di server VPS (Virtual Private Server) menggunakan Docker Compose terpadu.

> [!IMPORTANT]
> **Keputusan Pengguna yang Dikonfirmasi**:
> 1. **Mesin Basis Data**: PostgreSQL terintegrasi via Docker Compose dengan volume data persisten (`kartika_pgdata`) dan skrip inisialisasi skema ERD otomatis (`init-db.sql`).
> 2. **Arsitektur Scanner**: Server-side REST API scanner langsung di backend Express Node.js (`/api/scan/*`) untuk inspeksi DAST (HTTP Security Headers, SSL/TLS handshake, OWASP checks) dan inspeksi PII schema.
> 3. **Orkestrasi Deployment VPS**: File `docker-compose.yml` multi-container terpadu (Service Web App + Service PostgreSQL) dengan healthcheck otomatis, konfigurasi *non-root*, dan panduan reverse proxy Nginx/SSL.

---

## 1. Arsitektur Basis Data PostgreSQL (VPS Data Layer)

### A. Skema Relasional 7 Entitas ERD & Inisialisasi Otomatis
File `init-db.sql` akan dimuat secara otomatis oleh container PostgreSQL pada inisialisasi pertama (`/docker-entrypoint-initdb.d/init-db.sql`), memuat:
1. `pengguna`: Profil otentikasi 3 persona instansi dengan password hash.
2. `target_sistem`: URL web & kredensial basis data (status terenkripsi AES-256).
3. `sesi_audit`: Rekam waktu, status pemindaian, dan riwayat progres.
4. `temuan_teknis`: Rincian celah OWASP Top 10 dan eksposur PII kolom plaintext.
5. `regulasi_hukum`: Katalog lengkap pasal-pasal kewajiban UU PDP No. 27/2022 & BSSN.
6. `pemetaan_kepatuhan`: Tabel persimpangan ($N:M$) menghubungkan temuan teknis ke sanksi hukum.
7. `laporan_kepatuhan`: Arsip dokumen resmi PDF yang diterbitkan.
8. `audit_trail`: Log aktivitas pengguna *immutable* dengan indeks waktu.

### B. Dual-Mode Database Adapter
Backend Express akan menggunakan modul koneksi adaptif:
* **Mode VPS / Docker**: Jika variabel lingkungan PostgreSQL (`DB_HOST` atau `DATABASE_URL`) terdeteksi, sistem menghubungkan ke pool PostgreSQL secara langsung.
* **Mode Pratinjau / Sandbox**: Jika koneksi PostgreSQL belum dikonfigurasi, sistem menggunakan fallback in-memory cache terstruktur sehingga pratinjau aplikasi tetap berjalan lancar tanpa error.

---

## 2. Mekanisme Tools Scanner Keamanan Backend (`/api/scan/*`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       KARTIKA BACKEND SCANNER ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  EXPRESS REST API ENDPOINTS:                                                │
│  - POST /api/scan/prober  --> Uji konektivitas host, latency & status port │
│  - POST /api/scan/dast    --> Inspeksi HTTP security headers, TLS & OWASP  │
│  - POST /api/scan/pii     --> Analisis regex NIK 16-digit & verifikasi     │
│                               enkripsi kolom basis data target              │
│  - GET  /api/db/health    --> Status koneksi database PostgreSQL            │
├─────────────────────────────────────────────────────────────────────────────┤
│  SCANNER ENGINE CORES:                                                      │
│  ┌─────────────────────────┐  ┌──────────────────────────────────────────┐  │
│  │ DAST Security Prober    │  │ PII Schema & Regex Inspector             │  │
│  │ - CSP, HSTS, X-Frame    │  │ - NIK Indonesia Pattern: ^[1-9][0-9]{15}$│  │
│  │ - TLS/SSL Certificate   │  │ - Medical Records ICD-10 Format          │  │
│  │ - Injection Indicators  │  │ - Encryption Verifier (Plaintext vs AES) │  │
│  └─────────────────────────┘  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **DAST Prober Engine (`/api/scan/dast`)**:
   - Melakukan request HTTP/HTTPS langsung dari server VPS ke target URL.
   - Mengaudit response header: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`.
   - Mengidentifikasi server disclosure (misal kebocoran versi Apache/Nginx).
   - Menghitung skor CVSS v3.1 dan merumuskan langkah remediasi teknis.
2. **PII Exposure Detector (`/api/scan/pii`)**:
   - Memeriksa nama tabel dan kolom sasaran (`nik`, `rekam_medis`, `diagnosis`, `gaji`, `rekening`).
   - Menganalisis sampel isi kolom dengan pola regex data kependudukan Indonesia dan rekam medis.
   - Memverifikasi apakah format data berstatus Plaintext atau Terenkripsi.
   - Secara otomatis menghubungkan temuan ke Pasal 35 & 39 UU PDP.

---

## 3. Orkestrasi Docker Compose untuk VPS

### Spesifikasi Layanan Docker Compose:
* **Service `kartika-db`**:
  - Image: `postgres:16-alpine`
  - Volume: `kartika_pgdata:/var/lib/postgresql/data` (Data persisten aman saat reboot/restart container)
  - Init Script: `./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql:ro`
  - Healthcheck: `pg_isready -U kartika_admin -d kartika_audit`
* **Service `kartika-app`**:
  - Image: `kartika-audit:latest` (Multi-stage build)
  - Depends On: `kartika-db` (condition: service_healthy)
  - Environment: `NODE_ENV=production`, `PORT=3000`, `DB_HOST=kartika-db`, `DB_PORT=5432`, `DB_USER=kartika_admin`, `DB_PASSWORD=...`, `DB_NAME=kartika_audit`
  - Port Forwarding: `3000:3000`

---

## 4. Panduan Deployment VPS (`VPS_DEPLOYMENT.md`)

Menyediakan panduan lengkap langkah demi langkah bagi sysadmin / DevOps:
1. Persiapan server VPS (Ubuntu 22.04 / 24.04 LTS atau Debian).
2. Instalasi Docker & Docker Compose plugin.
3. Konfigurasi firewall UFW (Port 22 SSH, 80 HTTP, 443 HTTPS, 3000 App).
4. Menjalankan stack dengan `docker compose up -d`.
5. Konfigurasi Nginx Reverse Proxy dan SSL Gratis (Let's Encrypt / Certbot) untuk domain instansi.
6. Prosedur backup dan restore basis data PostgreSQL (`pg_dump` / `pg_restore`).
