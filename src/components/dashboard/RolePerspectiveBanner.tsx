import React from 'react';
import { ShieldAlert, Scale, UserCheck, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Pengguna, ViewTab } from '../../types/kartika';

interface RolePerspectiveBannerProps {
  currentUser: Pengguna;
  complianceScore: number;
  criticalCount: number;
  exposedPiiCount: number;
  onNavigate: (tab: ViewTab) => void;
}

export const RolePerspectiveBanner: React.FC<RolePerspectiveBannerProps> = ({
  currentUser,
  complianceScore,
  criticalCount,
  exposedPiiCount,
  onNavigate,
}) => {
  if (currentUser.peran === 'security') {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <span>Perspektif IT Security & Auditor Siber</span>
              <span className="text-[10px] font-mono text-slate-400">· Vektor Serangan Aktif</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ditemukan {criticalCount} kerentanan berisiko tinggi (OWASP A03 Injection & A01 BOLA) dan {exposedPiiCount} tabel database tanpa enkripsi kolom. Segera verifikasi payload bukti dan langkah perbaikan teknis.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('findings')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <span>Inspeksi Teknis</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  if (currentUser.peran === 'legal') {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400 shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <span>Perspektif Compliance & Legal Officer</span>
              <span className="text-[10px] font-mono text-amber-400">· Eksposur Sanksi UU PDP</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Penyimpanan NIK dan Rekam Medis dalam format plaintext secara langsung melanggar Pasal 35 & 39 UU PDP No. 27/2022. Instansi berpotensi dikenakan denda administratif Pasal 57 (hingga 2% pendapatan tahunan) dan kewajiban notifikasi publik 3x24 jam (Pasal 46).
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('matrix')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-950/60 border border-amber-800/50 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <span>Buka Matriks Regulasi</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Commander / C-Level
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400 shrink-0">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
            <span>Ringkasan Eksekutif Komandan Satuan / C-Level</span>
            <span className="text-[10px] font-mono text-blue-400">· Kesiapan Operasional</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Postur ketahanan siber berada pada status <strong>BERESIKO ({complianceScore}%)</strong>. Rekomendasi strategis: terapkan enkripsi AES-256 pada basis data personel segera untuk mencegah insiden kebocoran data strategis nasional dan cetak laporan kepatuhan resmi.
          </p>
        </div>
      </div>
      <button
        onClick={() => onNavigate('report')}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0"
      >
        <span>Lihat Laporan Eksekutif</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
