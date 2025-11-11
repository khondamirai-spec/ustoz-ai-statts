"use client";

import { memo, useState } from "react";
import type { Feature, FeatureCollection } from "geojson";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import uzbekistan from "@/lib/data/uzbekistan.json";
import { cn } from "@/lib/utils";

type UzbekistanFeature = Feature & {
  properties: {
    name: string;
    [key: string]: unknown;
  };
};

const geoData = uzbekistan as FeatureCollection;

interface UzbekistanMapProps {
  onCitySelect: (cityName: string) => void;
  selectedCity?: string | null;
}

function UzbekistanMapComponent({
  onCitySelect,
  selectedCity,
}: UzbekistanMapProps) {
  const normalizedSelected = selectedCity?.toLowerCase() ?? "";
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm">
      <div>
        <p className="text-sm font-medium text-slate-500">Uzbekistan</p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Regional Users Map
        </h2>
        <p className="text-sm text-slate-500">
          Tap any wilayah to load the latest user list.
        </p>
      </div>

      <div className="relative flex-1 min-h-[320px]" onMouseMove={handleMouseMove}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 3600, center: [64.6, 41.2] }}
          className="h-full w-full"
        >
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geography) => {
                const region = geography as UzbekistanFeature;
                const regionName = region.properties.name;
                const isSelected =
                  regionName.toLowerCase() === normalizedSelected;

                return (
                  <Geography
                    key={`${region.rsmKey}-${regionName}`}
                    geography={region}
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${regionName}`}
                    className={cn(
                      "stroke-white stroke-[0.7] transition-[fill] duration-200 ease-out focus:outline-none focus-visible:stroke-2",
                      isSelected
                        ? "fill-blue-600 focus-visible:stroke-blue-800"
                        : "fill-slate-200 hover:fill-blue-400 focus-visible:stroke-blue-500",
                      "cursor-pointer",
                    )}
                    onClick={() => onCitySelect(regionName)}
                    onMouseEnter={() => setHoveredRegion(regionName)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onCitySelect(regionName);
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Hover Tooltip */}
        {hoveredRegion && (
          <div
            className="pointer-events-none fixed z-50 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xl border border-slate-700"
            style={{
              left: `${tooltipPosition.x + 15}px`,
              top: `${tooltipPosition.y + 15}px`,
              transform: "translate(0, 0)",
            }}
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span>More information</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 animate-pulse"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const UzbekistanMap = memo(UzbekistanMapComponent);
