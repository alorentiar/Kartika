# Panduan Lengkap Deployment KARTIKA di Server VPS
## Arsitektur Produksi: Docker Compose, PostgreSQL 16 Persisten & Nginx SSL

Panduan ini ditujukan bagi Administrator Siber, DevOps, dan Sysadmin untuk men-deploy platform **KARTIKA** (*Kepatuhan Audit Risiko & Teknologi Informasi Keamanan Aplikasi*) pada server VPS (*Virtual Private Server*) berbasis Linux (Ubuntu 22.04 / 24.04 LTS atau Debian 12).

---

## 1. Spesifikasi Minimum Server VPS

* **CPU**: Minimal 2 vCPU (Disarankan 4 vCPU untuk pemindaian skala menengah)
* **RAM**: Minimal 4 GB RAM (Disarankan 8 GB RAM)
* **Penyimpanan**: Minimal 25 GB SSD/NVMe
* **Sistem Operasi**: Ubuntu 22.04 / 24.04 LTS (x86_64 atau ARM64)
* **Jaringan**: 1 Alamat IP Publik Statis & Nama Domain / Subdomain (misal: `audit.instansi.go.id`)

---

## 2. Diagram Topologi Jaringan Deployment VPS

```
               INTERNET / PENGGUNA (AUDITOR & PIMPINAN)
                                  │
                                  ▼ [Port 443 HTTPS / Port 80 HTTP]
┌─────────────────────────────────────────────────────────────────────────────┐
│ SERVER VPS (UBUNTU LINUX)                                                   │
│                                                                             │
│  FIREWALL (UFW): Hanya membuka Port 22 (SSH), Port 80, dan Port 443        │
│                                                                             │
│  NGINX REVERSE PROXY & CERTBOT (SSL Let's Encrypt):                         │
│  - Terminasi TLS 1.3 / HSTS 31536000                                        │
│  - Proxy Pass ke -> http://127.0.0.1:3000                                   │
│                                                                             │
│  DOCKER COMPOSE ORCHESTRATION:                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ DOCKER BRIDGE NETWORK: kartika_default                                │  │
│  │                                                                       │  │
│  │  [Service 1: kartika-app]             [Service 2: kartika-db]         │  │
│  │  - Node.js 22 Runtime                 - PostgreSQL 16 Alpine          │  │
│  │  - Express REST API Scanner           - Volume: kartika_pgdata        │  │
│  │  - Frontend Web UI (Port 3000)        - Inisialisasi: init-db.sql     │  │
│  │  - Non-root user (node)               - Port 5432 (Terisolasi lokal)  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Langkah 1: Persiapan Server VPS & Update Sistem

Login ke VPS Anda via SSH sebagai user `root` atau user dengan hak akses `sudo`:
```bash
ssh root@IP_PUBLIC_VPS
```

Lakukan pembaruan repositori paket sistem operasi:
```bash
apt update && apt upgrade -y
apt install -y curl wget git ufw htop ca-certificates gnupg lsb-release
```

---

## 4. Langkah 2: Instalasi Docker Engine & Docker Compose

Pasang repositori resmi Docker untuk mendapatkan versi stabil terbaru:
```bash
# Tambahkan GPG key resmi Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Tambahkan repositori Docker ke APT sources
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

# Pasang Docker CE dan plugin Compose
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Aktifkan service Docker agar otomatis berjalan saat VPS reboot
systemctl enable --now docker
```

Verifikasi instalasi:
```bash
docker --version
docker compose version
```

---

## 5. Langkah 3: Konfigurasi Firewall Server (UFW)

Terapkan prinsip *Defense-in-Depth*. Hanya buka port yang benar-benar dibutuhkan:
```bash
# Kebijakan bawaan: tolak koneksi masuk, izinkan koneksi keluar
ufw default deny incoming
ufw default allow outgoing

# Izinkan SSH (pastikan port SSH Anda benar sebelum mengaktifkan)
ufw allow 22/tcp

# Izinkan HTTP dan HTTPS untuk Nginx web server
ufw allow 80/tcp
ufw allow 443/tcp

