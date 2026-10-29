-- ====================================================================
-- KARTIKA DATABASE INITIALIZATION SCRIPT (POSTGRESQL 16)
-- Kepatuhan Audit Risiko & Teknologi Informasi Keamanan Aplikasi
-- Sesuai Mandat UU No. 27/2022 (UU PDP) & Standar Teknis BSSN
-- ====================================================================

-- 1. Tabel Pengguna (User Personas & Auth)
CREATE TABLE IF NOT EXISTS pengguna (
    id_pengguna VARCHAR(32) PRIMARY KEY,
    nama VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    peran VARCHAR(32) NOT NULL CHECK (peran IN ('security', 'legal', 'commander', 'admin')),
    jabatan VARCHAR(128) NOT NULL,
    instansi VARCHAR(128) NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Target Sistem (Web & Database Targets)
CREATE TABLE IF NOT EXISTS target_sistem (
    id_target VARCHAR(32) PRIMARY KEY,
    id_pengguna VARCHAR(32) REFERENCES pengguna(id_pengguna) ON DELETE CASCADE,
    nama_target VARCHAR(128) NOT NULL,
    tipe VARCHAR(32) NOT NULL CHECK (tipe IN ('web', 'database')),
    url_atau_host VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL DEFAULT 443,
    db_name VARCHAR(64),
    db_user VARCHAR(64),
    db_engine VARCHAR(32) CHECK (db_engine IN ('mysql', 'postgresql') OR db_engine IS NULL),
    kredensial_terenkripsi BOOLEAN DEFAULT TRUE,
    status_koneksi VARCHAR(32) NOT NULL DEFAULT 'Tersambung',
    terakhir_diuji VARCHAR(64),
    deskripsi TEXT,
    dibuat_pada DATE DEFAULT CURRENT_DATE
);

-- 3. Tabel Sesi Audit (Audit Sessions & Progress)
CREATE TABLE IF NOT EXISTS sesi_audit (
    id_sesi VARCHAR(32) PRIMARY KEY,
    id_target VARCHAR(32) REFERENCES target_sistem(id_target) ON DELETE CASCADE,
    target_nama VARCHAR(128) NOT NULL,
    target_tipe VARCHAR(32) NOT NULL,
    waktu_mulai VARCHAR(64) NOT NULL,
    waktu_selesai VARCHAR(64),
    status VARCHAR(32) NOT NULL CHECK (status IN ('Completed', 'Running', 'Cancelled', 'Pending')),
    progres_persen INTEGER NOT NULL DEFAULT 0 CHECK (progres_persen >= 0 AND progres_persen <= 100),
    total_temuan INTEGER NOT NULL DEFAULT 0,
    temuan_kritis INTEGER NOT NULL DEFAULT 0,
    temuan_tinggi INTEGER NOT NULL DEFAULT 0,
    temuan_sedang INTEGER NOT NULL DEFAULT 0,
    temuan_rendah INTEGER NOT NULL DEFAULT 0,
    tabel_pii_terekspos INTEGER NOT NULL DEFAULT 0,
    skor_kepatuhan FLOAT NOT NULL DEFAULT 100 CHECK (skor_kepatuhan >= 0 AND skor_kepatuhan <= 100),
    kategori_risiko VARCHAR(32) NOT NULL CHECK (kategori_risiko IN ('Beresiko', 'Waspada', 'Patuh')),
    catatan_audit TEXT
);

-- 4. Tabel Temuan Teknis (OWASP Top 10 & PII Findings)
CREATE TABLE IF NOT EXISTS temuan_teknis (
    id_temuan VARCHAR(32) PRIMARY KEY,
    id_sesi VARCHAR(32) REFERENCES sesi_audit(id_sesi) ON DELETE CASCADE,
    target_nama VARCHAR(128) NOT NULL,
    judul_temuan VARCHAR(255) NOT NULL,
    kategori VARCHAR(32) NOT NULL CHECK (kategori IN ('OWASP', 'PII')),
    kode_owasp VARCHAR(64),
    tingkat_keparahan VARCHAR(32) NOT NULL CHECK (tingkat_keparahan IN ('Kritis', 'Tinggi', 'Sedang', 'Rendah')),
    cvss_skor FLOAT NOT NULL CHECK (cvss_skor >= 0.0 AND cvss_skor <= 10.0),
    titik_kelemahan VARCHAR(255) NOT NULL,
    parameter_terdampak VARCHAR(255),
    deskripsi TEXT NOT NULL,
    bukti_payload TEXT NOT NULL,
    status_enkripsi VARCHAR(64) NOT NULL,
    status_remediasi VARCHAR(32) NOT NULL CHECK (status_remediasi IN ('Terbuka (Open)', 'Dalam Penanganan', 'Telah Diremediasi')),
    langkah_remediasi TEXT NOT NULL,
    ditemukan_pada VARCHAR(64) NOT NULL
);

-- 5. Tabel Regulasi Hukum (UU PDP & BSSN Catalog)
CREATE TABLE IF NOT EXISTS regulasi_hukum (
    id_regulasi VARCHAR(32) PRIMARY KEY,
    dasar_hukum VARCHAR(64) NOT NULL,
    pasal VARCHAR(64) NOT NULL,
    ayat VARCHAR(64),
    judul_pasal VARCHAR(255) NOT NULL,
    deskripsi_kewajiban TEXT NOT NULL,
    sanksi_administratif TEXT NOT NULL,
    ancaman_denda_maksimal VARCHAR(128),
    ancaman_pidana VARCHAR(255)
);

-- 6. Tabel Pemetaan Kepatuhan (Compliance Junction Table N:M)
CREATE TABLE IF NOT EXISTS pemetaan_kepatuhan (
    id_pemetaan VARCHAR(32) PRIMARY KEY,
    id_temuan VARCHAR(32) REFERENCES temuan_teknis(id_temuan) ON DELETE CASCADE,
    id_regulasi VARCHAR(32) REFERENCES regulasi_hukum(id_regulasi) ON DELETE CASCADE,
    tingkat_dampak VARCHAR(32) NOT NULL CHECK (tingkat_dampak IN ('Kritis', 'Tinggi', 'Sedang')),
    analisis_pelanggaran TEXT NOT NULL
);

-- 7. Tabel Laporan Kepatuhan (Formal PDF Reports)
CREATE TABLE IF NOT EXISTS laporan_kepatuhan (
    id_laporan VARCHAR(32) PRIMARY KEY,
    id_sesi VARCHAR(32) REFERENCES sesi_audit(id_sesi) ON DELETE CASCADE,
    target_nama VARCHAR(128) NOT NULL,
    nomor_dokumen VARCHAR(64) UNIQUE NOT NULL,
    tanggal_dibuat DATE DEFAULT CURRENT_DATE,
    auditor_nama VARCHAR(128) NOT NULL,
    pemberi_otorisasi VARCHAR(128) NOT NULL,
    ringkasan_eksekutif TEXT NOT NULL,
    skor_kepatuhan FLOAT NOT NULL,
    total_temuan_kritis INTEGER NOT NULL DEFAULT 0,
    total_pii_terekspos INTEGER NOT NULL DEFAULT 0,
    estimasi_denda_uu_pdp VARCHAR(255) NOT NULL,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabel Audit Trail (Immutable Activity Log)
CREATE TABLE IF NOT EXISTS audit_trail (
    id_log VARCHAR(32) PRIMARY KEY,
    timestamp VARCHAR(64) NOT NULL,
    id_pengguna VARCHAR(32) NOT NULL,
    nama_pengguna VARCHAR(128) NOT NULL,
    peran VARCHAR(32) NOT NULL,
    aksi VARCHAR(64) NOT NULL,
    entitas VARCHAR(128) NOT NULL,
    detail TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'Berhasil'
);

-- ====================================================================
-- SEED DATA AWAL (DEFAULT SYSTEM SEEDS)
-- ====================================================================

-- Seed Pengguna (3 Persona Default KARTIKA)
INSERT INTO pengguna (id_pengguna, nama, email, peran, jabatan, instansi, password)
VALUES 
    ('USR-001', 'Ahmad Fauzi, S.Kom., CEH', 'ahmad.fauzi@tni-ad.mil.id', 'security', 'Lead Cyber Security Auditor', 'Satuan Siber Pertahanan Nasional', 'KartikaSec#2026'),
    ('USR-002', 'Maya Anggraini, S.H., LL.M', 'maya.anggraini@kemhan.go.id', 'legal', 'Chief Compliance & Legal Counsel', 'Biro Hukum & Regulasi Siber', 'KartikaLegal#2026'),
    ('USR-003', 'Kolonel (Inf) Bambang Wijaya', 'bambang.wijaya@satuan.mil.id', 'commander', 'Komandan Satuan Siber', 'Komando Operasi Keamanan Siber', 'KartikaKomandan#2026')
ON CONFLICT (id_pengguna) DO NOTHING;

-- Seed Target Sistem
INSERT INTO target_sistem (id_target, id_pengguna, nama_target, tipe, url_atau_host, port, db_name, db_user, db_engine, kredensial_terenkripsi, status_koneksi, terakhir_diuji, deskripsi, dibuat_pada)
VALUES 
    ('TGT-001', 'USR-001', 'E-Gov Portal (Web)', 'web', 'https://egov-portal.instansi.go.id', 443, NULL, NULL, NULL, TRUE, 'Tersambung', '2026-10-27 07:45 WIB', 'Portal Pelayanan Publik dan Administrasi Pemerintahan Elektronik', '2026-10-15'),
    ('TGT-002', 'USR-001', 'HR Database (DB)', 'database', '10.240.12.50', 5432, 'hr_personel_master', 'postgres_kartika_readonly', 'postgresql', TRUE, 'Tersambung', '2026-10-27 08:00 WIB', 'Basis data kepegawaian personel militer dan sipil instansi pertahanan', '2026-10-18'),
    ('TGT-003', 'USR-001', 'API Service v2 (Web)', 'web', 'https://api-v2.internal.satuan.mil.id', 8443, NULL, NULL, NULL, TRUE, 'Tersambung', '2026-10-26 16:30 WIB', 'Microservices gateway integrasi data operasional terpusat', '2026-10-20')
ON CONFLICT (id_target) DO NOTHING;

-- Seed Sesi Audit
INSERT INTO sesi_audit (id_sesi, id_target, target_nama, target_tipe, waktu_mulai, waktu_selesai, status, progres_persen, total_temuan, temuan_kritis, temuan_tinggi, temuan_sedang, temuan_rendah, tabel_pii_terekspos, skor_kepatuhan, kategori_risiko, catatan_audit)
VALUES 
    ('SES-001', 'TGT-001', 'E-Gov Portal (Web)', 'web', '2026-10-27 06:15 WIB', '2026-10-27 07:50 WIB', 'Completed', 100, 12, 5, 4, 2, 1, 0, 38, 'Beresiko', 'Ditemukan celah injeksi kritis dan kegagalan enkripsi data transit.'),
    ('SES-002', 'TGT-002', 'HR Database (DB)', 'database', '2026-10-27 07:30 WIB', NULL, 'Running', 65, 7, 4, 2, 1, 0, 3, 42, 'Beresiko', 'Pemindaian berjalan: 3 tabel teridentifikasi menyimpan data pribadi spesifik tanpa enkripsi.'),
    ('SES-003', 'TGT-003', 'API Service v2 (Web)', 'web', '2026-10-26 14:00 WIB', '2026-10-26 16:30 WIB', 'Completed', 100, 4, 1, 2, 1, 0, 0, 68, 'Waspada', 'Broken Object Level Authorization pada endpoint profiling personel.')
ON CONFLICT (id_sesi) DO NOTHING;

-- Seed Temuan Teknis
INSERT INTO temuan_teknis (id_temuan, id_sesi, target_nama, judul_temuan, kategori, kode_owasp, tingkat_keparahan, cvss_skor, titik_kelemahan, parameter_terdampak, deskripsi, bukti_payload, status_enkripsi, status_remediasi, langkah_remediasi, ditemukan_pada)
VALUES 
    ('TMN-001', 'SES-001', 'E-Gov Portal (Web)', 'SQL Injection pada Modul Otentikasi', 'OWASP', 'A03:2021-Injection', 'Kritis', 9.8, '/api/v1/auth/login', 'username', 'Parameter input otentikasi tidak divalidasi dan langsung dikonkatenasi ke dalam query SQL backend tanpa parameterized query.', 'POST /api/v1/auth/login HTTP/1.1\nContent-Type: application/json\n\n{"username": "admin'' OR ''1''=''1'' --", "password": "test"}\n--> Respon: 200 OK (Bypass Berhasil, Dump 450 user hash)', 'Plaintext (Terekspos)', 'Terbuka (Open)', 'Gunakan Prepared Statements / ORM parameterized query dan implementasikan Web Application Firewall (WAF).', '2026-10-27 06:45 WIB'),
    ('TMN-002', 'SES-002', 'HR Database (DB)', 'Eksposur 16-Digit NIK & Identitas Personel Tanpa Enkripsi', 'PII', NULL, 'Kritis', 9.1, 'tabel public.pegawai_master', 'kolom: nik, nama_lengkap, tempat_tanggal_lahir', 'Kolom NIK (16 digit angka data kependudukan) disimpan dalam format teks terbuka (VARCHAR) tanpa enkripsi level kolom maupun hashing.', 'SELECT nik, nama_lengkap, no_telepon FROM pegawai_master LIMIT 3;\n1. 3174051203890002 | Letkol Kav Rahmat Hidayat [Plaintext]\n2. 3201082507920004 | Mayor Chb Siti Aminah [Plaintext]', 'Plaintext (Terekspos)', 'Terbuka (Open)', 'Terapkan enkripsi simetris standar AES-256 dengan manajemen kunci terpusat (KMS) dan masking data pada tampilan aplikasi.', '2026-10-27 07:35 WIB'),
    ('TMN-003', 'SES-002', 'HR Database (DB)', 'Eksposur Data Kesehatan & Rekam Medis Khusus Tanpa Proteksi', 'PII', NULL, 'Kritis', 9.3, 'tabel public.rekam_medis_karyawan', 'kolom: kode_icd10, riwayat_penyakit, hasil_tes_kesamaptaan', 'Data pribadi spesifik (data kesehatan personel militer) tersimpan tanpa enkripsi dan dapat diakses oleh user database umum.', 'SELECT id_personel, kode_icd10, diagnosis FROM rekam_medis_karyawan WHERE kode_icd10 IS NOT NULL;\nRecord: PERS-9081 | I10 (Hipertensi Esensial) [Plaintext]', 'Plaintext (Terekspos)', 'Terbuka (Open)', 'Terapkan Transparent Data Encryption (TDE), batasi privilege akses basis data via Role-Based Access Control (RBAC).', '2026-10-27 07:42 WIB'),
    ('TMN-004', 'SES-002', 'HR Database (DB)', 'Eksposur Data Finansial & Rekening Gaji Personel', 'PII', NULL, 'Tinggi', 8.2, 'tabel public.gaji_rekening', 'kolom: nomor_rekening, npwp, gaji_pokok', 'Data keuangan dan perbankan personel militer disimpan tanpa salt atau enkripsi simetris.', 'Sample data: Bank Mandiri Rekening 127000889212 | NPWP: 08.123.456.7-012.000 [Plaintext]', 'Plaintext (Terekspos)', 'Dalam Penanganan', 'Enkripsi nomor rekening menggunakan AES-256-GCM dan terapkan masking 4 digit terakhir pada antarmuka pengguna.', '2026-10-27 07:48 WIB'),
    ('TMN-005', 'SES-003', 'API Service v2 (Web)', 'Broken Object Level Authorization (BOLA/IDOR)', 'OWASP', 'A01:2021-Broken Access Control', 'Kritis', 8.8, '/api/v2/users/{id}/profile', 'path parameter: id', 'Pengguna terotentikasi dapat membaca berkas profil, pangkat, dan data pribadi pengguna lain cukup dengan mengganti nilai parameter id pengguna.', 'GET /api/v2/users/1042/profile HTTP/1.1\nAuthorization: Bearer <token_user_1001>\n--> Respon: 200 OK (Data user 1042 terekspos)', 'Plaintext (Terekspos)', 'Terbuka (Open)', 'Implementasikan validasi kepemilikan konteks token pengguna terhadap ID objek pada middleware API backend.', '2026-10-26 15:10 WIB')
ON CONFLICT (id_temuan) DO NOTHING;

-- Seed Regulasi Hukum (UU PDP & BSSN)
INSERT INTO regulasi_hukum (id_regulasi, dasar_hukum, pasal, ayat, judul_pasal, deskripsi_kewajiban, sanksi_administratif, ancaman_denda_maksimal, ancaman_pidana)
VALUES 
    ('REG-001', 'UU PDP No. 27/2022', 'Pasal 35', 'Ayat (1) & (2)', 'Kewajiban Pengamanan dan Kerahasiaan Data Pribadi', 'Pengendali Data Pribadi wajib melindungi dan memastikan keamanan Data Pribadi yang diprosesnya dengan melakukan langkah teknis dan operasional untuk melindungi dari kehilangan, pemalsuan, dan akses tidak sah.', 'Peringatan tertulis, penghentian sementara kegiatan pemrosesan data pribadi, dan/atau penghapusan data pribadi.', 'Denda administratif maksimal 2% dari total pendapatan tahunan terhadap subjek pengendali data.', NULL),
    ('REG-002', 'UU PDP No. 27/2022', 'Pasal 39', 'Ayat (1)', 'Kewajiban Enkripsi Data Pribadi Spesifik', 'Pengendali Data Pribadi wajib menjamin kerahasiaan data pribadi yang bersifat spesifik (data kesehatan, data biometrik, data genetika, catatan kejahatan, data anak, dan data keuangan pribadi) dengan menerapkan sistem keamanan terenkripsi berstandar tinggi.', 'Penghentian sementara kegiatan pemrosesan data spesifik serta pengumuman pelanggaran secara publik.', 'Denda administratif maksimal 2% dari total pendapatan tahunan.', 'Pidana penjara paling lama 4 tahun dan/atau denda paling banyak Rp4.000.000.000 (Pasal 67 ayat 1).'),
    ('REG-003', 'UU PDP No. 27/2022', 'Pasal 34', 'Ayat (2)', 'Penilaian Dampak Pelindungan Data Pribadi (DPIA)', 'Pengendali Data Pribadi wajib melakukan Penilaian Dampak Pelindungan Data Pribadi (DPIA) dalam hal pemrosesan memiliki potensi risiko tinggi terhadap Subjek Data Pribadi.', 'Teguran tertulis dan pembekuan otorisasi sistem informasi pemroses data.', 'Denda administratif maksimal 2% pendapatan tahunan.', NULL),
    ('REG-004', 'UU PDP No. 27/2022', 'Pasal 46', 'Ayat (1) & (2)', 'Kewajiban Notifikasi Kebocoran Data (Incident Reporting)', 'Dalam hal terjadi kegagalan pelindungan Data Pribadi, Pengendali Data Pribadi wajib menyampaikan pemberitahuan secara tertulis paling lambat 3 x 24 jam kepada Subjek Data Pribadi dan Lembaga yang berwenang.', 'Sanksi administratif tingkat berat karena kelalaian pemberitahuan publik.', 'Denda administratif maksimal 2% dari pendapatan tahunan.', NULL),
    ('REG-005', 'Pedoman BSSN', 'Peraturan BSSN No. 4/2021', NULL, 'Standar Manajemen Keamanan Informasi SPBE & Kerentanan Web', 'Setiap penyelenggara sistem elektronik instansi pemerintah wajib menerapkan kontrol keamanan berbasis kerangka kerja ISO 27001 dan melakukan vulnerability assessment berkala pada aplikasi publik.', 'Penurunan indeks Tingkat Kematangan Keamanan Siber (NCSMI) dan rekomendasi penghentian layanan oleh BSSN.', NULL, NULL),
    ('REG-006', 'UU PDP No. 27/2022', 'Pasal 57', 'Ayat (1) & (2)', 'Penetapan Sanksi Administratif dan Denda Finansial', 'Mengatur hierarki penjatuhan sanksi administratif mulai dari peringatan tertulis hingga denda administratif paling tinggi 2% dari pendapatan tahunan atau penerimaan tahunan terhadap variabel pelanggaran.', 'Kewajiban pembayaran denda ke kas negara dan ganti rugi perdata kepada korban.', 'Maksimal 2% dari total pendapatan tahunan instansi/korporasi.', NULL)
ON CONFLICT (id_regulasi) DO NOTHING;

-- Seed Pemetaan Kepatuhan
INSERT INTO pemetaan_kepatuhan (id_pemetaan, id_temuan, id_regulasi, tingkat_dampak, analisis_pelanggaran)
VALUES 
    ('MAP-001', 'TMN-001', 'REG-001', 'Kritis', 'Celah SQL Injection melanggar kewajiban menjaga integritas dan kerahasiaan data pada Pasal 35 UU PDP, membuka potensi pembocoran massal seluruh basis data.'),
    ('MAP-002', 'TMN-001', 'REG-005', 'Kritis', 'Gagal memenuhi pedoman BSSN mengenai pengujian celah OWASP Injection pada Sistem Pemerintahan Berbasis Elektronik (SPBE).'),
    ('MAP-003', 'TMN-002', 'REG-001', 'Kritis', 'Penyimpanan NIK 16 digit dalam bentuk plaintext tanpa enkripsi melanggar Pasal 35 UU PDP tentang perlindungan teknis data pribadi.'),
    ('MAP-004', 'TMN-002', 'REG-006', 'Kritis', 'Berpotensi langsung dikenakan denda administratif Pasal 57 jika terbukti terjadi eksfiltrasi data kependudukan personel.'),
    ('MAP-005', 'TMN-003', 'REG-002', 'Kritis', 'Pelanggaran langsung terhadap Pasal 39 UU PDP: Data kesehatan/rekam medis adalah Data Pribadi Spesifik yang WAJIB terenkripsi dengan algoritma berkekuatan tinggi.'),
    ('MAP-006', 'TMN-004', 'REG-002', 'Tinggi', 'Data keuangan dan perbankan personel termasuk kategori data sensitif yang diwajibkan proteksi kriptografis berlapis.'),
    ('MAP-007', 'TMN-005', 'REG-001', 'Kritis', 'Celah BOLA/IDOR melanggar kontrol otorisasi akses sah sesuai Pasal 35 ayat (1) huruf a UU PDP.')
ON CONFLICT (id_pemetaan) DO NOTHING;

-- Seed Laporan Kepatuhan
INSERT INTO laporan_kepatuhan (id_laporan, id_sesi, target_nama, nomor_dokumen, tanggal_dibuat, auditor_nama, pemberi_otorisasi, ringkasan_eksekutif, skor_kepatuhan, total_temuan_kritis, total_pii_terekspos, estimasi_denda_uu_pdp)
VALUES 
    ('REP-2026-X-0014', 'SES-001', 'E-Gov Portal (Web) & HR Database (DB)', 'KARTIKA/REP/2026/X/0014', '2026-10-27', 'Ahmad Fauzi, S.Kom., CEH', 'Kolonel (Inf) Bambang Wijaya', 'Audit kepatuhan komprehensif mengidentifikasi postur keamanan berada pada tingkat BERESIKO (Skor Kepatuhan: 42%). Ditemukan 5 kerentanan kritis DAST (OWASP Top 10) serta 3 tabel basis data yang mengekspos Data Pribadi Spesifik (NIK dan Rekam Medis) tanpa enkripsi simetris.', 42, 12, 3, 'Maks. 2% Pendapatan / Penerimaan Tahunan Instansi (UU PDP Pasal 57)')
ON CONFLICT (id_laporan) DO NOTHING;

-- Seed Audit Trail Awal
INSERT INTO audit_trail (id_log, timestamp, id_pengguna, nama_pengguna, peran, aksi, entitas, detail, ip_address, status)
VALUES 
    ('LOG-901', '2026-10-27 08:00:12 WIB', 'USR-001', 'Ahmad Fauzi', 'security', 'EKSEKUSI_PINDAI', 'HR Database (DB)', 'Memulai sesi audit DAST & Deteksi PII SES-002 pada host 10.240.12.50:5432', '192.168.10.45', 'Berhasil'),
    ('LOG-902', '2026-10-27 07:50:30 WIB', 'USR-001', 'Ahmad Fauzi', 'security', 'SELESAI_PINDAI', 'E-Gov Portal (Web)', 'Sesi audit SES-001 selesai. 12 temuan kerentanan teknis tercatat.', '192.168.10.45', 'Berhasil'),
    ('LOG-903', '2026-10-27 07:52:15 WIB', 'USR-002', 'Maya Anggraini', 'legal', 'PEMETAAN_REGULASI', 'Pemetaan_Kepatuhan', 'Menautkan temuan TMN-001 (SQLi) ke Pasal 35 UU PDP No. 27/2022', '192.168.10.82', 'Berhasil'),
    ('LOG-904', '2026-10-27 07:55:00 WIB', 'USR-003', 'Kolonel Bambang Wijaya', 'commander', 'AKSES_LAPORAN', 'Laporan_Kepatuhan', 'Membuka tinjauan ringkasan eksekutif kepatuhan dan ancaman sanksi hukum', '192.168.1.10', 'Berhasil')
ON CONFLICT (id_log) DO NOTHING;
