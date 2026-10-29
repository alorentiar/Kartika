import { Temuan_Teknis } from '../types/kartika';

export interface PiiScanResult {
  tableName: string;
  columnName: string;
  piiType: 'NIK 16-Digit' | 'Rekam Medis (Kesehatan)' | 'Nomor Rekening Bank' | 'Nomor BPJS' | 'Nama Lengkap';
  sampleValue: string;
  encryptionStatus: 'Plaintext (Terekspos)' | 'Terenkripsi AES-256' | 'Hashed Argon2';
  isViolation: boolean;
  severity: 'Kritis' | 'Tinggi' | 'Sedang';
}

/**
 * Validates Indonesian 16-Digit NIK (Nomor Induk Kependudukan)
 * Pattern: 2 digit prov + 2 digit kota + 2 digit kec + 6 digit tgl lahir + 4 digit urut
 */
export function isIndonesianNik(value: string): boolean {
  const clean = value.replace(/[\s-]/g, '');
  return /^[1-9][0-9]{15}$/.test(clean);
}

/**
 * Validates Medical/Health Records (ICD-10 code format, diagnosis notes)
 */
export function isMedicalRecord(value: string): boolean {
  // ICD-10 pattern (e.g. A00.0, I10, E11.9) or explicit clinical terms
  const icd10Regex = /^[A-Z][0-9]{2}(\.[0-9]{1,2})?$/i;
  const healthTerms = ['diagnosis', 'hipertensi', 'diabetes', 'rekam medis', 'icd-10', 'rawat', 'terapi'];
  const lower = value.toLowerCase();
  return icd10Regex.test(value.trim()) || healthTerms.some(term => lower.includes(term));
}

/**
 * Checks whether a given string is encrypted (AES ciphertext / Base64 format)
 * or hashed (e.g., bcrypt/argon2 format) vs raw Plaintext
 */
export function verifyEncryptionState(sampleValue: string): 'Plaintext (Terekspos)' | 'Terenkripsi AES-256' | 'Hashed Argon2' {
  if (sampleValue.startsWith('$2a$') || sampleValue.startsWith('$2b$') || sampleValue.startsWith('$argon2')) {
    return 'Hashed Argon2';
  }
  // Check if string looks like an AES ciphertext: high entropy base64, usually ending in = or 32+ hex chars with iv:
  if (/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(sampleValue) && sampleValue.length >= 32) {
    return 'Terenkripsi AES-256';
  }
  return 'Plaintext (Terekspos)';
}

/**
 * Scans a simulated or provided database schema sample for PII exposures
 */
export function runPiiInspection(
  targetName: string,
  sessionId: string,
  tableSamples: {
    table: string;
    column: string;
    sample: string;
  }[]
): {
  scannedTablesCount: number;
  exposedTablesCount: number;
  findings: Partial<Temuan_Teknis>[];
} {
  const exposedTables = new Set<string>();
  const findings: Partial<Temuan_Teknis>[] = [];

  for (const item of tableSamples) {
    const encState = verifyEncryptionState(item.sample);
    let piiType: string | null = null;
    let severity: 'Kritis' | 'Tinggi' | 'Sedang' = 'Sedang';

    if (isIndonesianNik(item.sample) || item.column.toLowerCase().includes('nik')) {
      piiType = 'NIK 16-Digit (Identitas Kependudukan)';
      severity = 'Kritis';
    } else if (isMedicalRecord(item.sample) || item.column.toLowerCase().includes('medis') || item.column.toLowerCase().includes('diagnosis')) {
      piiType = 'Data Kesehatan & Rekam Medis (Data Pribadi Spesifik)';
      severity = 'Kritis';
    } else if (item.column.toLowerCase().includes('rekening') || item.column.toLowerCase().includes('gaji')) {
      piiType = 'Data Finansial & Nomor Rekening Personel';
      severity = 'Tinggi';
    }

    if (piiType && encState === 'Plaintext (Terekspos)') {
      exposedTables.add(item.table);
      findings.push({
        id_sesi: sessionId,
        target_nama: targetName,
        judul_temuan: `Eksposur ${piiType} Tanpa Enkripsi`,
        kategori: 'PII',
        tingkat_keparahan: severity,
        cvss_skor: severity === 'Kritis' ? 9.2 : 8.1,
        titik_kelemahan: `Tabel ${item.table}`,
        parameter_terdampak: `Kolom: ${item.column}`,
        deskripsi: `Ditemukan sampel entitas ${piiType} tersimpan dalam bentuk Plaintext tanpa enkripsi AES-256 atau masking pada basis data.`,
        bukti_payload: `Sample Query: SELECT ${item.column} FROM ${item.table} LIMIT 1;\n--> Hasil Terbaca: "${item.sample}" [STATUS: ${encState}]`,
        status_enkripsi: encState,
        status_remediasi: 'Terbuka (Open)',
        langkah_remediasi: `Terapkan Transparent Data Encryption (TDE) atau Column-Level Encryption AES-256-GCM sesuai mandat Pasal 39 UU PDP.`,
        ditemukan_pada: new Date().toLocaleTimeString('id-ID') + ' WIB',
      });
    }
  }

  return {
    scannedTablesCount: new Set(tableSamples.map(s => s.table)).size,
    exposedTablesCount: exposedTables.size,
    findings,
  };
}