# Aktifkan firewall
ufw --force enable
ufw status verbose
```
> **Catatan Keamanan**: Port PostgreSQL (`5432`) **tidak dibuka** ke internet publik karena dibatasi pada `127.0.0.1` dan jaringan internal Docker untuk mencegah serangan brute-force dari luar.

---

## 6. Langkah 4: Menyiapkan Proyek KARTIKA di VPS

Buat direktori kerja di `/opt/kartika`:
```bash
mkdir -p /opt/kartika
cd /opt/kartika
```

Salin atau clone seluruh berkas proyek KARTIKA ke direktori ini. Pastikan berkas berikut ada:
* `Dockerfile`
* `docker-compose.yml`
* `init-db.sql`
* `package.json`
* `server.js`
* `src/`
* `index.html`
* `vite.config.ts`

Pastikan izin berkas skrip inisialisasi database dapat dibaca:
```bash
chmod 644 init-db.sql
```

---

## 7. Langkah 5: Menjalankan Stack dengan Docker Compose

Jalankan container KARTIKA dan basis data PostgreSQL di latar belakang:
```bash
docker compose up -d --build
```

Periksa status container:
```bash
docker compose ps
```
Hasil yang diharapkan:
```
NAME                    IMAGE                  COMMAND                  SERVICE       STATUS
kartika-postgres-db     postgres:16-alpine     "docker-entrypoint.s…"   kartika-db    Up (healthy)
kartika-audit-platform  kartika-audit:latest   "node server.js"         kartika-app   Up (healthy)
```

Periksa log inisialisasi basis data PostgreSQL untuk memastikan 7 tabel ERD dan data awal telah ter-seed:
```bash
docker compose logs -f kartika-db
```

Uji respons lokal dari terminal VPS:
```bash
curl -I http://localhost:3000/health
```
Respon harus menghasilkan `HTTP/1.1 200 OK` dengan payload JSON `{ "status": "healthy", ... }`.

---

## 8. Langkah 6: Konfigurasi Nginx Reverse Proxy & SSL Gratis (HTTPS)

Untuk menyajikan aplikasi ke publik dengan enkripsi TLS dan domain resmi instansi:

### A. Instal Nginx dan Certbot
```bash
apt install -y nginx certbot python3-certbot-nginx
```

### B. Buat Konfigurasi Blok Server Nginx
Ganti `audit.instansi.go.id` dengan domain/subdomain Anda:
```bash
nano /etc/nginx/sites-available/kartika.conf
```

Tempel konfigurasi berikut:
```nginx
server {
    listen 80;
    server_name audit.instansi.go.id;

    # Pembatasan ukuran unggahan dokumen & payload
    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

Aktifkan konfigurasi:
```bash
ln -s /etc/nginx/sites-available/kartika.conf /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### C. Pasang Sertifikat SSL Gratis (Let's Encrypt)
Pastikan DNS A-Record domain Anda telah mengarah ke IP Publik VPS, lalu jalankan:
```bash
certbot --nginx -d audit.instansi.go.id
```
Pilih opsi **Redirect HTTP to HTTPS (otomatis)**. Certbot akan memperbarui konfigurasi Nginx dan mengatur auto-renewal otomatis.

---

## 9. Prosedur Backup & Restore Basis Data PostgreSQL

### A. Melakukan Backup Berkala (pg_dump)
Jalankan perintah ini untuk mengekspor cadangan basis data ke berkas SQL berstempel tanggal:
```bash
mkdir -p /opt/kartika/backups
docker exec -t kartika-postgres-db pg_dump -U kartika_admin kartika_audit > /opt/kartika/backups/kartika_backup_$(date +%F_%H%M).sql
```

### B. Otomatisasi Backup Harian via Crontab
Buka crontab:
```bash
crontab -e
```
Tambahkan baris berikut untuk melakukan backup setiap hari pukul 02:00 WIB:
```cron
0 2 * * * docker exec -t kartika-postgres-db pg_dump -U kartika_admin kartika_audit > /opt/kartika/backups/kartika_backup_$(date +\%F).sql
```

### C. Melakukan Restore Basis Data
Jika terjadi insiden dan data perlu dipulihkan:
```bash
cat /opt/kartika/backups/nama_file_backup.sql | docker exec -i kartika-postgres-db psql -U kartika_admin -d kartika_audit
```

---

## 10. Perintah Operasional Rutin (Cheat Sheet)

| Kebutuhan Operasional | Perintah Bash |
| :--- | :--- |
| **Melihat Log Aplikasi & Scanner** | `docker compose logs -f kartika-app` |
| **Melihat Log Basis Data PostgreSQL** | `docker compose logs -f kartika-db` |
| **Restart Seluruh Stack** | `docker compose restart` |
| **Update Kode & Rebuild** | `docker compose up -d --build` |
| **Menghentikan Layanan** | `docker compose down` |
| **Cek Penggunaan CPU/RAM** | `docker stats` |
| **Masuk ke Shell PostgreSQL** | `docker exec -it kartika-postgres-db psql -U kartika_admin -d kartika_audit` |

Platform KARTIKA Anda kini telah beroperasi secara penuh di VPS dengan basis data PostgreSQL persisten dan modul scanning DAST/PII yang siap digunakan!
