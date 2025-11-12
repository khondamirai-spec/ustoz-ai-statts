/**
 * @typedef {Object} LocationStat
 * @property {string=} village
 * @property {string=} name
 * @property {string=} district
 * @property {number=} users
 * @property {number=} views
 * @property {number=} certificates
 */

/**
 * @param {{
 *  title: string;
 *  description?: string;
 *  contextLabel?: string | null;
 *  items?: LocationStat[];
 *  isLoading?: boolean;
 *  error?: string | null;
 * }} props
 */
export default function MfyPanel({
  title,
  description,
  contextLabel,
  items = [],
  isLoading = false,
  error = null,
}) {
  const hasData = items.length > 0;

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          {contextLabel ? `Context: ${contextLabel}` : "Context pending"}
        </p>
        <h4 className="text-xl font-semibold text-slate-900">{title}</h4>
      </header>

      <div className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-lg shadow-emerald-500/[0.08] backdrop-blur-xl">
        {description && (
          <p className="text-sm leading-relaxed text-slate-500">{description}</p>
        )}

        {isLoading && (
          <div className="mt-6 flex items-center justify-center gap-3 text-sm text-emerald-500">
            <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
            Loading MFY analytics...
          </div>
        )}

        {error && !isLoading && (
          <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <>
            {hasData ? (
              <ul className="mt-6 space-y-3">
                {items.map((item, index) => {
                  const name = item?.village || item?.name || item?.district || `MFY ${index + 1}`;
                  const users =
                    typeof item?.users === "number" ? item.users : null;
                  const views =
                    typeof item?.views === "number" ? item.views : null;
                  const certificates =
                    typeof item?.certificates === "number"
                      ? item.certificates
                      : null;

                  return (
                    <li
                      key={name + index}
                      className="rounded-2xl border border-emerald-100/70 bg-white/90 px-4 py-4 shadow-sm shadow-emerald-500/10 transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {name}
                          </p>
                          <p className="text-xs text-slate-400">
                            Mahalla-level performance snapshot
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          <div className="min-w-[64px] rounded-lg border border-emerald-100 bg-emerald-50/60 px-2 py-1">
                            <p className="text-[10px] text-emerald-400">Users</p>
                            <p className="text-sm text-emerald-600">
                              {users !== null
                                ? users.toLocaleString("en-US")
                                : "—"}
                            </p>
                          </div>
                          <div className="min-w-[64px] rounded-lg border border-emerald-100 bg-emerald-50/60 px-2 py-1">
                            <p className="text-[10px] text-emerald-400">Views</p>
                            <p className="text-sm text-emerald-600">
                              {views !== null
                                ? views.toLocaleString("en-US")
                                : "—"}
                            </p>
                          </div>
                          <div className="min-w-[64px] rounded-lg border border-emerald-100 bg-emerald-50/60 px-2 py-1">
                            <p className="text-[10px] text-emerald-400">Cert</p>
                            <p className="text-sm text-emerald-600">
                              {certificates !== null
                                ? certificates.toLocaleString("en-US")
                                : "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-6 text-sm text-slate-500">
                MFY analytics will appear here as soon as data becomes available
                for this selection.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

