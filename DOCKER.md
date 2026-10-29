# Panduan Menjalankan KARTIKA Menggunakan Docker

Panduan ini menjelaskan cara mem-build (*build*), menjalankan (*run*), dan mengelola aplikasi **KARTIKA** (*Kepatuhan Audit Risiko & Teknologi Informasi Keamanan Aplikasi*) di dalam container Docker.

---

## 1. Prasyarat Sistem

Pastikan sistem Anda telah terpasang:
* **Docker Engine** (versi 20.10.x atau lebih baru)
* **Docker Compose** v2 (atau plugin `docker compose`)

---

## 2. Cara Cepat: Menggunakan Docker Compose (Direkomendasikan)

Metode ini adalah cara paling mudah untuk menjalankan aplikasi beserta konfigurasi *healthcheck* otomatis.

### A. Menjalankan Aplikasi
Buka terminal di direktori proyek dan jalankan:
```bash
docker compose up -d --build
```

### B. Memeriksa Status Container
```bash
docker compose ps
```
Hasil yang diharapkan:
```
NAME                      IMAGE                  COMMAND                  SERVICE       STATUS
kartika-audit-platform    kartika-audit:latest   "node server.js"         kartika-app   Up (healthy)
```

### C. Membuka Aplikasi
Buka browser dan akses:
```
http://localhost:3000
```

### D. Menghentikan Aplikasi
```bash
docker compose down
```

---

## 3. Cara Manual: Menggunakan Docker CLI

Jika Anda ingin mem-build dan menjalankan image secara manual tanpa Docker Compose:

### A. Build Docker Image
```bash
docker build -t kartika-app:latest .
```

### B. Jalankan Container
```bash
docker run -d \
  --name kartika-audit-instance \
  -p 3000:3000 \
  --restart unless-stopped \
  kartika-app:latest
```

### C. Memeriksa Log Container
```bash
docker logs -f kartika-audit-instance
```

### D. Menghentikan dan Menghapus Container
```bash
docker stop kartika-audit-instance
docker rm kartika-audit-instance
```

---

## 4. Endpoint Pemeriksaan Kesehatan (Healthcheck)

Container dilengkapi endpoint probe kesehatan bawaan untuk orkestrasi (Docker Swarm / Kubernetes / Cloud Run):
* **URL**: `http://localhost:3000/health`
* **Metode**: `GET`
* **Respon Contoh**:
  ```json
  {
    "status": "healthy",
    "app": "KARTIKA",
    "timestamp": "2026-10-28T18:35:00.000Z"
  }
  ```

---

## 5. Menjalankan di Port Berbeda

Jika port `3000` di komputer Anda telah digunakan oleh aplikasi lain, Anda dapat memetakan ke port lain (misal: `8080`):

**Via Docker CLI:**
```bash
docker run -d -p 8080:3000 --name kartika-audit kartika-app:latest
```
Akses di: `http://localhost:8080`

**Via Docker Compose:**
Ubah baris `ports` pada `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"
```

---

## 6. Spesifikasi Keamanan Container

Image Docker KARTIKA dibangun dengan standar keamanan *defense-grade*:
1. **Multi-Stage Build**: Menggunakan `node:22-alpine` berbobot ringan; seluruh dependensi build (*devDependencies*) dibuang dari image akhir.
2. **Non-Root Execution**: Container berjalan di bawah pengguna tidak memiliki hak istimewa (`USER node`) untuk memitigasi risiko eskalasi hak akses (*container breakout*).
3. **Penyajian Statis Aman**: Berkas frontend disajikan melalui server Express dengan pengaturan cache dan pembatasan akses direktori.
