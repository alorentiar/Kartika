import {
  Temuan_Teknis,
  Regulasi_Hukum,
  Pemetaan_Kepatuhan
} from '../types/kartika';

/**
 * Cross-references technical vulnerabilities to legal regulations (UU PDP & BSSN)
 */
export function mapFindingToRegulations(
  finding: Temuan_Teknis,
  regulations: Regulasi_Hukum[]
): Pemetaan_Kepatuhan[] {
  const mappings: Pemetaan_Kepatuhan[] = [];

  for (const reg of regulations) {
    let matches = false;
    let analisis = '';

    if (finding.kategori === 'PII') {
      if (reg.pasal === 'Pasal 39') {
        matches = true;
        analisis = `Pelanggaran eksplisit Pasal 39 UU PDP: Data ${finding.judul_temuan} yang berstatus Plaintext melanggar kewajiban enkripsi data pribadi spesifik.`;
      } else if (reg.pasal === 'Pasal 35') {
        matches = true;
        analisis = `Gagal memenuhi kewajiban teknis Pasal 35 UU PDP untuk melindungi data dari akses pihak yang tidak berhak.`;
      } else if (reg.pasal === 'Pasal 57') {
        matches = true;
        analisis = `Pelanggaran kategori tinggi memicu potensi penjatuhan sanksi administratif dan denda maksimal 2% pendapatan tahunan.`;
      }
    } else if (finding.kategori === 'OWASP') {
      if (finding.kode_owasp?.includes('Injection') && reg.pasal === 'Pasal 35') {
        matches = true;
        analisis = `Celah Injection membahayakan keutuhan dan kerahasiaan sistem pemroses data pribadi sesuai Pasal 35 ayat (1) huruf a UU PDP.`;
      } else if (finding.kode_owasp?.includes('Broken Access Control') && reg.pasal === 'Pasal 35') {
        matches = true;
        analisis = `Akses kontrol yang rusak membuka celah pembocoran data antar pengguna tanpa otorisasi sah.`;
      } else if (reg.dasar_hukum === 'Pedoman BSSN') {
        matches = true;
        analisis = `Ketidakpatuhan terhadap standar audit pengujian penetrasi berkala pada Sistem Pemerintahan Berbasis Elektronik (SPBE).`;
      }
    }

    if (matches) {
      mappings.push({
        id_pemetaan: `MAP-GEN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        id_temuan: finding.id_temuan,
        id_regulasi: reg.id_regulasi,
        tingkat_dampak: finding.tingkat_keparahan === 'Kritis' ? 'Kritis' : finding.tingkat_keparahan === 'Tinggi' ? 'Tinggi' : 'Sedang',
        analisis_pelanggaran: analisis,
      });
    }
  }

  return mappings;
}

/**
 * Computes the overall Legal & Security Compliance Score
 * Base 100%, deducted according to vulnerability count and PII table exposures
 */
export function calculateComplianceScore(
  totalKritis: number,
  totalTinggi: number,
  totalSedang: number,
  totalPiiTables: number
): {
  score: number;
  category: 'Beresiko' | 'Waspada' | 'Patuh';
  labelColor: string;
} {
  let score = 100;
  score -= totalKritis * 5;
  score -= totalTinggi * 3;
  score -= totalSedang * 1.5;
  score -= totalPiiTables * 8;

  score = Math.max(15, Math.min(100, Math.round(score)));

  if (score < 50) {
    return { score, category: 'Beresiko', labelColor: 'text-red-400' };
  } else if (score < 80) {
    return { score, category: 'Waspada', labelColor: 'text-amber-400' };
  } else {
    return { score, category: 'Patuh', labelColor: 'text-emerald-400' };
  }
}
