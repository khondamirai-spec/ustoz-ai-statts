"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import DistrictPanel from "./DistrictPanel";
import MfyPanel from "./MfyPanel";
import SchoolPanel from "./SchoolPanel";

const transition = { type: "spring", stiffness: 360, damping: 32 };

const MAIN_TABS = [
  {
    key: "districts",
    label: "Districts",
    gradient: "from-indigo-500 via-purple-500 to-sky-500",
  },
  {
    key: "mfy",
    label: "MFY",
    gradient: "from-emerald-500 via-teal-500 to-sky-400",
  },
  {
    key: "schools",
    label: "Schools",
    gradient: "from-indigo-500 via-sky-500 to-blue-500",
  },
];

const NESTED_TABS = [
  {
    key: "mfy",
    label: "MFY info",
    gradient: "from-emerald-500 via-teal-500 to-sky-400",
  },
  {
    key: "schools",
    label: "Schools info",
    gradient: "from-indigo-500 via-sky-500 to-blue-500",
  },
];

/**
 * @typedef {import("./RegionList").RegionCardData} RegionCardData
 */

/**
 * @typedef {Object} Summary
 * @property {number} users
 * @property {number} views
 * @property {number} certificates
 */

/**
 * @typedef {Object} DistrictStat
 * @property {string=} district
 * @property {string=} name
 * @property {number=} users
 * @property {number=} views
 * @property {number=} certificates
 */

/**
 * @typedef {Object} LocationStat
 * @property {string=} village
 * @property {string=} school
 * @property {string=} district
 * @property {string=} name
 * @property {number=} users
 * @property {number=} views
 * @property {number=} certificates
 */

/**
 * @param {{
 *  isOpen: boolean;
 *  regionName?: string | null;
 *  regionSummary?: Summary | null;
 *  activeTab: "districts" | "mfy" | "schools";
 *  onClose?: () => void;
 *  onTabChange?: (tab: "districts" | "mfy" | "schools") => void;
 *  onDistrictSelect?: (districtName: string) => void;
 *  districts?: DistrictStat[];
 *  districtsLoading?: boolean;
 *  districtsError?: string | null;
 *  isNestedOpen?: boolean;
 *  onNestedClose?: () => void;
 *  activeDistrict?: string | null;
 *  nestedView: "mfy" | "schools";
 *  onNestedViewChange?: (view: "mfy" | "schools") => void;
 *  villages?: LocationStat[];
 *  schools?: LocationStat[];
 *  nestedLoading?: boolean;
 *  nestedError?: string | null;
 * }} props
 */
