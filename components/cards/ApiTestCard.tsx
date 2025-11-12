"use client";

import { useEffect, useState } from "react";
import { getRegions, getDistricts } from "@/lib/api";

export function ApiTestCard() {
  const [regions, setRegions] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  useEffect(() => {
    const loadRegions = async () => {
      try {
        setLoadingRegions(true);
        const data = await getRegions();
        setRegions(data);
      } catch (err) {
        console.error("Failed to load regions:", err);
        setRegions([]);
      } finally {
        setLoadingRegions(false);
      }
    };
    loadRegions();
  }, []);

  const loadDistricts = async (regionName: string) => {
    try {
      setLoadingDistricts(true);
      setSelectedRegion(regionName);
      const data = await getDistricts(regionName);
      setDistricts(data);
    } catch (err) {
      console.error("Failed to load districts:", err);
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">API Test - Regions & Districts</h2>
      
      {/* Regions Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-slate-700">Regions ({regions.length})</h3>
        {loadingRegions ? (
          <div className="text-sm text-slate-500">Loading regions...</div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {regions.length === 0 ? (
              <div className="text-sm text-red-500">No regions found</div>
            ) : (
              regions.map((region, index) => (
                <div
                  key={index}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors"
                  onClick={() => loadDistricts(region.region || region.name || "")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {region.region || region.name || "Unknown"}
                      </div>
                      <div className="text-sm text-slate-600">
                        Users: {region.users || 0}
                      </div>
                    </div>
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        loadDistricts(region.region || region.name || "");
                      }}
                    >
                      Load Districts
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Districts Section */}
      {selectedRegion && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-slate-700">
            Districts for: {selectedRegion} ({districts.length})
          </h3>
          {loadingDistricts ? (
            <div className="text-sm text-slate-500">Loading districts...</div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {districts.length === 0 ? (
                <div className="text-sm text-red-500">No districts found</div>
              ) : (
                districts.map((district, index) => (
                  <div
                    key={index}
                    className="p-3 bg-purple-50 rounded-lg border border-purple-200"
                  >
                    <div className="font-semibold text-slate-900 mb-2">
                      {district.region || district.name || "Unknown"}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-slate-600">
                        <span className="font-medium">Users:</span> {district.users || 0}
                      </div>
                      <div className="text-slate-600">
                        <span className="font-medium">Views:</span> {district.views || 0}
                      </div>
                      <div className="text-slate-600">
                        <span className="font-medium">Certificates:</span> {district.certificates || 0}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Raw Data Toggle */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900">
          Show Raw JSON Data
        </summary>
        <pre className="mt-2 p-3 bg-slate-900 text-green-400 rounded text-xs overflow-auto max-h-64">
          {JSON.stringify({ regions, districts, selectedRegion }, null, 2)}
        </pre>
      </details>
    </div>
  );
}




