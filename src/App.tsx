import React, { useState } from 'react';
import {
  DEFAULT_USERS,
  DEFAULT_TARGETS,
  DEFAULT_SESSIONS,
  DEFAULT_FINDINGS,
  DEFAULT_REGULATIONS,
  DEFAULT_MAPPINGS,
  DEFAULT_REPORT,
  DEFAULT_AUDIT_LOGS,
} from './data/defaultData';
import {
  Pengguna,
  Target_Sistem,
  Sesi_Audit,
  Temuan_Teknis,
  Regulasi_Hukum,
  Pemetaan_Kepatuhan,
  Laporan_Kepatuhan,
  AuditTrailLog,
  ViewTab,
} from './types/kartika';
import { calculateComplianceScore, mapFindingToRegulations } from './services/regulatoryMapper';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { MetricCards } from './components/dashboard/MetricCards';
import { RecentScans } from './components/dashboard/RecentScans';
import { RolePerspectiveBanner } from './components/dashboard/RolePerspectiveBanner';
import { TargetManager } from './components/targets/TargetManager';
import { FindingsView } from './components/findings/FindingsView';
import { RegulationMatrix } from './components/matrix/RegulationMatrix';
import { ComplianceReport } from './components/report/ComplianceReport';
import { AuditTrailView } from './components/audit/AuditTrailView';
import { LiveScanModal } from './components/scanner/LiveScanModal';
import { AuthPage } from './components/auth/AuthPage';

