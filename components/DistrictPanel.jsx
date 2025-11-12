const SUMMARY_BLUEPRINT = [
  {
    key: "users",
    label: "Learners",
    gradient: "from-indigo-500/15 via-purple-500/12 to-sky-500/12",
    textColor: "text-indigo-600",
  },
  {
    key: "views",
    label: "Views",
    gradient: "from-sky-500/15 via-cyan-500/12 to-blue-500/12",
    textColor: "text-sky-600",
  },
  {
    key: "certificates",
    label: "Certificates",
    gradient: "from-emerald-500/15 via-teal-500/12 to-lime-500/12",
    textColor: "text-emerald-600",
  },
];

const SKELETON_COUNT = 6;

const capitalizeInitials = (input) => {
  if (!input) return "??";
  const initials = input
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return initials || input.slice(0, 2).toUpperCase();
};

/**
 * @typedef {Object} DistrictStat
 * @property {string=} district
 * @property {string=} name
 * @property {number=} users
 * @property {number=} views
 * @property {number=} certificates
 */

/**
 * @param {{
 *  regionName?: string | null;
 *  districts?: DistrictStat[];
 *  isLoading?: boolean;
 *  error?: string | null;
 *  onSelectDistrict?: (districtName: string) => void;
 * }} props
 */
export default function DistrictPanel({
  regionName,
  districts = [],
  isLoading = false,
  error = null,
  onSelectDistrict,
}) {
  const totals = districts.reduce(
    (acc, item) => {
      acc.users += Number(item?.users) || 0;
      acc.views += Number(item?.views) || 0;
      acc.certificates += Number(item?.certificates) || 0;
      return acc;
    },
    { users: 0, views: 0, certificates: 0 }
  );

  const hasData = districts.length > 0;

  return (
    <section className="space-y-7">
      <header className="rounded-3xl border border-white/60 bg-gradient-to-br from-white via-white to-slate-50 px-6 py-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-slate-400">
              District coverage
            </p>
            <h4 className="text-xl font-semibold text-slate-900">
              {regionName ? `${regionName} overview` : "Select a region"}
            </h4>
            <p className="text-sm leading-relaxed text-slate-500">
              Tap any district to open a focused view with MFY and school insights.
            </p>
          </div>
          {!isLoading && hasData && (
            <dl className="grid gap-3 text-center text-xs font-semibold text-slate-500 sm:grid-cols-3">
              {SUMMARY_BLUEPRINT.map(({ key, label, gradient, textColor }) => (
                <div
                  key={key}
                  className={`rounded-2xl border border-white/70 bg-gradient-to-br ${gradient} px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)]`}
                >
                  <dt className="text-[10px] uppercase tracking-[0.32em] text-slate-400">
                    {label}
                  </dt>
                  <dd className={`mt-1 text-lg font-semibold ${textColor}`}>
                    {totals[key].toLocaleString("en-US")}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </header>

      {error && (
        <div className="rounded-3xl border border-rose-100/80 bg-rose-50/85 px-5 py-4 text-sm font-medium text-rose-600 shadow-inner shadow-rose-500/10">
          {error}
        </div>
      )}

      <ul className="space-y-4">
        {(isLoading ? Array.from({ length: SKELETON_COUNT }) : districts).map(
          (district, index) => {
            if (isLoading) {
              return (
                <li
                  key={`district-skeleton-${index}`}
                  className="overflow-hidden rounded-3xl border border-slate-100/70 bg-white/90 px-6 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex items-center gap-4 animate-pulse">
                    <span className="h-12 w-12 rounded-2xl bg-slate-200/70" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-32 rounded-full bg-slate-200/70" />
                      <div className="h-3 w-24 rounded-full bg-slate-200/60" />
                    </div>
                    <div className="h-7 w-24 rounded-full bg-slate-200/60" />
                  </div>
                </li>
              );
            }

            const districtNameRaw =
              district?.district || district?.name || `District ${index + 1}`;
            const districtName =
              typeof districtNameRaw === "string" && districtNameRaw.trim()
                ? districtNameRaw.trim()
                : `District ${index + 1}`;

            const users =
              typeof district?.users === "number" ? district.users : null;
            const views =
              typeof district?.views === "number" ? district.views : null;
            const certificates =
              typeof district?.certificates === "number"
                ? district.certificates
                : null;

            return (
              <li
                key={`${districtName}-${index}`}
                className="group relative overflow-hidden rounded-3xl border border-slate-100/80 bg-white/95 px-6 py-5 shadow-[0_22px_54px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_30px_78px_rgba(79,70,229,0.18)]"
              >
                <button
                  type="button"
                  onClick={() => onSelectDistrict?.(districtName)}
                  className="flex w-full items-center justify-between gap-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_14px_32px_rgba(88,80,236,0.38)]">
                      {capitalizeInitials(districtName)}
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {districtName}
                      </p>
                      <p className="text-xs text-slate-400">
                        Tap to open MFY & school insights
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {users !== null && (
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 shadow-sm shadow-indigo-500/15">
                        {users.toLocaleString("en-US")} learners
                      </span>
                    )}
                    {views !== null && (
                      <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600 shadow-sm shadow-sky-500/15">
                        {views.toLocaleString("en-US")} views
                      </span>
                    )}
                    {certificates !== null && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 shadow-sm shadow-emerald-500/15">
                        {certificates.toLocaleString("en-US")} certs
                      </span>
                    )}
                  </div>
                </button>
              </li>
            );
          }
        )}

        {!isLoading && !error && !hasData && (
          <li className="rounded-3xl border border-slate-100/70 bg-white/90 px-6 py-7 text-center text-sm text-slate-500 shadow-inner">
            District data is not yet available for this region.
          </li>
        )}
      </ul>
    </section>
  );
}
