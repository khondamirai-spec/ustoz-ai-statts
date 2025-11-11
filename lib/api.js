const API = "https://api.ustozaibot.uz/api/v1/statistics";

export async function apiGet(endpoint) {
  try {
    const res = await fetch("https://api.ustozaibot.uz" + endpoint);
    const json = await res.json();

    if (!res.ok) throw new Error(json.message || "API Error");

    return json.data;
  } catch (err) {
    console.log("API error:", err);
    return null; // fallback indicator
  }
}

export const getRegions = async () => {
  const url = new URL(`${API}/region`);
  url.searchParams.append("startDate", "");
  url.searchParams.append("endDate", "");
  url.searchParams.append("provider", "");

  const res = await fetch(url.toString());
  const json = await res.json();
  return json?.data || [];
};

export const getDistricts = async (regionName) => {
  const url = new URL(`${API}/district`);
  url.searchParams.append("region", regionName);

  const res = await fetch(url.toString());
  const json = await res.json();
  return json?.data || [];
};
