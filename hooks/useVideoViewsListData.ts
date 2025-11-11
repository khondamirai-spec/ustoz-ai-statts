// TODO: Replace with real API data from backend
// TODO: Insert API function here (fetchVideoViewsListData)

export interface VideoViewsListItem {
  label: string;
  value: string;
  delta: string;
}

export function useVideoViewsListData(): VideoViewsListItem[] {
  // TODO: Connect real API later
  // const data = await fetchVideoViewsListData();
  // return data;

  return [
    { label: "Los Angeles", value: "261,192", delta: "+18.6%" },
    { label: "New York", value: "192,954", delta: "+12.4%" },
    { label: "Canada", value: "186,481", delta: "+9.8%" },
  ];
}

