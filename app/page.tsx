"use client";

import { useEffect } from "react";
import { DashboardGridLayout } from "@/components/layout/DashboardGridLayout";
import { UsersCard } from "@/components/cards/UsersCard";
import { LessonsCard } from "@/components/cards/LessonsCard";
import { CertificatesCard } from "@/components/cards/CertificatesCard";
import { WeeklyMonthlyYearlyCard } from "@/components/cards/WeeklyMonthlyYearlyCard";
import { TallSalesCard } from "@/components/cards/TallSalesCard";
import { SimpleStatCard } from "@/components/cards/SimpleStatCard";
import { CourseCardsCarousel } from "@/components/cards/CourseCardsCarousel";
import ChartCard from "@/components/ChartCard";
import { genderData } from "@/data/gender";
import { ageData } from "@/data/age";
import { sourceData } from "@/data/source";
import { educationData } from "@/data/education";
import { useVideoViewsData } from "@/hooks/useVideoViewsData";

// Course data for the carousel
const courses = [
  { id: 1, title: "$0 bilan Uzumdan $1000 topishning", image: "/images/$0 bilan Uzumdan $1000 topishning.png" },
  { id: 2, title: "100% lik kodsiz AI agentlar qurish", image: "/images/100% lik kodsiz AI agentlar qurish.png" },
  { id: 3, title: "6-sinf Matematika", image: "/images/6-sinf Matematika.png" },
  { id: 4, title: "7-sinf Algebra", image: "/images/7-sinf Algebra.png" },
  { id: 5, title: "7-sinf Geometriya", image: "/images/7-sinf Geometriya.png" },
  { id: 6, title: "8-sinf Algebra", image: "/images/8-sinf Algebra.png" },
  { id: 7, title: "8-sinf Geometriya", image: "/images/8-sinf Geometriya.png" },
  { id: 8, title: "Adabiyot", image: "/images/Adabiyot.png" },
  { id: 9, title: "Arxitektura", image: "/images/Arxitektura.png" },
  { id: 10, title: "Avtomatizatsiya kursi", image: "/images/Avtomatizatsiya kursi.png" },
  { id: 11, title: "Biologiya", image: "/images/Biologiya.png" },
  { id: 12, title: "eBay", image: "/images/eBay.png" },
  { id: 13, title: "Grafik dizayn kursi", image: "/images/Grafik dizayn kursi.png" },
  { id: 14, title: "Ish topish", image: "/images/Ish topish.png" },
  { id: 15, title: "Kadrlar boshqaruvi", image: "/images/Kadrlar boshqaruvi.png" },
  { id: 16, title: "Karyera qurish kursi", image: "/images/Karyera qurish kursi.png" },
  { id: 17, title: "Limonchilik", image: "/images/Limonchilik.png" },
  { id: 18, title: "Limonchilik 2", image: "/images/Limonchilik 2.png" },
  { id: 19, title: "Mobil ilova yasash kursi", image: "/images/Mobil ilova yasash kursi.png" },
  { id: 20, title: "Mobilografiya", image: "/images/Mobilografiya.png" },
  { id: 21, title: "Ona tili", image: "/images/Ona tili.png" },
  { id: 22, title: "PR-Reklama", image: "/images/PR-Reklama.png" },
  { id: 23, title: "Saytlar yasash", image: "/images/Saytlar yasash.png" },
  { id: 24, title: "Sun'iy intellektlar kursi", image: "/images/Sun'iy intellektlar kursi.png" },
  { id: 25, title: "Targeting", image: "/images/Targeting.png" },
  { id: 26, title: "Tarix", image: "/images/Tarix.png" },
  { id: 27, title: "Telegram Ads kursi", image: "/images/Telegram Ads kursi.png" },
  { id: 28, title: "Ustoz Pro kursi", image: "/images/Ustoz Pro kursi.png" },
  { id: 29, title: "Videomontaj", image: "/images/Videomontaj.png" },
  { id: 30, title: "Yandex market kursi", image: "/images/Yandex market kursi kursi.png" },
];

export default function DashboardPage() {
  const videoViewsData = useVideoViewsData();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollToHashTarget = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const target = document.querySelector(hash);
      if (target instanceof HTMLElement) {
        window.setTimeout(() => {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    };

    const ensureTopWhenNoHash = () => {
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        return;
      }
      scrollToHashTarget();
    };

    ensureTopWhenNoHash();

    window.addEventListener("hashchange", ensureTopWhenNoHash);
    return () => {
      window.removeEventListener("hashchange", ensureTopWhenNoHash);
    };
  }, []);


  return (
    <>
      <div className="page">
        <DashboardGridLayout>
          {/* Row 1: Top Stats Cards */}
          <UsersCard delay={0} />
          <LessonsCard delay={1} />
          <CertificatesCard delay={2} />

          {/* Row 2: Large Chart Card */}
          <WeeklyMonthlyYearlyCard delay={4} />

          {/* Row 3: Sales Report with Gauge */}
          <TallSalesCard data={videoViewsData} delay={7} />

          {/* Row 5: Course Carousel - Full Width */}
          <div id="courses" className="card-full" data-delay="16" style={{ gridColumn: "span 12", padding: 0 }}>
            <CourseCardsCarousel courses={courses} />
          </div>

          {/* Row 6: Statistics Charts */}
          <div
            id="statistics"
            className="card"
            data-delay="18"
            style={{ gridColumn: "span 3" }}
          >
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
    </>
  );
}
