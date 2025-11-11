"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { User } from "@/lib/types";

type FetchState = "idle" | "loading" | "success" | "error";

const friendlyNames: Record<string, string> = {
  Andijon: "Andijan",
  Bukhoro: "Bukhara",
  Ferghana: "Fergana",
  Jizzakh: "Jizzakh",
  Karakalpakstan: "Karakalpakstan",
  Kashkadarya: "Kashkadarya",
  Khorezm: "Khorezm",
  Namangan: "Namangan",
  Navoi: "Navoi",
  Samarkand: "Samarkand",
  Sirdaryo: "Sirdarya",
  Surkhandarya: "Surkhandarya",
  Tashkent: "Tashkent",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

// Map gradients to text colors
const gradientToTextColor: Record<string, string> = {
  "from-blue-500 to-purple-600": "text-blue-700",
  "from-pink-500 to-orange-600": "text-pink-700",
  "from-violet-500 to-indigo-600": "text-violet-700",
  "from-emerald-500 to-cyan-600": "text-emerald-700",
};

interface RegionData {
  name: string;
  value: string;
  color: string;
  gradient: string;
  border: string;
  hoverBorder: string;
  shadow: string;
  bgGradient: string;
  textGradient: string;
}

interface UserListProps {
  city?: string | null;
  regionData?: RegionData | null;
  activeTab?: "tuman" | "mfy" | "maktab";
}

export function UserList({ city, regionData, activeTab = "tuman" }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<FetchState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!city) {
      setUsers([]);
      setStatus("idle");
      setError(null);
      return;
    }

    const controller = new AbortController();
    setStatus("loading");
    setError(null);

    fetch(`/api/users/${encodeURIComponent(city)}`, { signal: controller.signal })
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
  }, [city]);

  const title = useMemo(() => {
    if (!city) return "Select a region on the map";
    return friendlyNames[city] ?? city;
  }, [city]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        {/* Tab Content */}
        {activeTab === "tuman" && (
          <AnimatePresence mode="wait">
            <motion.div
              key="tuman"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {status === "success" && users.length > 0 && (
                <div className="space-y-3">
                  {users.map((user, index) => (
                    <motion.div
                      key={`${user.name}-${user.joinedAt}`}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all duration-300 ${regionData?.hoverBorder || 'hover:border-blue-300'}`}
                    >
                      {/* Gradient background on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${regionData?.bgGradient || 'from-blue-50/0 to-purple-50/0'} opacity-0 group-hover:opacity-50 transition-all duration-300`}></div>
                      
                      <div className="relative z-10 flex items-center gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${regionData?.gradient || 'from-blue-500 to-purple-600'} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                            {user.name.charAt(0)}
                          </div>
                        </div>
                        
                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-base font-semibold text-slate-900 truncate">{user.name}</p>
                            <span className={`flex-shrink-0 px-2.5 py-1 text-xs font-semibold bg-gradient-to-r ${regionData?.bgGradient || 'from-blue-100 to-purple-100'} ${regionData?.gradient ? gradientToTextColor[regionData.gradient] || 'text-blue-700' : 'text-blue-700'} rounded-full`}>
                              {user.age} yrs
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <svg
                              className="w-4 h-4 text-slate-400"
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
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {activeTab === "mfy" && (
          <AnimatePresence mode="wait">
            <motion.div
              key="mfy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center h-full p-8 text-center"
            >
              <div className={`p-4 bg-gradient-to-br ${regionData?.bgGradient || 'from-blue-100 to-purple-100'} rounded-2xl mb-4`}>
                <svg
                  className="w-12 h-12 text-blue-600"
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
            </motion.div>
          </AnimatePresence>
        )}

        {activeTab === "maktab" && (
          <AnimatePresence mode="wait">
            <motion.div
              key="maktab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center h-full p-8 text-center"
            >
              <div className={`p-4 bg-gradient-to-br ${regionData?.bgGradient || 'from-blue-100 to-purple-100'} rounded-2xl mb-4`}>
                <svg
                  className="w-12 h-12 text-blue-600"
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
            </motion.div>
          </AnimatePresence>
        )}

        {status === "idle" && !city && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4">
              <svg
                className="w-12 h-12 text-blue-600"
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
            </div>
            <p className="text-sm text-slate-500">Select a region to view users</p>
          </div>
        )}

        {status === "loading" && activeTab === "tuman" && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-sm font-medium text-slate-600 mt-4">Loading users...</p>
          </div>
        )}

        {status === "error" && activeTab === "tuman" && (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="p-4 bg-rose-100 rounded-2xl mb-4">
              <svg
                className="w-12 h-12 text-rose-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-rose-600 font-medium">{error ?? "Unable to load users right now."}</p>
          </div>
        )}

        {status === "success" && users.length === 0 && activeTab === "tuman" && (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="p-4 bg-slate-100 rounded-2xl mb-4">
              <svg
                className="w-12 h-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-slate-500">No users in this region yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
