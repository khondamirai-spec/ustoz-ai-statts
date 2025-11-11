"use client";

import React from "react";
import ChartCard from "./ChartCard";
import { genderData } from "@/data/gender";
import { ageData } from "@/data/age";
import { sourceData } from "@/data/source";
import { educationData } from "@/data/education";

const StatsCharts = () => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 min-w-max xl:min-w-0">
        <div className="min-w-[280px] xl:min-w-0">
          <ChartCard
            title="Jins bo'yicha statistika"
            data={genderData}
          />
        </div>
        <div className="min-w-[280px] xl:min-w-0">
          <ChartCard
            title="Yosh bo'yicha statistika"
            data={ageData}
          />
        </div>
        <div className="min-w-[280px] xl:min-w-0">
          <ChartCard
            title="Manba bo'yicha statistika"
            data={sourceData}
          />
        </div>
        <div className="min-w-[280px] xl:min-w-0">
          <ChartCard
            title="Ta'lim bo'yicha statistika"
            data={educationData}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsCharts;
