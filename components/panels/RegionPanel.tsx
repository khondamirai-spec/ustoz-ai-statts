"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { User } from "@/lib/types";

type FetchState = "idle" | "loading" | "success" | "error";
type TabType = "tuman" | "mfy" | "maktab";

const friendlyNames: Record<string, string> = {
  "Xorazm viloyati": "Xorazm",
  "Farg'ona viloyati": "Farg'ona",
  "Andijon viloyati": "Andijon",
  "Surxondaryo viloyati": "Surxondaryo",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

interface RegionPanelProps {
  region: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RegionPanel({ region, isOpen, onClose }: RegionPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<FetchState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("tuman");

  useEffect(() => {
    if (!region) {
      setUsers([]);
      setStatus("idle");
      setError(null);
      return;
    }

    const controller = new AbortController();
    setStatus("loading");
    setError(null);

    // Map region names to API format
    const regionMap: Record<string, string> = {
      "Xorazm viloyati": "Khorezm",
      "Farg'ona viloyati": "Ferghana",
      "Andijon viloyati": "Andijon",
      "Surxondaryo viloyati": "Surkhandarya",
    };
    
    const apiRegionName = regionMap[region] || region.replace(" viloyati", "");
    
    fetch(`/api/users/${encodeURIComponent(apiRegionName)}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fetch users");
        }
        return response.json();
      })
      .then((payload) => {
        if (controller.signal.aborted) return;
        setUsers(payload.users ?? []);
        setStatus("success");
      })
      .catch((err: Error) => {
        if (controller.signal.aborted) return;
        setError(err.message);
        setUsers([]);
        setStatus("error");
      });

    return () => controller.abort();
  }, [region]);

  const regionDisplayName = region ? (friendlyNames[region] || region.replace(" viloyati", "")) : "";

  return (
    <AnimatePresence>
      {isOpen && region && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                ACTIVE REGION
              </p>
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <h2 className="text-xl font-bold text-white">{regionDisplayName}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setActiveTab("tuman")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "tuman"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  Tuman/shahar
                </button>
                <button
                  onClick={() => setActiveTab("mfy")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "mfy"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  MFY
                </button>
                <button
                  onClick={() => setActiveTab("maktab")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "maktab"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  Maktab
                </button>
              </div>
            </div>

            {/* Summary Card */}
            <div className="px-6 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl px-4 py-3 flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <h3 className="text-lg font-bold text-white">{regionDisplayName}</h3>
                  <p className="text-sm text-white/90">
                    {status === "success" ? `${users.length} users registered` : "Loading..."}
                  </p>
                </div>
              </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {activeTab === "tuman" && (
                <>
                  {status === "loading" && (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                      <p className="text-sm text-slate-500 mt-4">Loading users...</p>
                    </div>
                  )}

                  {status === "success" && users.length > 0 && (
                    <div className="space-y-3">
                      {users.map((user, index) => (
                        <motion.div
                          key={`${user.name}-${user.joinedAt}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                              {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-semibold text-slate-900 mb-1">
                                {user.name}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <span>Joined {dateFormatter.format(new Date(user.joinedAt))}</span>
                              </div>
                            </div>
                            <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                              {user.age} yrs
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {status === "success" && users.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <p className="text-sm text-slate-500">No users in this region yet.</p>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <p className="text-sm text-rose-600">{error ?? "Unable to load users."}</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === "mfy" && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="p-4 bg-purple-100 rounded-2xl mb-4">
                    <svg
                      className="w-12 h-12 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">MFY Information</h3>
                  <p className="text-sm text-slate-500">MFY data will be displayed here</p>
                </div>
              )}

              {activeTab === "maktab" && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="p-4 bg-purple-100 rounded-2xl mb-4">
                    <svg
                      className="w-12 h-12 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Maktab Information</h3>
                  <p className="text-sm text-slate-500">Maktab data will be displayed here</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

