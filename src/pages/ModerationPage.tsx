import { useState } from 'react';
import { ShieldCheck, Lock, Eye, Ban, CheckCircle2 } from 'lucide-react';
import {
  ModerationActionRecord,
  PrivateUserProfile,
  PublicProfile,
  ReportStatus,
  SafetyReport,
} from '../types/platform';
import { PreviewModeBanner } from '../components/PreviewModeBanner';

interface ModerationPageProps {
  currentUser: PrivateUserProfile | null;
  profiles: PublicProfile[];
  reports: SafetyReport[];
  actionsLog: ModerationActionRecord[];
  onUpdateReportStatus: (reportId: string, status: ReportStatus, notes: string) => void;
  onToggleSuspendProfile: (profileId: string, suspend: boolean, notes: string) => void;
  onViewProfile: (profile: PublicProfile) => void;
  onRequireAuth: () => void;
}

export function ModerationPage({
  currentUser,
  profiles,
  reports,
  actionsLog,
  onUpdateReportStatus,
  onToggleSuspendProfile,
  onViewProfile,
  onRequireAuth,
}: ModerationPageProps) {
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id ?? '');
  const [modNote, setModNote] = useState('');

  const isAuthorizedModerator =
    currentUser && (currentUser.role === 'moderator' || currentUser.role === 'admin');

  if (!isAuthorizedModerator) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white border border-[#E4E6F0] rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#EEE9FF] text-[#7256D9] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[#17243A]">
            Restricted: Authorized Administrators Only
          </h1>
          <p className="text-sm text-[#74798A] max-w-md mx-auto">
            Moderation records are strictly private and never exposed to standard members. Sign in
            with the Demo Adult Session (which includes Moderator Preview access) to inspect the
            moderation console.
          </p>
          <button
            type="button"
            onClick={onRequireAuth}
            className="min-h-[44px] px-6 py-2.5 text-sm font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-xl cursor-pointer"
          >
            Sign In with Demo Moderator Preview
          </button>
        </div>
      </div>
    );
  }

  const profileMap = new Map(profiles.map((p) => [p.id, p]));
  const filteredReports = reports.filter((r) =>
    statusFilter === 'all' ? true : r.status === statusFilter
  );
  const selectedReport =
    filteredReports.find((r) => r.id === selectedReportId) ?? filteredReports[0] ?? null;
  const targetProfile = selectedReport
    ? profileMap.get(selectedReport.reportedProfileId) ?? null
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-[#7256D9]">Authorized Administrator View</p>
          <h1 className="font-display text-3xl font-bold text-[#17243A]">
            Moderation &amp; Safety Queue
          </h1>
          <p className="text-sm text-[#74798A]">
            Review submitted reports, inspect reported profiles, update statuses, and record
            account enforcement actions.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#17243A] bg-[#EEE9FF] px-3.5 py-2 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-[#7256D9]" aria-hidden="true" />
          <span>Role: {currentUser.role}</span>
        </div>
      </div>

      <PreviewModeBanner contextNote="This Admin Moderation Console demonstrates role-gated report triage, suspension controls, and audit logging. In production, PostgreSQL RLS restricts reports strictly to verified moderator JWT claims." />

      {/* Segmented Status Filter */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F4F5F8] rounded-xl w-fit">
        {(['all', 'pending', 'reviewed', 'resolved'] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg capitalize cursor-pointer ${
              statusFilter === status
                ? 'bg-white text-[#17243A] shadow-xs font-semibold'
                : 'text-[#74798A] hover:text-[#17243A]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Queue + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Reports List */}
        <div className="lg:col-span-6 bg-white border border-[#E4E6F0] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E4E6F0] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#17243A]">
              Submitted Reports ({filteredReports.length})
            </h2>
            <span className="text-xs text-[#74798A]">Private Records</span>
          </div>

          {filteredReports.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#74798A]">
              No reports match this status filter.
            </div>
          ) : (
            <div className="divide-y divide-[#E4E6F0]">
              {filteredReports.map((rpt) => {
                const isSelected = selectedReport?.id === rpt.id;
                return (
                  <button
                    key={rpt.id}
                    type="button"
                    onClick={() => setSelectedReportId(rpt.id)}
                    className={`w-full px-5 py-4 text-left space-y-1.5 transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#EEE9FF]/55' : 'hover:bg-[#F4F5F8]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono tabular-nums text-[#74798A]">{rpt.id}</span>
                      <span
                        className={`font-semibold capitalize ${
                          rpt.status === 'pending'
                            ? 'text-[#D97706]'
                            : rpt.status === 'reviewed'
                              ? 'text-[#7256D9]'
                              : 'text-[#16A34A]'
                        }`}
                      >
                        {rpt.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[#17243A]">{rpt.reportedDisplayName}</p>
                    <p className="text-xs text-[#74798A]">
                      {rpt.reason} ·{' '}
                      <span className="font-mono tabular-nums">
                        {new Date(rpt.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Report Detail & Enforcement */}
        <div className="lg:col-span-6 bg-white border border-[#E4E6F0] rounded-2xl p-6 space-y-5">
          {!selectedReport ? (
            <p className="text-sm text-[#74798A]">Select a report record to review.</p>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 border-b border-[#E4E6F0] pb-4">
                <div>
                  <p className="text-xs font-mono tabular-nums text-[#74798A]">
                    {selectedReport.id} · {selectedReport.isDemo ? 'Sample Record' : 'Live Record'}
                  </p>
                  <h2 className="font-display text-xl font-bold text-[#17243A] mt-1">
                    {selectedReport.reportedDisplayName}
                  </h2>
                  <p className="text-xs text-[#74798A] mt-0.5">
                    Reason: <strong className="text-[#20243A]">{selectedReport.reason}</strong>
                  </p>
                </div>
                {targetProfile && (
                  <button
                    type="button"
                    onClick={() => onViewProfile(targetProfile)}
                    className="min-h-[38px] px-3 py-1.5 text-xs font-semibold text-[#17243A] bg-[#F4F5F8] hover:bg-[#EEE9FF] rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Inspect Profile</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#74798A]">Report Description</p>
                <p className="text-sm text-[#20243A] leading-relaxed bg-[#FCFBFF] p-3.5 rounded-xl border border-[#E4E6F0]">
                  {selectedReport.description}
                </p>
                {selectedReport.evidenceNote && (
                  <p className="text-xs text-[#74798A]">
                    Evidence reference: {selectedReport.evidenceNote}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="mod-notes" className="block text-xs font-semibold text-[#20243A] mb-1.5">
                  Moderation Action Note
                </label>
                <input
                  id="mod-notes"
                  type="text"
                  value={modNote}
                  onChange={(e) => setModNote(e.target.value)}
                  placeholder="Enter reason for status update or account action..."
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#74798A]">Update Report Status</p>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'reviewed', 'resolved'] as ReportStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onUpdateReportStatus(
                          selectedReport.id,
                          st,
                          modNote.trim() || `Marked report ${st}`
                        );
                        setModNote('');
                      }}
                      className={`min-h-[38px] px-3.5 py-1.5 text-xs font-semibold rounded-lg border capitalize cursor-pointer ${
                        selectedReport.status === st
                          ? 'bg-[#7256D9] border-[#7256D9] text-white'
                          : 'bg-[#FCFBFF] border-[#E4E6F0] text-[#20243A] hover:bg-[#F4F5F8]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {targetProfile && (
                <div className="pt-4 border-t border-[#E4E6F0] flex items-center justify-between gap-3">
                  <span className="text-xs text-[#74798A]">
                    Account Status:{' '}
                    <strong className="text-[#17243A] capitalize">{targetProfile.status}</strong>
                  </span>
                  {targetProfile.status === 'active' ? (
                    <button
                      type="button"
                      onClick={() => {
                        onToggleSuspendProfile(
                          targetProfile.id,
                          true,
                          modNote.trim() || 'Suspended pending safety review'
                        );
                        setModNote('');
                      }}
                      className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-[#B42318] hover:bg-[#912018] rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Suspend Account</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onToggleSuspendProfile(
                          targetProfile.id,
                          false,
                          modNote.trim() || 'Account restored after review'
                        );
                        setModNote('');
                      }}
                      className="min-h-[40px] px-4 py-2 text-xs font-semibold text-[#17243A] bg-[#EEE9FF] hover:bg-[#E1D8FE] rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7256D9]" aria-hidden="true" />
                      <span>Restore Account</span>
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Audit Log */}
      <section className="bg-white border border-[#E4E6F0] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E4E6F0]">
          <h2 className="text-sm font-bold text-[#17243A]">Moderation Action Audit Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F4F5F8] text-[#74798A] text-xs">
              <tr>
                <th className="px-5 py-3 font-semibold">Action ID</th>
                <th className="px-5 py-3 font-semibold">Target</th>
                <th className="px-5 py-3 font-semibold">Action</th>
                <th className="px-5 py-3 font-semibold">Notes</th>
                <th className="px-5 py-3 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E6F0]">
              {actionsLog.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#FCFBFF]">
                  <td className="px-5 py-3.5 font-mono tabular-nums text-xs text-[#74798A]">
                    {entry.id}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-[#17243A]">
                    {entry.targetDisplayName}
                  </td>
                  <td className="px-5 py-3.5 text-[#7256D9] font-medium">{entry.actionType}</td>
                  <td className="px-5 py-3.5 text-[#20243A]">{entry.notes}</td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-xs text-[#74798A]">
                    {new Date(entry.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
