# AFD — App Flow Documentation (Dokumen Alur Aplikasi)
## KARTIKA: Kepatuhan Audit Risiko & Teknologi Informasi Keamanan Aplikasi
*(User Journeys, State Machine Diagrams & Interaction Sequences)*

---

### Informasi Dokumen / Document Information
* **ID Dokumen / Document ID**: `KARTIKA-DOC-AFD-01`
* **Versi / Version**: 1.0.0
* **Status**: Disetujui / Approved
* **Klasifikasi / Classification**: Terbatas / Restricted

---

## 1. Alur Perjalanan Pengguna Global / Global User Journey

Aplikasi KARTIKA dirancang dengan prinsip **Tactical Workflow**: informasi tingkat tinggi tersaji secara langsung di dasbor eksekutif, dan pengguna dapat melakukan investigasi mendalam (*drill-down*) ke bukti teknis payload atau pasal regulasi dalam 1 hingga 2 klik.

```mermaid
flowchart TD
    Start([Pengguna Masuk Sistem]) --> SelectRole[Pilih Peran: IT Security / Legal / Komandan]
    SelectRole --> ViewDash[Tinjau Dasbor Taktis: Metrik & Aktivitas Terakhir]
    
    ViewDash --> Decision{Tindakan Pengguna}
    
    Decision -->|Audit Target Baru| ManageTargets[Manajemen Target: Tambah Web/DB]
    ManageTargets --> TestConn[Uji Koneksi & Handshake]
    TestConn --> LaunchScan[Mulai Pemindaian Interaktif]
    LaunchScan --> LiveTerminal[Terminal Telemetri DAST & PII Real-time]
    LiveTerminal --> AutoMap[Mesin Pemetaan Otomatis UU PDP & BSSN]
    AutoMap --> UpdateScores[Kalkulasi Skor Kepatuhan & Postur Risiko]
    UpdateScores --> ViewDash
    
    Decision -->|Investigasi Teknis| InspectFindings[Inspektur Hasil Pindai Teknis]
    InspectFindings --> ViewPayload[Analisis Bukti Payload & Status Enkripsi]
    ViewPayload --> UpdateRemediation[Perbarui Status: Terbuka / Penanganan / Remediated]
    UpdateRemediation --> UpdateScores
    
    Decision -->|Analisis Yuridis| OpenMatrix[Buka Matriks Regulasi UU PDP]
    OpenMatrix --> CalcPenalty[Simulasi Kalkulator Denda Pasal 57]
    CalcPenalty --> ViewLawArticles[Katalog Pasal 34, 35, 39, 46, 57 UU PDP]
    
    Decision -->|Pelaporan Resmi| GenerateReport[Generator Laporan Kesiapan Kepatuhan]
    GenerateReport --> PrintPDF[Cetak / Unduh PDF Standar A4 Resmi]
    PrintPDF --> End([Audit Tuntas & Otorisasi])
```

---

## 2. Alur Khusus Persona / Persona-Specific Workflows

### 2.1. Alur Kerja IT Security / Auditor Siber
```mermaid
sequenceDiagram
    autonumber
    actor Auditor as IT Security Auditor
    participant UI as Antarmuka Dasbor
    participant Prober as DAST Prober Engine
    participant PiiMod as Detektor Eksposur PII
    participant DB as Penyimpanan Relasional
    participant Log as Jejak Audit (Log)

    Auditor->>UI: Registrasi Target Baru (URL Web / Host DB)
    UI->>DB: Simpan Target dengan Enkripsi Kredensial AES-256
    UI->>Log: Catat Aksi: TAMBAH_TARGET
    Auditor->>UI: Klik "Uji Koneksi"
    UI->>Prober: Test Socket & TLS Handshake
    Prober-->>UI: Status Tersambung (200 OK)
    Auditor->>UI: Klik "Mulai Audit"
    UI->>Prober: Eksekusi Injeksi OWASP Top 10 (SQLi, BOLA)
    UI->>PiiMod: Eksekusi Regex NIK & Rekam Medis pada Sampel DB
    Prober-->>UI: Kirim Telemetri Log Terminal Real-time
    PiiMod-->>UI: Deteksi Kolom NIK & Medis Berstatus Plaintext
    UI->>DB: Simpan Temuan Teknis Baru & Update Sesi Audit
    UI->>Log: Catat Aksi: SELESAI_PINDAI
    UI-->>Auditor: Tampilkan Hasil Temuan Terverifikasi
```

