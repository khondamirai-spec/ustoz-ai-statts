"use client";

import { useState, useEffect } from "react";
import { getRegions, getDistricts, getMFY, getSchools } from "@/lib/api";

export default function RegionHierarchy() {
  const [regions, setRegions] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [mfy, setMfy] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);

  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [activeDistrict, setActiveDistrict] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load regions
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRegions();
        console.log("Regions data:", data);
        setRegions(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Regions error:", e);
        setError("Regions yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Load districts when region selected
  const handleRegionClick = async (region: string) => {
    setActiveRegion(region);
    setActiveDistrict(null);
    setMfy([]);
    setSchools([]);
    setLoading(true);
    setError(null);
    try {
      const data = await getDistricts(region);
      console.log("Districts data for", region, ":", data);
      setDistricts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Districts error:", e);
      setError("Tumanlar yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // Load MFY + schools when district selected
  const handleDistrictClick = async (district: string) => {
    setActiveDistrict(district);
    setLoading(true);
    setError(null);
    try {
      const [m, s] = await Promise.all([
        getMFY(activeRegion, district).catch((err) => {
          console.warn("MFY fetch failed:", err);
          return []; // Return empty array on error
        }),
        getSchools(activeRegion, district).catch((err) => {
          console.warn("Schools fetch failed:", err);
          return []; // Return empty array on error
        }),
      ]);
      console.log("MFY data for", activeRegion, district, ":", m);
      console.log("Schools data for", activeRegion, district, ":", s);
      setMfy(Array.isArray(m) ? m : []);
      setSchools(Array.isArray(s) ? s : []);
      // Only show error if both failed
      if ((!Array.isArray(m) || m.length === 0) && (!Array.isArray(s) || s.length === 0)) {
        setError("MFY va maktablar ma'lumotlari topilmadi");
      }
    } catch (e) {
      console.error(e);
      setError("MFY va maktablar yuklashda xatolik yuz berdi");
      setMfy([]);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          📊 O&apos;zbekiston ta&apos;lim statistikasi
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {loading && (
          <p className="text-center text-gray-500 text-lg">Yuklanmoqda...</p>
        )}

        {/* REGIONS */}
        {!activeRegion && !loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.length > 0 ? (
              regions.map((r) => {
                const regionName = r.region || r.name;
                return (
                  <div
                    key={regionName || Math.random()}
                    onClick={() => handleRegionClick(regionName)}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 p-5 cursor-pointer border border-gray-100"
                  >
                    <h2 className="text-lg font-semibold text-gray-800">
                      {regionName}
                    </h2>
                    <p className="text-blue-600 font-medium mt-2">
                      {typeof r.users === "number"
                        ? r.users.toLocaleString()
                        : r.users || 0}{" "}
                      foydalanuvchi
                    </p>
                  </div>
                );
              })
            ) : (
              !error && (
                <p className="col-span-full text-center text-gray-500">
                  Ma&apos;lumot topilmadi
                </p>
              )
            )}
          </div>
        )}

        {/* DISTRICTS */}
        {activeRegion && !activeDistrict && !loading && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-indigo-700">
                📍 {activeRegion} tumanlari
              </h2>
              <button
                onClick={() => {
                  setActiveRegion(null);
                  setDistricts([]);
                }}
                className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors px-3 py-1 rounded-md hover:bg-red-50"
              >
                ← Orqaga
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {districts.length > 0 ? (
                districts.map((d, idx) => {
                  const districtName = d.district || d.region || d.name;
                  return (
                    <div
                      key={districtName || idx}
                      onClick={() => handleDistrictClick(districtName)}
                      className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg hover:bg-indigo-50 cursor-pointer transition-all duration-200 hover:scale-[1.02] border border-gray-100"
                    >
                      <h3 className="text-gray-800 font-medium">
                        {districtName}
                      </h3>
                      <p className="text-indigo-600 font-semibold mt-2">
                        {typeof d.users === "number"
                          ? d.users.toLocaleString()
                          : d.users || 0}{" "}
                        foydalanuvchi
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  Tumanlar ma&apos;lumoti topilmadi
                </p>
              )}
            </div>
          </div>
        )}

        {/* MFY + SCHOOLS */}
        {activeDistrict && !loading && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-700">
                🏫 {activeDistrict} ma&apos;lumotlari
              </h2>
              <button
                onClick={() => {
                  setActiveDistrict(null);
                  setMfy([]);
                  setSchools([]);
                }}
                className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors px-3 py-1 rounded-md hover:bg-red-50"
              >
                ← Orqaga
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="font-semibold text-blue-600 mb-3 text-lg">
                  🏘 MFY (Mahallalar)
                </h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {mfy.length > 0 ? (
                    mfy.map((m, idx) => {
                      const mfyName = m.mfy || m.region || m.name || m.district;
                      return (
                        <div
                          key={mfyName || idx}
                          className="flex justify-between items-center p-3 bg-blue-50 rounded-lg shadow-sm hover:bg-blue-100 transition-colors"
                        >
                          <span className="text-gray-800">{mfyName}</span>
                          <span className="text-blue-600 font-semibold">
                            {typeof m.users === "number"
                              ? m.users.toLocaleString()
                              : m.users || 0}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">
                      Ma&apos;lumot yo&apos;q
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="font-semibold text-green-600 mb-3 text-lg">
                  🏫 Maktablar
                </h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {schools.length > 0 ? (
                    schools.map((s, idx) => {
                      const schoolName = s.school || s.region || s.name || s.district;
                      return (
                        <div
                          key={schoolName || idx}
                          className="flex justify-between items-center p-3 bg-green-50 rounded-lg shadow-sm hover:bg-green-100 transition-colors"
                        >
                          <span className="text-gray-800">{schoolName}</span>
                          <span className="text-green-600 font-semibold">
                            {typeof s.users === "number"
                              ? s.users.toLocaleString()
                              : s.users || 0}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">
                      Ma&apos;lumot yo&apos;q
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

