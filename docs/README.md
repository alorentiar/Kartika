# Repositori Dokumentasi Proyek KARTIKA
## Kepatuhan Audit Risiko & Teknologi Informasi Keamanan Aplikasi
*(Application Security, Risk Audit & Regulatory Compliance Automated System)*

---

Repositori ini memuat seluruh rangkaian dokumentasi resmi rekayasa perangkat lunak sistem **KARTIKA** sesuai dengan standar tata kelola teknologi informasi dan kerangka regulasi pelindungan data pribadi nasional (**UU No. 27 Tahun 2022 / UU PDP**) serta pedoman keamanan **Badan Siber dan Sandi Negara (BSSN)**.

Seluruh dokumen disusun dalam format **Dwibahasa (Bilingual: Bahasa Indonesia & English)** serta dilengkapi diagram arsitektur visual **ASCII** dan **Mermaid**.

---

## Indeks Dokumen Proyek / Project Documentation Index

| Kode Dokumen | Nama Dokumen | Berkas Markdown | Ringkasan Isi |
| :---: | :--- | :--- | :--- |
| **PRD** | **Product Requirement Documentation**<br>*(Dokumen Kebutuhan Produk)* | [`PRD_Product_Requirement_Documentation.md`](./PRD_Product_Requirement_Documentation.md) | Visi produk, sasaran pengguna (IT Security, Legal, Komandan Satuan), kebutuhan fungsional (FR-01 s.d. FR-07), kebutuhan non-fungsional, dan metrik keberhasilan produk. |
| **TRD** | **Technical Requirement Documentation**<br>*(Dokumen Kebutuhan Teknis)* | [`TRD_Technical_Requirement_Documentation.md`](./TRD_Technical_Requirement_Documentation.md) | Arsitektur teknis sistem, spesifikasi DAST Engine (OWASP Top 10), Detektor Eksposur PII Indonesia (Regex NIK & Rekam Medis), Cryptographic Verifier, Mesin Pemetaan Regulasi, dan formula matematis skor kepatuhan. |
| **AFD** | **App Flow Documentation**<br>*(Dokumen Alur Aplikasi)* | [`AFD_App_Flow_Documentation.md`](./AFD_App_Flow_Documentation.md) | Diagram alur perjalanan pengguna (*User Journey Flowchart*), diagram sekuens pemindaian dan pelaporan (*Sequence Diagrams*), serta diagram mesin status (*State Machine Diagrams*) untuk sesi audit dan siklus mitigasi. |
| **DBD** | **Design Brief Documentation**<br>*(Dokumen Panduan Desain)* | [`DBD_Design_Brief_Documentation.md`](./DBD_Design_Brief_Documentation.md) | Filosofi desain visual *Tactical Command Center*, hierarki warna 60-30-10, sistem tipografi 2+1 font, format angka tabular `font-mono tabular-nums`, kepatuhan *Anti-Slop* (`miqdadbadjuber/Anti-Slop`), dan arsitektur cetak `@media print` A4. |
| **BSD** | **Backend Schema Documentation**<br>*(Dokumen Skema Basis Data)* | [`BSD_Backend_Schema_Documentation.md`](./BSD_Backend_Schema_Documentation.md) | Desain Entity-Relationship Diagram (ERD) lengkap, kamus data terperinci untuk 7 entitas relasional (`Pengguna`, `Target_Sistem`, `Sesi_Audit`, `Temuan_Teknis`, `Regulasi_Hukum`, `Pemetaan_Kepatuhan`, `Laporan_Kepatuhan`) serta skema jejak audit `Audit_Trail`. |
| **IPD** | **Implementation Plan Documentation**<br>*(Dokumen Rencana Implementasi)* | [`IPD_Implementation_Plan_Documentation.md`](./IPD_Implementation_Plan_Documentation.md) | Peta jalan rekayasa perangkat lunak 6 fase, matriks verifikasi pengujian sistem (*Verification Matrix*), gerbang jaminan kualitas, serta panduan pengoperasian dan deployment (*Runbook Guide*). |
| **DOCKER** | **Container Deployment Guide**<br>*(Panduan Kontainer Docker)* | [`../DOCKER.md`](../DOCKER.md) | Panduan lengkap build multi-stage image Docker, orkestrasi via `docker compose`, pemeriksaan probe kesehatan `/health`, dan konfigurasi port. |
| **VPS DEPLOY** | **Production VPS Deployment Guide**<br>*(Panduan Deployment VPS)* | [`../VPS_DEPLOYMENT.md`](../VPS_DEPLOYMENT.md) | Panduan komprehensif deployment di server VPS Ubuntu/Debian: PostgreSQL persisten, Nginx SSL Let's Encrypt, UFW Firewall, dan backup otomatis. |

---

## Ringkasan Kerangka Regulasi / Regulatory Framework Reference

Dokumentasi ini secara ketat mengacu pada pasal-pasal kunci dalam peraturan perundang-undangan Republik Indonesia:
* **UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi**:
  * **Pasal 34**: Prinsip pemrosesan data pribadi dan kewajiban Penilaian Dampak Pelindungan Data Pribadi (*DPIA*).
  * **Pasal 35**: Kewajiban menjaga keamanan, integritas, dan kerahasiaan pemrosesan data pribadi dari akses tidak sah.
  * **Pasal 39**: Kewajiban penerapan enkripsi berstandar tinggi untuk data pribadi spesifik (kesehatan/rekam medis dan data keuangan).
  * **Pasal 46**: Kewajiban penyampaian notifikasi tertulis insiden kegagalan perlindungan data dalam batas waktu maksimal $3 \times 24$ jam.
  * **Pasal 57**: Penjatuhan sanksi administratif dan denda finansial maksimal 2% dari total pendapatan/penerimaan tahunan.
  * **Pasal 65 & 67**: Ketentuan pidana terhadap perolehan dan pengungkapan data pribadi secara melawan hukum.
* **Peraturan & Standar Teknis BSSN**:
  * Standar Manajemen Keamanan Informasi Sistem Pemerintahan Berbasis Elektronik (SPBE).
  * Pedoman Pengelolaan Kerentanan dan Tanggap Insiden Siber (CSIRT).