### 2.2. Alur Kerja Compliance & Legal Officer
1. **Pemeriksaan Pelanggaran**: Legal Officer membuka dasbor untuk memeriksa metrik kepatuhan terkini dan memilih tab **Pemetaan Regulasi**.
2. **Korelasi Pasal UU PDP**:
   * Meninjau temuan *SQL Injection* $\rightarrow$ terhubung ke pelanggaran **Pasal 35 UU PDP** (Kewajiban Pengamanan Data).
   * Meninjau temuan *Kolom NIK / Rekam Medis Plaintext* $\rightarrow$ terhubung ke pelanggaran **Pasal 39 UU PDP** (Kewajiban Enkripsi Data Spesifik).
3. **Simulasi Plafon Denda (Pasal 57)**:
   * Menginput estimasi pendapatan tahunan instansi/korporasi (misal: Rp 50 Miliar).
   * Sistem menghitung ancaman denda administratif maksimal 2% (Rp 1 Miliar).
4. **Pemeriksaan Batas Waktu Insiden (Pasal 46)**:
   * Memastikan prosedur notifikasi 3x24 jam disiapkan jika status temuan tergolong *Data Breach Incident*.

### 2.3. Alur Kerja Komandan Satuan / C-Level
1. **Pemantauan Postur Risiko**: Membaca *Executive Summary Banner* dan kartu metrik kepatuhan (Status: *BERESIKO 42%*).
2. **Persetujuan Laporan Audit**: Mengakses menu **Generator Laporan**, memverifikasi kelengkapan bukti temuan teknis, analisis dampak hukum, serta matriks langkah remediasi prioritas.
3. **Otorisasi Cetak PDF**: Mengklik tombol **Cetak / Unduh PDF Resmi** untuk menghasilkan dokumen formal berklasifikasi *RAHASIA / TERBATAS* dengan tanda tangan pengesahan pimpinan.

---

## 3. Diagram Mesin Status / State Machine Diagrams

### 3.1. Siklus Hidup Sesi Audit (Audit Session Lifecycle)
```mermaid
stateDiagram-v2
    [*] --> Terdaftar: Target Diregistrasi
    Terdaftar --> PengujianKoneksi: Klik Uji Koneksi
    PengujianKoneksi --> SiapDipindai: Handshake Berhasil
    PengujianKoneksi --> GagalKoneksi: Port Tertutup / Timeout
    GagalKoneksi --> Terdaftar: Koreksi Kredensial
    
    SiapDipindai --> Running: Eksekusi Audit (DAST & PII)
    Running --> Running: Progres 0% s.d. 99% (Streaming Log)
    Running --> Cancelled: Klik Batalkan Sesi
    Running --> Completed: Audit Tuntas (100%)
    
    Cancelled --> [*]: Sesi Dihentikan
    Completed --> LaporanTercetak: Ekspor PDF Formal
    LaporanTercetak --> [*]: Pengesahan Audit Tuntas
```

### 3.2. Siklus Hidup Temuan Kerentanan (Vulnerability Remediation Lifecycle)
```mermaid
stateDiagram-v2
    [*] --> Terbuka_Open: Ditemukan oleh Engine
    Terbuka_Open --> Dalam_Penanganan: Auditor Memulai Patch / Enkripsi Kolom
    Dalam_Penanganan --> Telah_Diremediasi: Verifikasi Ulang Patch Berhasil
    Dalam_Penanganan --> Terbuka_Open: Patch Gagal / Regresi
    Telah_Diremediasi --> [*]: Skor Kepatuhan Meningkat
```
