"use client";

interface Region {
  name: string;
  value: number;
  iconColor: string;
  bgColor: string;
  textColor: string;
}

interface RegionsListProps {
  onRegionClick?: (regionName: string) => void;
}

const regions: Region[] = [
  {
    name: "Xorazm viloyati",
    value: 111480,
    iconColor: "bg-purple-500",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
  {
    name: "Farg'ona viloyati",
    value: 93256,
    iconColor: "bg-orange-500",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  {
    name: "Andijon viloyati",
    value: 56695,
    iconColor: "bg-purple-500",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
  {
    name: "Surxondaryo viloyati",
    value: 51769,
    iconColor: "bg-green-500",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
];

export function RegionsList({ onRegionClick }: RegionsListProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg
              className="w-5 h-5 text-blue-600"
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
          <h2 className="text-xl font-semibold text-slate-900">
            O'zbekiston Respublikasi viloyatlari bo'yicha
          </h2>
        </div>
        <p className="text-sm text-slate-500 ml-11">
          Barcha mavjud kurslarni ko'rib chiqing va tanlang
        </p>
      </div>

      {/* Regions List */}
      <div className="flex-1 flex flex-col gap-3">
        {regions.map((region, index) => (
          <div
            key={index}
            onClick={() => onRegionClick?.(region.name)}
            className="group relative flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 cursor-pointer w-1/2"
          >
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-center justify-center gap-2 rounded-xl">
              <span className="text-base font-bold text-slate-900">More about</span>
              <svg
                className="w-5 h-5 text-slate-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="flex items-center gap-3 w-full">
              <div className={`w-10 h-10 ${region.iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <svg
                  className="w-6 h-6 text-white"
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
              <span className="text-base font-medium text-slate-900">
                {region.name}
              </span>
            </div>
            <div className={`px-3 py-1.5 ${region.bgColor} ${region.textColor} rounded-lg font-semibold text-sm flex-shrink-0`}>
              {region.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
          <span>Ko'proq ko'rsatish</span>
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
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

