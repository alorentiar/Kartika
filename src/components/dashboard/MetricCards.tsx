import React from 'react';
import { AlertTriangle, Database, ShieldAlert, ShieldCheck, Scale } from 'lucide-react';

interface MetricCardsProps {
  criticalVulnerabilities: number;
  exposedPiiTables: number;
  complianceScore: number;
  riskCategory: 'Beresiko' | 'Waspada' | 'Patuh';
  lastUpdated: string;
  onNavigateTab: (tab: 'findings' | 'matrix') => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  criticalVulnerabilities,
  exposedPiiTables,
  complianceScore,
  riskCategory,
  lastUpdated,
  onNavigateTab,
}) => {
  const getScoreStyle = () => {
    if (complianceScore < 50) {
      return {
        textColor: 'text-red-400',
        badgeColor: 'text-red-400',
        borderColor: 'border-red-500/20',
        label: '(Beresiko)',
      };
    }
    if (complianceScore < 80) {
      return {
        textColor: 'text-amber-400',
        badgeColor: 'text-amber-400',
        borderColor: 'border-amber-500/20',
        label: '(Waspada)',
      };
    }
    return {
      textColor: 'text-emerald-400',
      badgeColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      label: '(Patuh)',
    };
  };

  const scoreInfo = getScoreStyle();

  return (
    <div className="space-y-3">
      {/* Header bar matching wireframe */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 tracking-tight">
            Ringkasan Postur Keamanan & Kepatuhan
          </h2>
          <p className="text-xs text-slate-400">
            Pemindaian DAST OWASP Top 10 dan eksposur Data Pribadi (PII) terhubung UU PDP No. 27/2022
          </p>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Pembaruan Terakhir:</span>
          <span className="font-mono text-slate-200 tabular-nums">{lastUpdated}</span>
        </div>
      </div>

      {/* 3 Metric Cards from Wireframe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Kerentanan Kritis (Web) */}
        <div
          onClick={() => onNavigateTab('findings')}
          className="bg-[#0D1526] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium text-slate-300">Kerentanan Kritis (Web)</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-red-400 tabular-nums">
              {criticalVulnerabilities}
            </span>
            <span className="text-sm font-semibold text-slate-300">Temuan</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>OWASP Top 10 Terdeteksi</span>
            <span className="text-blue-400 group-hover:underline">Detail Temuan →</span>
          </div>
        </div>

        {/* Card 2: Eksposur Data PII */}
        <div
          onClick={() => onNavigateTab('findings')}
          className="bg-[#0D1526] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium text-slate-300">Eksposur Data PII</span>
            <Database className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-400 tabular-nums">
              {exposedPiiTables}
            </span>
            <span className="text-sm font-semibold text-slate-300">Tabel Terekspos</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>NIK & Rekam Medis Plaintext</span>
            <span className="text-blue-400 group-hover:underline">Lihat Kolom →</span>
          </div>
        </div>

        {/* Card 3: Skor Kepatuhan Hukum */}
        <div
          onClick={() => onNavigateTab('matrix')}
          className="bg-[#0D1526] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium text-slate-300">Skor Kepatuhan Hukum</span>
            <Scale className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold font-mono tabular-nums ${scoreInfo.textColor}`}>
              {complianceScore}%
            </span>
            <span className={`text-sm font-semibold ${scoreInfo.badgeColor}`}>
              {scoreInfo.label}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Potensi Sanksi UU PDP Pasal 57</span>
            <span className="text-blue-400 group-hover:underline">Buka Matriks →</span>
          </div>
        </div>
      </div>
    </div>
  );
};
