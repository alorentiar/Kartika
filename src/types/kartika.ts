/**
 * KARTIKA - Entity Relationship & Domain Types
 * Based on Dokumen Rancang Bangun (PRD & ERD) KARTIKA
 */

export type UserRole = 'security' | 'legal' | 'commander' | 'admin';

export interface Pengguna {
  id_pengguna: string;
  nama: string;
  email: string;
  peran: UserRole;
  jabatan: string;
  instansi: string;
  password?: string;
  avatar_url?: string;
}

export type TargetType = 'web' | 'database';

export interface Target_Sistem {
  id_target: string;
  id_pengguna: string;
  nama_target: string;
  tipe: TargetType;
  url_atau_host: string;
  port?: number;
  db_name?: string;
  db_user?: string;
  db_engine?: 'mysql' | 'postgresql';
  kredensial_terenkripsi: boolean; // AES-256 standard flag
  status_koneksi: 'Tersambung' | 'Gagal' | 'Belum Diuji';
  terakhir_diuji?: string;
  dibuat_pada: string;
  deskripsi: string;
}

export type ScanStatus = 'Completed' | 'Running' | 'Cancelled' | 'Pending';

export interface Sesi_Audit {
  id_sesi: string;
  id_target: string;
  target_nama: string;
  target_tipe: TargetType;
  waktu_mulai: string;
  waktu_selesai?: string;
  status: ScanStatus;
  progres_persen: number;
  total_temuan: number;
  temuan_kritis: number;
  temuan_tinggi: number;
  temuan_sedang: number;
  temuan_rendah: number;
  tabel_pii_terekspos: number;
  skor_kepatuhan: number; // 0 - 100%
  kategori_risiko: 'Beresiko' | 'Waspada' | 'Patuh';
  catatan_audit?: string;
}

export type TemuanKategori = 'OWASP' | 'PII';
export type SeverityLevel = 'Kritis' | 'Tinggi' | 'Sedang' | 'Rendah';

export interface Temuan_Teknis {
  id_temuan: string;
  id_sesi: string;
  target_nama: string;
  judul_temuan: string;
  kategori: TemuanKategori;
  kode_owasp?: string; // e.g. 'A03:2021-Injection', 'A01:2021-Broken Access Control'
  tingkat_keparahan: SeverityLevel;
  cvss_skor: number;
  titik_kelemahan: string; // Endpoint URL atau Nama Tabel & Kolom
  parameter_terdampak?: string;
  deskripsi: string;
  bukti_payload: string;
  status_enkripsi: 'Plaintext (Terekspos)' | 'Terenkripsi AES-256' | 'Hashed Argon2' | 'Tidak Tersedia (N/A)';
  status_remediasi: 'Terbuka (Open)' | 'Dalam Penanganan' | 'Telah Diremediasi';
  langkah_remediasi: string;
  ditemukan_pada: string;
}

export interface Regulasi_Hukum {
  id_regulasi: string;
  dasar_hukum: 'UU PDP No. 27/2022' | 'Pedoman BSSN';
  pasal: string;
  ayat?: string;
  judul_pasal: string;
  deskripsi_kewajiban: string;
  sanksi_administratif: string;
  ancaman_denda_maksimal?: string;
  ancaman_pidana?: string;
}

export interface Pemetaan_Kepatuhan {
  id_pemetaan: string;
  id_temuan: string;
  id_regulasi: string;
  tingkat_dampak: 'Kritis' | 'Tinggi' | 'Sedang';
  analisis_pelanggaran: string;
}

export interface Laporan_Kepatuhan {
  id_laporan: string;
  id_sesi: string;
  target_nama: string;
  nomor_dokumen: string;
  tanggal_dibuat: string;
  auditor_nama: string;
  pemberi_otorisasi: string;
  ringkasan_eksekutif: string;
  skor_kepatuhan: number;
  total_temuan_kritis: number;
  total_pii_terekspos: number;
  estimasi_denda_uu_pdp: string;
  rekomendasi_prioritas: string[];
}

export interface AuditTrailLog {
  id_log: string;
  timestamp: string;
  id_pengguna: string;
  nama_pengguna: string;
  peran: UserRole;
  aksi: string;
  entitas: string;
  detail: string;
  ip_address: string;
  status: 'Berhasil' | 'Peringatan' | 'Gagal';
}

export type ViewTab = 'dashboard' | 'targets' | 'findings' | 'matrix' | 'report' | 'audit_trail';