export default function App() {
  // User Accounts & Authentication State with localStorage persistence
  const [allUsers, setAllUsers] = useState<Pengguna[]>(DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useState<Pengguna | null>(() => {
    try {
      const saved = localStorage.getItem('kartika_active_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse active user from localStorage', e);
    }
    // Return null so the Login & Register page with quick-login credentials is shown initially
    return null;
  });

  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');

  const [targets, setTargets] = useState<Target_Sistem[]>(DEFAULT_TARGETS);
  const [sessions, setSessions] = useState<Sesi_Audit[]>(DEFAULT_SESSIONS);
  const [findings, setFindings] = useState<Temuan_Teknis[]>(DEFAULT_FINDINGS);
  const [regulations] = useState<Regulasi_Hukum[]>(DEFAULT_REGULATIONS);
  const [mappings, setMappings] = useState<Pemetaan_Kepatuhan[]>(DEFAULT_MAPPINGS);
  const [report, setReport] = useState<Laporan_Kepatuhan>(DEFAULT_REPORT);
  const [auditLogs, setAuditLogs] = useState<AuditTrailLog[]>(DEFAULT_AUDIT_LOGS);

  // Scanner Modal State
  const [activeScanTarget, setActiveScanTarget] = useState<Target_Sistem | null>(null);

  // Dynamic Metrics Calculation
  const criticalFindingsCount = findings.filter(
    (f) => f.tingkat_keparahan === 'Kritis' && f.status_remediasi !== 'Telah Diremediasi'
  ).length;

  const exposedPiiTablesCount = new Set(
    findings
      .filter((f) => f.kategori === 'PII' && f.status_remediasi !== 'Telah Diremediasi')
      .map((f) => f.titik_kelemahan)
  ).size;

  const totalTinggiCount = findings.filter(
    (f) => f.tingkat_keparahan === 'Tinggi' && f.status_remediasi !== 'Telah Diremediasi'
  ).length;

  const totalSedangCount = findings.filter(
    (f) => f.tingkat_keparahan === 'Sedang' && f.status_remediasi !== 'Telah Diremediasi'
  ).length;

  const { score: currentScore, category: riskCategory } = calculateComplianceScore(
    criticalFindingsCount,
    totalTinggiCount,
    totalSedangCount,
    exposedPiiTablesCount
  );

  const activeScanCount = sessions.filter((s) => s.status === 'Running').length;

  // Audit Log Recorder (Immutable log)
  const recordAudit = (
    aksi: string,
    entitas: string,
    detail: string,
    userOverride?: Pengguna
  ) => {
    const actor = userOverride || currentUser;
    const newLog: AuditTrailLog = {
      id_log: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
      id_pengguna: actor ? actor.id_pengguna : 'SYSTEM',
      nama_pengguna: actor ? actor.nama : 'Tamu Sistem',
      peran: actor ? actor.peran : 'security',
      aksi,
      entitas,
      detail,
      ip_address: '192.168.10.45',
      status: 'Berhasil',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Authentication Handlers
  const handleLogin = (user: Pengguna) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('kartika_active_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    recordAudit(
      'LOGIN_BERHASIL',
      'Otorisasi Pengguna',
      `Pengguna masuk sistem: ${user.nama} (${user.peran.toUpperCase()})`,
      user
    );
  };

  const handleRegister = (newUser: Pengguna) => {
    setAllUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    try {
      localStorage.setItem('kartika_active_user', JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
    recordAudit(
      'REGISTRASI_PENGGUNA',
      newUser.nama,
      `Pendaftaran akun personel baru: ${newUser.nama} sebagai ${newUser.peran.toUpperCase()} pada ${newUser.instansi}`,
      newUser
    );
  };

  const handleLogout = () => {
    if (currentUser) {
      recordAudit(
        'LOGOUT',
        'Otorisasi Pengguna',
        `Pengguna ${currentUser.nama} keluar dari sistem (Log Out)`
      );
    }
    try {
      localStorage.removeItem('kartika_active_user');
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
  };

  const handleSwitchRole = (user: Pengguna) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('kartika_active_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    recordAudit(
      'GANTI_PERAN',
      'Pengguna',
      `Beralih ke peran: ${user.peran.toUpperCase()} (${user.nama})`,
      user
    );
  };

  // Target Management Handlers
  const handleAddTarget = (targetData: Omit<Target_Sistem, 'id_target' | 'dibuat_pada'>) => {
    const newTarget: Target_Sistem = {
      ...targetData,
      id_target: `TGT-${Date.now()}`,
      dibuat_pada: new Date().toISOString().split('T')[0],
    };
    setTargets((prev) => [newTarget, ...prev]);
    recordAudit(
      'TAMBAH_TARGET',
      newTarget.nama_target,
      `Registrasi target ${newTarget.tipe}: ${newTarget.url_atau_host}`
    );
  };

  const handleDeleteTarget = (targetId: string) => {
    const tgt = targets.find((t) => t.id_target === targetId);
    setTargets((prev) => prev.filter((t) => t.id_target !== targetId));
    if (tgt) {
      recordAudit('HAPUS_TARGET', tgt.nama_target, `Menghapus target audit ${tgt.nama_target}`);
    }
  };

  const handleTestConnection = async (targetId: string): Promise<boolean> => {
    const tgt = targets.find((t) => t.id_target === targetId);
    return new Promise((resolve) => {
      setTimeout(() => {
        setTargets((prev) =>
          prev.map((t) =>
            t.id_target === targetId
              ? {
                  ...t,
                  status_koneksi: 'Tersambung',
                  terakhir_diuji: new Date().toLocaleTimeString('id-ID') + ' WIB',
                }
              : t
          )
        );
        if (tgt) {
          recordAudit(
            'UJI_KONEKSI',
            tgt.nama_target,
            `Koneksi berhasil terverifikasi pada port ${tgt.port || 443}`
          );
        }
        resolve(true);
      }, 700);
    });
  };

  const handleStartScan = (target: Target_Sistem) => {
    setActiveScanTarget(target);
    recordAudit(
      'EKSEKUSI_PINDAI',
      target.nama_target,
      `Memulai konsol audit DAST & PII pada ${target.url_atau_host}`
    );
  };

  const handleScanCompleted = (newFindings: Temuan_Teknis[]) => {
    if (!activeScanTarget) return;

    // Add new findings
    setFindings((prev) => [...newFindings, ...prev]);

    // Map to regulations
    const newMappings: Pemetaan_Kepatuhan[] = [];
    newFindings.forEach((f) => {
      const generated = mapFindingToRegulations(f, regulations);
      newMappings.push(...generated);
    });
    setMappings((prev) => [...newMappings, ...prev]);

    // Add completed session
    const newSession: Sesi_Audit = {
      id_sesi: `SES-${Date.now()}`,
      id_target: activeScanTarget.id_target,
      target_nama: activeScanTarget.nama_target,
      target_tipe: activeScanTarget.tipe,
      waktu_mulai: new Date().toLocaleTimeString('id-ID') + ' WIB',
      waktu_selesai: new Date().toLocaleTimeString('id-ID') + ' WIB',
      status: 'Completed',
      progres_persen: 100,
      total_temuan: newFindings.length,
      temuan_kritis: newFindings.filter((f) => f.tingkat_keparahan === 'Kritis').length,
      temuan_tinggi: newFindings.filter((f) => f.tingkat_keparahan === 'Tinggi').length,
      temuan_sedang: newFindings.filter((f) => f.tingkat_keparahan === 'Sedang').length,
      temuan_rendah: 0,
      tabel_pii_terekspos: newFindings.filter((f) => f.kategori === 'PII').length,
      skor_kepatuhan: 40,
      kategori_risiko: 'Beresiko',
      catatan_audit: `Pemindaian langsung tuntas: ${newFindings.length} temuan baru teridentifikasi.`,
    };

    setSessions((prev) => [newSession, ...prev]);

    recordAudit(
      'SELESAI_PINDAI',
      activeScanTarget.nama_target,
      `Sesi audit tuntas dengan ${newFindings.length} temuan teknis baru`
    );

    setActiveScanTarget(null);
  };

  const handleCancelScan = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id_sesi === sessionId
          ? {
              ...s,
              status: 'Cancelled',
            }
          : s
      )
    );
    recordAudit('BATALKAN_PINDAI', 'Sesi Audit', `Membatalkan pemindaian sesi ${sessionId}`);
  };

  const handleUpdateFindingStatus = (
    findingId: string,
    newStatus: Temuan_Teknis['status_remediasi']
  ) => {
    setFindings((prev) =>
      prev.map((f) =>
        f.id_temuan === findingId
          ? {
              ...f,
              status_remediasi: newStatus,
            }
          : f
      )
    );

    const f = findings.find((item) => item.id_temuan === findingId);
    if (f) {
      recordAudit(
        'REMEDIASI_UPDATE',
        f.judul_temuan,
        `Status remediasi diperbarui menjadi: ${newStatus}`
      );
    }
  };

  // If user is not authenticated, display Login & Register screen
  if (!currentUser) {
    return (
      <AuthPage
        users={allUsers}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Topbar
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchRole={handleSwitchRole}
        activeScanCount={activeScanCount}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentUser={currentUser}
          findingsCount={findings.length}
          targetsCount={targets.length}
          onLogout={handleLogout}
        />

        {/* Main Workspace Viewport */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {/* Active View: Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Role Perspective Banner */}
              <RolePerspectiveBanner
                currentUser={currentUser}
                complianceScore={currentScore}
                criticalCount={criticalFindingsCount}
                exposedPiiCount={exposedPiiTablesCount}
                onNavigate={setActiveTab}
              />

              {/* Wireframe Metric Cards */}
              <MetricCards
                criticalVulnerabilities={criticalFindingsCount}
                exposedPiiTables={exposedPiiTablesCount}
                complianceScore={currentScore}
                riskCategory={riskCategory}
                lastUpdated="Hari ini, 08:00 WIB"
                onNavigateTab={(tab) => setActiveTab(tab)}
              />

              {/* Wireframe Recent Scans Table */}
              <RecentScans
                sessions={sessions}
                targets={targets}
                onViewFindings={(sess) => {
                  setActiveTab('findings');
                  recordAudit('LIHAT_TEMUAN', sess.target_nama, `Melihat rincian temuan sesi ${sess.id_sesi}`);
                }}
                onDownloadReport={(sess) => {
                  setActiveTab('report');
                  recordAudit('AKSES_LAPORAN', sess.target_nama, `Membuka laporan kepatuhan sesi ${sess.id_sesi}`);
                }}
                onCancelScan={handleCancelScan}
                onStartScan={handleStartScan}
              />
            </div>
          )}

          {/* Active View: Target Management */}
          {activeTab === 'targets' && (
            <div className="max-w-7xl mx-auto">
              <TargetManager
                targets={targets}
                onAddTarget={handleAddTarget}
                onDeleteTarget={handleDeleteTarget}
                onTestConnection={handleTestConnection}
                onStartScan={handleStartScan}
              />
            </div>
          )}

          {/* Active View: Findings */}
          {activeTab === 'findings' && (
            <div className="max-w-7xl mx-auto">
              <FindingsView
                findings={findings}
                onUpdateStatus={handleUpdateFindingStatus}
                onNavigateToMatrix={() => setActiveTab('matrix')}
              />
            </div>
          )}

          {/* Active View: Regulation Matrix */}
          {activeTab === 'matrix' && (
            <div className="max-w-7xl mx-auto">
              <RegulationMatrix
                findings={findings}
                regulations={regulations}
                mappings={mappings}
                onGenerateReport={() => setActiveTab('report')}
              />
            </div>
          )}

          {/* Active View: Compliance Report */}
          {activeTab === 'report' && (
            <div className="max-w-7xl mx-auto">
              <ComplianceReport
                report={{
                  ...report,
                  skor_kepatuhan: currentScore,
                  total_temuan_kritis: criticalFindingsCount,
                  total_pii_terekspos: exposedPiiTablesCount,
                }}
                findings={findings}
                regulations={regulations}
                mappings={mappings}
                currentUser={currentUser}
              />
            </div>
          )}

          {/* Active View: Audit Trail */}
          {activeTab === 'audit_trail' && (
            <div className="max-w-7xl mx-auto">
              <AuditTrailView logs={auditLogs} />
            </div>
          )}
        </main>
      </div>

      {/* Live Scan Modal */}
      {activeScanTarget && (
        <LiveScanModal
          target={activeScanTarget}
          onClose={() => setActiveScanTarget(null)}
          onScanComplete={handleScanCompleted}
        />
      )}
    </div>
  );
}
