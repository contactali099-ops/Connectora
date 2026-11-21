import { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Flag, Ban, UserX, CheckCircle2, ArrowRight } from 'lucide-react';
import { AppRoute, PublicProfile, ReportReason } from '../types/platform';

interface SafetyPageProps {
  profiles: PublicProfile[];
  preselectedReportProfileId?: string | null;
  onSubmitReport: (payload: {
    reportedProfileId: string;
    reason: ReportReason;
    description: string;
    evidenceNote?: string;
  }) => void;
  onNavigate: (route: AppRoute) => void;
}

const REPORT_REASONS: ReportReason[] = [
  'Harassment',
  'Fake Profile / Impersonation',
  'Spam or Scam',
  'Underage Concern',
  'Inappropriate Content',
];

export function SafetyPage({
  profiles,
  preselectedReportProfileId,
  onSubmitReport,
  onNavigate,
}: SafetyPageProps) {
  const [reportedProfileId, setReportedProfileId] = useState(
    preselectedReportProfileId ?? profiles[0]?.id ?? ''
  );
  const [reason, setReason] = useState<ReportReason>('Harassment');
  const [description, setDescription] = useState('');
  const [evidenceNote, setEvidenceNote] = useState('');
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedReportProfileId) {
      setReportedProfileId(preselectedReportProfileId);
    }
  }, [preselectedReportProfileId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitted(false);

    if (!reportedProfileId) {
      setFormError('Please select a profile to report.');
      return;
    }
    if (description.trim().length < 10) {
      setFormError('Please provide at least 10 characters describing what happened.');
      return;
    }

    onSubmitReport({
      reportedProfileId,
      reason,
      description: description.trim(),
      evidenceNote: evidenceNote.trim() || undefined,
    });

    setDescription('');
    setEvidenceNote('');
    setSubmitted(true);
  };

  const guidelines = [
    {
      title: 'Protect Private Information',
      body: 'Never share your home address, financial details, workplace schedule, or personal government IDs in chat. Connectora keeps your email, exact address, and full birthdate private.',
      icon: Lock,
    },
    {
      title: 'Keep Early Conversations on Platform',
      body: 'Use Connectora private messaging—restricted exclusively to mutual matches—until you feel genuinely comfortable moving forward.',
      icon: ShieldCheck,
    },
    {
      title: 'Block & Unmatch Anytime',
      body: 'If an interaction feels uncomfortable, block or unmatch immediately from any profile or chat header. Blocked users cannot view your profile or message you.',
      icon: Ban,
    },
    {
      title: 'Report Abuse, Impersonation & Underage Concerns',
      body: 'Submit confidential reports for harassment, fake profiles, spam, impersonation, or suspected under-18 accounts. Reports are private to authorized moderators.',
      icon: UserX,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold text-[#7256D9]">Trust &amp; Safety Center</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#17243A] [text-wrap:balance]">
          Safety guidance, privacy protection, and confidential reporting.
        </h1>
        <p className="text-base text-[#74798A] leading-relaxed">
          Connectora is built exclusively for adults aged 18 and older. Every report creates a
          private moderation record accessible only to authorized administrators—never visible to
          other members.
        </p>
      </div>

      {/* Guidance Grid */}
      <section aria-label="Safety guidance" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guidelines.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white border border-[#E4E6F0] rounded-2xl p-6 sm:p-7 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EEE9FF] text-[#7256D9] flex items-center justify-center">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="font-display text-lg font-bold text-[#17243A]">{item.title}</h2>
              <p className="text-sm text-[#74798A] leading-relaxed">{item.body}</p>
            </div>
          );
        })}
      </section>

      {/* Private Report Form & Moderator Link */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white border border-[#E4E6F0] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5">
            <Flag className="w-5 h-5 text-[#7256D9]" aria-hidden="true" />
            <h2 className="font-display text-2xl font-bold text-[#17243A]">
              Submit a Private Safety Report
            </h2>
          </div>
          <p className="text-sm text-[#74798A]">
            Reports are confidential. The reported account is never notified who filed a report,
            and records are visible only to authorized moderators.
          </p>

          {submitted && (
            <div className="p-4 rounded-xl bg-[#EEE9FF] border border-[#D9CEF9] text-sm text-[#17243A] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#7256D9] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold">Private moderation record created</p>
                <p className="text-xs text-[#20243A]/85 mt-0.5">
                  Your report has been added to the private moderation queue. You can also block the
                  account at any time.
                </p>
              </div>
            </div>
          )}

          {formError && (
            <div className="p-3.5 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] text-sm text-[#B42318]">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="report-user"
                className="block text-xs font-semibold text-[#20243A] mb-1.5"
              >
                Reported User
              </label>
              <select
                id="report-user"
                value={reportedProfileId}
                onChange={(e) => setReportedProfileId(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.displayName} ({p.generalLocation} — Sample Profile)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="report-reason"
                className="block text-xs font-semibold text-[#20243A] mb-1.5"
              >
                Reason for Report
              </label>
              <select
                id="report-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                className="w-full min-h-[44px] px-3 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="report-desc"
                className="block text-xs font-semibold text-[#20243A] mb-1.5"
              >
                Description of Incident
              </label>
              <textarea
                id="report-desc"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened, including dates or behavior violating community guidelines..."
                className="w-full p-3.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
              />
            </div>

            <div>
              <label
                htmlFor="report-evidence"
                className="block text-xs font-semibold text-[#20243A] mb-1.5"
              >
                Optional Supporting Evidence / Context Reference
              </label>
              <input
                id="report-evidence"
                type="text"
                value={evidenceNote}
                onChange={(e) => setEvidenceNote(e.target.value)}
                placeholder="Optional message timestamp, screenshot reference, or note"
                className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
              />
            </div>

            <button
              type="submit"
              className="min-h-[46px] px-6 py-2.5 text-sm font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-xl transition-colors cursor-pointer"
            >
              Submit Private Report
            </button>
          </form>
        </div>

        {/* Account Safety & Admin Moderation Link */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#17243A] text-white rounded-2xl p-7 space-y-4">
            <h3 className="font-display text-xl font-bold">Meeting in Person?</h3>
            <ul className="space-y-2.5 text-sm text-[#C7CDD9]">
              <li>· Choose a busy, well-lit public venue for first meetings.</li>
              <li>· Arrange your own transportation to and from the meetup.</li>
              <li>· Share your general plan and check-in time with a trusted friend.</li>
              <li>· Trust your judgment—leave immediately if anything feels off.</li>
            </ul>
          </div>

          <div className="bg-[#F4F5F8] border border-[#E4E6F0] rounded-2xl p-7 space-y-4">
            <h3 className="font-display text-lg font-bold text-[#17243A]">
              Authorized Admin Moderation Desk
            </h3>
            <p className="text-sm text-[#74798A] leading-relaxed">
              In production, only accounts with verified administrator or moderator claims in
              Supabase can view moderation records. Preview the moderation workflow below.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('moderation')}
              className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-[#17243A] bg-white hover:bg-[#EEE9FF] border border-[#E4E6F0] rounded-xl inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Open Moderation Console</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
