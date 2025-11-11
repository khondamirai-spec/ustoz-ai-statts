"use client";

import { useState } from "react";
import { DashboardGridLayout } from "@/components/layout/DashboardGridLayout";
import { UsersCard } from "@/components/cards/UsersCard";
import { IncomeCard } from "@/components/cards/IncomeCard";
import { WeeklyMonthlyYearlyCard } from "@/components/cards/WeeklyMonthlyYearlyCard";
import { TallSalesCard } from "@/components/cards/TallSalesCard";
import { SimpleStatCard } from "@/components/cards/SimpleStatCard";
import { CourseCardsCarousel } from "@/components/cards/CourseCardsCarousel";
import { RegionsList } from "@/components/cards/RegionsList";
import { RegionStatsTable } from "@/components/cards/RegionStatsTable";
import { RegionPanel } from "@/components/panels/RegionPanel";
import ChartCard from "@/components/ChartCard";
import { genderData } from "@/data/gender";
import { ageData } from "@/data/age";
import { sourceData } from "@/data/source";
import { educationData } from "@/data/education";
import { useIncomeData } from "@/hooks/useIncomeData";
import { useVideoViewsData } from "@/hooks/useVideoViewsData";

// Course data for the carousel
const courses = [
  { id: 1, title: "Mobile Afix Kursi", image: "/images/mobile-afix-thumbnail_1.png" },
  { id: 2, title: "Web Development", image: "/images/mobile-afix-thumbnail_2.png" },
  { id: 3, title: "Data Science", image: "/images/mobile-afix-thumbnail_3.png" },
  { id: 4, title: "UI/UX Design", image: "/images/mobile-afix-thumbnail_4.png" },
  { id: 5, title: "Python Programming", image: "/images/mobile-afix-thumbnail_5.png" },
  { id: 6, title: "JavaScript Mastery", image: "/images/mobile-afix-thumbnail_6.png" },
  { id: 7, title: "React Advanced", image: "/images/mobile-afix-thumbnail_7.png" },
  { id: 8, title: "Node.js Backend", image: "/images/mobile-afix-thumbnail_8.png" },
  { id: 9, title: "Database Design", image: "/images/mobile-afix-thumbnail_9.png" },
  { id: 10, title: "DevOps Basics", image: "/images/mobile-afix-thumbnail_10.png" },
  { id: 11, title: "Cloud Computing", image: "/images/mobile-afix-thumbnail_11.png" },
  { id: 12, title: "Machine Learning", image: "/images/mobile-afix-thumbnail_12.png" },
  { id: 13, title: "Cybersecurity", image: "/images/mobile-afix-thumbnail_13.png" },
  { id: 14, title: "Mobile Development", image: "/images/mobile-afix-thumbnail_14.png" },
  { id: 15, title: "Blockchain Basics", image: "/images/mobile-afix-thumbnail_15.png" },
  { id: 16, title: "AI Fundamentals", image: "/images/mobile-afix-thumbnail_16.png" },
];

export default function DashboardPage() {
  const incomeData = useIncomeData();
  const videoViewsData = useVideoViewsData();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [gradientColors, setGradientColors] = useState({ from: "#6A5AED", to: "#C053E4" });

  const handleRegionClick = (regionName: string, gradientFrom: string, gradientTo: string) => {
    setSelectedRegion(regionName);
    setGradientColors({ from: gradientFrom, to: gradientTo });
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedRegion(null);
  };

  return (
    <>
      <div className="page">
        <DashboardGridLayout>
          {/* Row 1: Top Stats Cards */}
          <UsersCard delay={0} />
          <IncomeCard data={incomeData} delay={1} />
          <SimpleStatCard title="Active Courses" value={156} change={12.5} delay={2} />

          {/* Row 2: Large Chart Card */}
          <WeeklyMonthlyYearlyCard delay={4} />

          {/* Row 3: Sales Report with Gauge */}
          <TallSalesCard data={videoViewsData} delay={7} />

          {/* Row 4: Regions Overview */}
          <div className="card" data-delay="14" style={{ gridColumn: "span 6" }}>
            <RegionsList onRegionClick={handleRegionClick} />
          </div>
          <div className="card" data-delay="15" style={{ gridColumn: "span 6" }}>
            <RegionStatsTable />
          </div>

          {/* Row 5: Course Carousel - Full Width */}
          <div className="card card-full" data-delay="16">
            <CourseCardsCarousel courses={courses} />
          </div>

          {/* Row 6: Statistics Charts */}
          <div className="card" data-delay="18" style={{ gridColumn: "span 3" }}>
            <ChartCard title="Jins bo'yicha statistika" data={genderData} />
          </div>
          <div className="card" data-delay="19" style={{ gridColumn: "span 3" }}>
            <ChartCard title="Yosh bo'yicha statistika" data={ageData} />
          </div>
          <div className="card" data-delay="20" style={{ gridColumn: "span 3" }}>
            <ChartCard title="Manba bo'yicha statistika" data={sourceData} />
          </div>
          <div className="card" data-delay="21" style={{ gridColumn: "span 3" }}>
            <ChartCard title="Ta'lim bo'yicha statistika" data={educationData} />
          </div>

        </DashboardGridLayout>
      </div>

      {/* Region Panel */}
      <RegionPanel
        region={selectedRegion}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        gradientFrom={gradientColors.from}
        gradientTo={gradientColors.to}
      />
    </>
  );
}
