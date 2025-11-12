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

// Gradient colors for avatars
const avatarGradients = [
  "from-[#6A5AED] to-[#9158EA]",
  "from-[#C053E4] to-[#9158EA]",
  "from-[#6A5AED] to-[#C053E4]",
  "from-[#9158EA] to-[#6A5AED]",
];

interface RegionPanelProps {
  region: string | null;
  isOpen: boolean;
  onClose: () => void;
  gradientFrom: string;
  gradientTo: string;
}

export function RegionPanel({ region, isOpen, onClose, gradientFrom, gradientTo }: RegionPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<FetchState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("tuman");

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[450px] bg-white shadow-[0_0_40px_rgba(0,0,0,0.12)] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div 
              className="px-7 pt-7 pb-5" 
              style={{ background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-white/70 uppercase tracking-[0.08em] mb-2">
                    ACTIVE REGION
                  </p>
                  <div className="flex items-center gap-2">
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
                    <h2 className="text-[22px] font-bold text-white">{regionDisplayName}</h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors mt-1"
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
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("tuman")}
                  className={`px-5 py-2.5 rounded-[14px] text-[14px] font-medium transition-all ${
                    activeTab === "tuman"
                      ? "bg-white shadow-sm"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                  style={activeTab === "tuman" ? { color: gradientFrom } : {}}
                >
                  Tuman/shahar
                </button>
                <button
                  onClick={() => setActiveTab("mfy")}
                  className={`px-5 py-2.5 rounded-[14px] text-[14px] font-medium transition-all ${
                    activeTab === "mfy"
                      ? "bg-white shadow-sm"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                  style={activeTab === "mfy" ? { color: gradientFrom } : {}}
                >
                  MFY
                </button>
                <button
                  onClick={() => setActiveTab("maktab")}
                  className={`px-5 py-2.5 rounded-[14px] text-[14px] font-medium transition-all ${
                    activeTab === "maktab"
                      ? "bg-white shadow-sm"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                  style={activeTab === "maktab" ? { color: gradientFrom } : {}}
                >
                  Maktab
                </button>
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
                          className="bg-white rounded-[15px] border-0 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center text-white font-bold text-[18px] flex-shrink-0`}>
                              {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[16px] font-semibold text-[#222] mb-1">
                                {user.name}
                              </p>
                              <div className="flex items-center gap-2 text-[13px] text-[#AAA]">
                                <svg
                                  className="w-3.5 h-3.5 text-[#CCC]"
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
                            <div className="px-3 py-1.5 bg-[#EAF4FF] text-[#4C8DFF] rounded-[14px] text-[12px] font-semibold flex-shrink-0">
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
                  <div className="p-4 bg-gradient-to-br from-[#EAF4FF] to-[#F0E8FF] rounded-[20px] mb-4">
                    <svg
                      className="w-10 h-10 text-[#6A5AED]"
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
                  <h3 className="text-[17px] font-semibold text-[#222] mb-2">MFY Information</h3>
                  <p className="text-[13px] text-[#888]">MFY data will be displayed here</p>
                </div>
              )}

              {activeTab === "maktab" && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="p-4 bg-gradient-to-br from-[#EAF4FF] to-[#F0E8FF] rounded-[20px] mb-4">
                    <svg
                      className="w-10 h-10 text-[#6A5AED]"
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
                  <h3 className="text-[17px] font-semibold text-[#222] mb-2">Maktab Information</h3>
                  <p className="text-[13px] text-[#888]">Maktab data will be displayed here</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


