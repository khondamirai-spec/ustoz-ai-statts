const API_BASE_URL = "https://api.ustozaibot.uz";

export const BASE = "https://api.ustozaibot.uz/api/v1/statistics";

function extractList(payload, preferredKeys = []) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return null;

  const keysToCheck = [...preferredKeys, "items", "regions", "districts", "list", "results"];
  for (const key of keysToCheck) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return null;
}

export async function apiGet(endpoint) {
  try {
    const res = await fetch(API_BASE_URL + endpoint);
    const json = await res.json();

    if (!res.ok) throw new Error(json.message || "API Error");

    return json.data;
  } catch (err) {
    console.log("API error:", err);
    return null; // fallback indicator
  }
}

// Fetch all regions
export async function getRegions() {
  const res = await fetch(`${BASE}/region?startDate=2025-01-01&endDate=2025-12-31&provider=PAYME`);
  if (!res.ok) throw new Error(`Regions failed ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

// Fetch all districts for selected region
export async function getDistricts(region) {
  const res = await fetch(`${BASE}/district?region=${encodeURIComponent(region)}`);
  if (!res.ok) throw new Error(`Districts failed ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

// Fetch MFY (villages)
export async function getMFY(region, district) {
  const res = await fetch(`${BASE}/mfy?region=${encodeURIComponent(region)}&district=${encodeURIComponent(district)}`);
  if (!res.ok) throw new Error(`MFY failed ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

// Fetch Maktab (schools)
export async function getSchools(region, district) {
  const res = await fetch(`${BASE}/school?region=${encodeURIComponent(region)}&district=${encodeURIComponent(district)}`);
  if (!res.ok) throw new Error(`Schools failed ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

// Fetch courses statistics
export const getCourses = async (startDate, endDate) => {
  try {
    const res = await fetch(
      `https://api.ustozaibot.uz/api/v1/statistics/course?startDate=${startDate}&endDate=${endDate}`
    );
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("❌ Failed to fetch courses:", err);
    return [];
  }
};

