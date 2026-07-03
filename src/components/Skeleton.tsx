/**
 * Skeleton loader system — shimmer-animated placeholders that mirror real page layouts.
 * Used to replace empty-state flashes during Firebase data resolution.
 */

/** Base animated shimmer block */
function Bone({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] rounded-lg animate-shimmer ${className}`}
    />
  );
}

/** Full skeleton for DashboardHome — mirrors: header + 4 stat cards + 2 job cards */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto px-1 md:px-0">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Bone className="h-7 w-56" />
          <Bone className="h-3.5 w-72" />
        </div>
        <Bone className="h-9 w-32 rounded-xl" />
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-2">
            <Bone className="h-2.5 w-20" />
            <Bone className="h-7 w-12 mt-1" />
            <Bone className="h-2.5 w-28" />
          </div>
        ))}
      </div>

      {/* Job cards section */}
      <div className="space-y-4">
        <Bone className="h-3 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <Bone className="h-4 w-36" />
                  <Bone className="h-3 w-24" />
                </div>
                <Bone className="h-5 w-16 rounded-md" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Bone className="h-3 w-16" />
                  <Bone className="h-3 w-8" />
                </div>
                <Bone className="h-2 w-full rounded-full" />
                <div className="flex justify-between">
                  <Bone className="h-3 w-20" />
                  <Bone className="h-3 w-8" />
                </div>
                <Bone className="h-2 w-full rounded-full" />
              </div>
              <div className="flex gap-2 pt-1">
                <Bone className="h-8 flex-1 rounded-xl" />
                <Bone className="h-8 flex-1 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Full skeleton for Questions page — mirrors: tab strip + detail panel + question list */
export function QuestionsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* App selector tab strip */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-2 items-center">
        <Bone className="h-3 w-28" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Bone key={i} className="h-8 w-36 rounded-xl" />
        ))}
      </div>

      {/* Main grid: sidebar + question list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left sidebar panel */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <Bone className="h-5 w-32" />
          <Bone className="h-3.5 w-24" />
          <div className="space-y-2 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Bone className="h-3 w-20" />
                <Bone className="h-3 w-10" />
              </div>
            ))}
          </div>
          <Bone className="h-10 w-full rounded-xl mt-2" />
          <Bone className="h-10 w-full rounded-xl" />
        </div>

        {/* Question cards list */}
        <div className="md:col-span-2 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2.5">
              <div className="flex justify-between items-start gap-4">
                <Bone className="h-5 w-8 rounded-md" />
                <div className="flex gap-1.5">
                  <Bone className="h-5 w-16 rounded" />
                  <Bone className="h-5 w-14 rounded" />
                </div>
              </div>
              <Bone className="h-4 w-full" />
              <Bone className="h-4 w-4/5" />
              <Bone className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skeleton for QuizLauncher — tab strip + centered launch card */
export function QuizLauncherSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-2 items-center">
        <Bone className="h-3 w-28" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Bone key={i} className="h-8 w-36 rounded-xl" />
        ))}
      </div>
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-200 shadow-sm mt-8 space-y-6">
        <Bone className="h-7 w-48" />
        <Bone className="h-4 w-36" />
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-around items-center w-64">
          <div className="text-center space-y-1">
            <Bone className="h-7 w-10 mx-auto" />
            <Bone className="h-2.5 w-16" />
          </div>
          <div className="w-px bg-slate-200 h-12" />
          <div className="text-center space-y-1">
            <Bone className="h-7 w-16 mx-auto" />
            <Bone className="h-2.5 w-14" />
          </div>
        </div>
        <Bone className="h-14 w-64 rounded-xl" />
      </div>
    </div>
  );
}

/** Skeleton for Weaknesses — tab strip + 3 stat cards + topic rails */
export function WeaknessesSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-2 items-center">
        <Bone className="h-3 w-28" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Bone key={i} className="h-8 w-36 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-2">
            <Bone className="h-2.5 w-24" />
            <Bone className="h-8 w-16 mt-1" />
            <Bone className="h-2.5 w-32" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <Bone className="h-4 w-32" />
              <Bone className="h-5 w-16 rounded-full" />
            </div>
            <Bone className="h-2 w-full rounded-full" />
            <div className="flex gap-2">
              <Bone className="h-5 w-20 rounded" />
              <Bone className="h-5 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton for StudyPlan — tab strip + date panel + timeline cards */
export function StudyPlanSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-2 items-center">
        <Bone className="h-3 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Bone key={i} className="h-8 w-36 rounded-xl" />
        ))}
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <Bone className="h-5 w-40" />
          <Bone className="h-8 w-32 rounded-xl" />
        </div>
        <Bone className="h-3 w-64" />
      </div>
      <div className="space-y-4">
        <Bone className="h-3 w-36" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex gap-4">
            <div className="shrink-0 space-y-1 text-center">
              <Bone className="h-10 w-10 rounded-full" />
            </div>
            <div className="flex-1 space-y-2">
              <Bone className="h-4 w-48" />
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-4/5" />
              <div className="flex gap-2 pt-1">
                <Bone className="h-5 w-24 rounded" />
                <Bone className="h-5 w-20 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}