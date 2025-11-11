// TODO: Replace with real API data from backend
// TODO: Insert API function here (fetchCitySalesData)

export interface CitySalesData {
  city: string;
  value: string;
  delta: string;
}

export function useCitySalesData(): CitySalesData[] {
  // TODO: Connect real API later
  // const data = await fetchCitySalesData();
  // return data;

  return [
    { city: "Los Angeles", value: "261,192", delta: "+18.6%" },
    { city: "New York", value: "192,954", delta: "+12.4%" },
    { city: "Canada", value: "186,481", delta: "+9.8%" },
  ];
}