export default function RightPanel({
  isOpen,
  regionName,
  regionSummary,
  activeTab,
  onClose,
  onTabChange,
  onDistrictSelect,
  districts = [],
  districtsLoading = false,
  districtsError = null,
  isNestedOpen,
  onNestedClose,
  activeDistrict,
  nestedView,
  onNestedViewChange,
  villages = [],
  schools = [],
  nestedLoading = false,
  nestedError = null,
}) {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const headerDescription = useMemo(() => {
    if (!regionName) {
      return "Choose a region to explore real-time analytics for every district, MFY and school.";
    }
    return "Dive into the latest learner activity for the selected region. Tap any district to open a deeper breakdown.";
  }, [regionName]);

  const summaryItems = useMemo(() => {
    if (!regionSummary) return [];
    return [
      {
        key: "users",
        label: "Foydalanuvchilar",
        value: regionSummary.users,
        accent: "from-sky-500 via-cyan-400 to-sky-500",
        short: "USR",
      },
      {
        key: "views",
        label: "Ko'rishlar",
        value: regionSummary.views,
        accent: "from-indigo-500 via-purple-500 to-sky-500",
        short: "VIEW",
      },
      {
        key: "certificates",
        label: "Sertifikatlar",
        value: regionSummary.certificates,
        accent: "from-amber-500 via-orange-500 to-pink-500",
        short: "CERT",
      },
    ];
  }, [regionSummary]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-30 bg-slate-900/25 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            key="right-panel"
            className="fixed inset-y-0 right-0 z-40 flex w-full max-w-[46rem] min-w-[360px] flex-col overflow-hidden rounded-l-[36px] border-l border-slate-200/70 bg-slate-50 shadow-[0_42px_120px_rgba(15,23,42,0.28)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={transition}
          >
            <div className="flex h-full flex-col">
              <header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-sky-900 text-white shadow-[0_32px_80px_rgba(15,23,42,0.35)]">
                <div className="pointer-events-none absolute inset-0 opacity-70">
                  <div className="absolute -left-24 top-12 h-64 w-64 rounded-full bg-sky-500/45 blur-3xl" />
                  <div className="absolute right-[-140px] bottom-[-80px] h-72 w-72 rounded-full bg-indigo-500/40 blur-3xl" />
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white transition-all duration-200 hover:scale-105 hover:bg-white hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  aria-label="Close region panel"
                >
                  <span className="text-xl font-medium leading-none">×</span>
                </button>
                <div className="relative px-8 pt-12 pb-16">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.45em] text-white/70">
                    Region analytics
                  </span>
                  <h3 className="mt-4 text-3xl font-semibold tracking-tight">Region Details</h3>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75">
                    {headerDescription}
                  </p>
                </div>
                <div className="relative -mt-14 px-8 pb-12">
                  <div className="rounded-3xl border border-white/20 bg-white/10 p-7 shadow-[0_34px_90px_rgba(15,23,42,0.4)] backdrop-blur-2xl">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white/65">
                          Tanlangan hudud
                        </p>
                        <h4 className="text-2xl font-semibold tracking-tight text-white">
                          {regionName || "Region belgilanmagan"}
                        </h4>
                        <p className="text-sm text-white/75">
                          {regionName
                            ? "Hudud bo‘yicha foydalanuvchilar, ko‘rishlar va sertifikatlar statistikasini kuzatib boring."
                            : "Panelni ochish uchun chap tomondagi ro‘yxatdan hududni tanlang."}
                        </p>
                      </div>
                      {summaryItems.length > 0 ? (
                        <dl className="grid w-full gap-4 sm:grid-cols-3">
                          {summaryItems.map(({ key, label, value, accent, short }) => (
                            <div
                              key={key}
                              className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/12 px-5 py-5 shadow-[0_28px_56px_rgba(15,23,42,0.32)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1"
                            >
                              <div
                                className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-[10px] font-semibold uppercase tracking-[0.28em] text-white shadow-lg`}
                              >
                                {short}
                              </div>
                              <dt className="mt-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70">
                                {label}
                              </dt>
                              <dd className="mt-2 text-2xl font-semibold text-white">
                                {value.toLocaleString("uz-UZ")}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <div className="rounded-2xl border border-white/20 bg-white/12 px-5 py-4 text-sm text-white/80">
                          Statistikani ko‘rish uchun hududni tanlang yoki ro‘yxatdan birini bosing.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </header>

              <main className="relative flex-1 overflow-hidden">
                <div className="flex h-full flex-col gap-6 px-8 py-8">
                  <nav className="rounded-2xl border border-slate-200 bg-white/95 p-1 shadow-[0_22px_44px_rgba(15,23,42,0.12)] backdrop-blur">
                    <div className="grid grid-cols-3 gap-1">
                      {MAIN_TABS.map(({ key, label, gradient }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => onTabChange?.(key)}
                          className="group relative rounded-xl text-sm font-semibold text-slate-600 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200/60"
                        >
                          <span
                            className={`block rounded-[16px] px-4 py-3 text-center transition-all duration-200 ${
                              activeTab === key
                                ? `bg-gradient-to-r ${gradient} text-white shadow-[0_16px_32px_rgba(99,102,241,0.35)]`
                                : "bg-white/90 text-slate-500 shadow-sm hover:bg-slate-100 hover:text-slate-800"
                            }`}
                          >
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </nav>

                  <section className="relative flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_70px_rgba(15,23,42,0.14)]">
                    <div className="h-full overflow-y-auto px-6 py-7">
                      <AnimatePresence mode="wait">
                        {activeTab === "districts" && (
                          <motion.div
                            key="districts"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.22 }}
                          >
                            <DistrictPanel
                              regionName={regionName}
                              districts={districts}
                              isLoading={districtsLoading}
                              error={districtsError}
                              onSelectDistrict={onDistrictSelect}
                            />
                          </motion.div>
                        )}

                        {activeTab === "mfy" && (
                          <motion.div
                            key="mfy"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.22 }}
                          >
                            <MfyPanel
                              title="MFY overview"
                              description="Detailed MFY data is available per district. Select a district under the list to view live mahalla statistics."
                              contextLabel={regionName}
                            />
                          </motion.div>
                        )}

                        {activeTab === "schools" && (
                          <motion.div
                            key="schools"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.22 }}
                          >
                            <SchoolPanel
                              title="Schools summary"
                              description="Select a district to reveal granular school information such as learner counts, views and certificates."
                              contextLabel={regionName}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </section>
                </div>
              </main>

              <AnimatePresence>
                {isNestedOpen && (
                  <motion.div
                    key="nested-panel"
                    className="absolute inset-y-0 right-0 z-50 flex w-full max-w-[400px] flex-col overflow-hidden border-l border-slate-200 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.24)]"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={transition}
                  >
                    <header className="relative overflow-hidden bg-gradient-to-br from-sky-700 via-indigo-600 to-purple-600 text-white shadow-lg">
                      <div className="pointer-events-none absolute inset-0 opacity-70">
                        <div className="absolute -left-12 top-6 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
                        <div className="absolute right-[-100px] bottom-[-80px] h-60 w-60 rounded-full bg-indigo-400/35 blur-2xl" />
                      </div>
                      <button
                        type="button"
                        onClick={onNestedClose}
                        className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                      >
                        <span className="text-base" aria-hidden>
                          ←
                        </span>
                        Orqaga
                      </button>
                      <div className="relative px-7 pt-16 pb-14">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-white/70">
                          District focus
                        </span>
                        <h4 className="mt-4 text-2xl font-semibold leading-tight text-white">
                          {activeDistrict || "District tanlanmagan"}
                        </h4>
                        <p className="mt-4 text-sm leading-relaxed text-white/80">
                          MFY va maktablar bo‘yicha batafsil ma’lumotlarni shu oynadan kuzating.
                        </p>
                      </div>
                    </header>

                    <div className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white/90 p-1 shadow-sm">
                        {NESTED_TABS.map(({ key, label, gradient }) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => onNestedViewChange?.(key)}
                            className="group relative rounded-xl text-sm font-semibold text-slate-600 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200/60"
                          >
                            <span
                              className={`block rounded-[14px] px-4 py-2.5 text-center transition-all duration-200 ${
                                nestedView === key
                                  ? `bg-gradient-to-r ${gradient} text-white shadow-[0_16px_30px_rgba(59,130,246,0.28)]`
                                  : "bg-white/90 text-slate-500 shadow-sm hover:bg-slate-100 hover:text-slate-800"
                              }`}
                            >
                              {label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 overflow-hidden bg-slate-50">
                      <div className="h-full overflow-y-auto px-6 py-8">
                        {nestedView === "mfy" ? (
                          <MfyPanel
                            title="District MFY preview"
                            description="Live MFY statistics powered by the education analytics API."
                            contextLabel={activeDistrict}
                            items={villages}
                            isLoading={nestedLoading}
                            error={nestedError}
                          />
                        ) : (
                          <SchoolPanel
                            title="District schools preview"
                            description="Live school metrics including learners, views and certificates."
                            contextLabel={activeDistrict}
                            items={schools}
                            isLoading={nestedLoading}
                            error={nestedError}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}


