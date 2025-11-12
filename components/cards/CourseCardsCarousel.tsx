"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { CourseCard } from "./CourseCard";
import { DatePicker } from "../shared/DatePicker";
import { getCourses } from "@/lib/api";

interface Course {
  id: number;
  title: string;
  image: string;
  instructor?: string;
}

interface ApiCourse {
  title: string;
  views: number;
  certificates: number;
  users: number;
  portfolios: number;
}

interface CourseCardsCarouselProps {
  courses?: Course[]; // Optional for backward compatibility
}

// Image path helper - converts course title to image path
const getImagePath = (title: string): string => {
  if (!title) return "/images/default.png";
  
  return `/images/${title
    .replace(/[/%]/g, "-") // Replace / and %
    .replace(/[']/g, "_")  // Replace apostrophes
    .replace(/\s+/g, "-")  // Replace spaces
    .toLowerCase()}.png`;
};

// Course teacher mapping
const courseTeachers: Record<string, string> = {
  "Biologiya": "Kamoliddin Shamsiyev",
  "PR/Reklama": "Malika Rasulova",
  "Grafik dizayn kursi": "Bekzod Karimov",
  "Mobil ilova yasash kursi": "Nodir Nizomov",
  "Sun'iy intellektlar kursi": "Nodir Nizomov",
  "S0 bilan Uzumdan $1000 topishning": "Nodir Nizomov",
  "Targeting": "Diyorbek Xolmatov",
  "Arxitektura": "Nodir Nizomov",
  "Videomontaj": "Nodir Nizomov",
  "Telegram Ads kursi": "Nodir Nizomov",
  "Mobilografiya": "Jasur Rahimov",
  "default": "Nodir Nizomov"
};

// Fallback function for courses not in mapping
const getFallbackImage = (index: number): string => {
  const imageIndex = (index % 16) + 1;
  return `/images/mobile-afix-thumbnail_${imageIndex}.png`;
};

export function CourseCardsCarousel({ courses: staticCourses }: CourseCardsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [apiCourses, setApiCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardWidthRef = useRef(220 + 24); // card width + gap

  // Set dates on client side only to avoid hydration mismatch
  useEffect(() => {
    const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const defaultEndDate = new Date();
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
  }, []);

  // Fetch courses from API when dates change
  useEffect(() => {
    if (!startDate || !endDate) return;

    const loadCourses = async () => {
      setLoading(true);
      try {
        // Format dates as YYYY-MM-DD
        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const startDateStr = formatDate(startDate);
        const endDateStr = formatDate(endDate);

        const data = await getCourses(startDateStr, endDateStr);
        
        // Sort by users descending
        const sorted = [...data].sort((a, b) => b.users - a.users);
        setApiCourses(sorted);
      } catch (error) {
        console.error("Error loading courses:", error);
        setApiCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [startDate, endDate]);

  // Merge API courses with teacher + image info
  // (Already sorted by users descending in useEffect)
  const courses = useMemo(() => {
    if (apiCourses.length > 0) {
      // Merge with teacher + image info
      return apiCourses.map((course, index) => ({
        id: index + 1,
        title: course.title,
        image: getImagePath(course.title) || getFallbackImage(index),
        instructor: courseTeachers[course.title] || courseTeachers["default"],
        users: course.users,
        views: course.views,
        certificates: course.certificates,
        portfolio: course.portfolios,
      }));
    }
    // Fallback to static courses if no API data
    return staticCourses || [];
  }, [apiCourses, staticCourses]);

  // Calculate cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCardsPerView(1);
        cardWidthRef.current = 220 + 24;
      } else if (width < 1024) {
        setCardsPerView(2);
        cardWidthRef.current = 220 + 24;
      } else if (width < 1280) {
        setCardsPerView(3);
        cardWidthRef.current = 220 + 24;
      } else {
        setCardsPerView(4);
        cardWidthRef.current = 220 + 24;
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const maxIndex = Math.max(0, courses.length - cardsPerView);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const scrollToIndex = useCallback((index: number) => {
    if (scrollContainerRef.current && !isScrolling) {
      setIsScrolling(true);
      const cardWidth = cardWidthRef.current;
      const scrollPosition = index * cardWidth;
      
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });

      // Reset scrolling flag after animation
      setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    }
  }, [isScrolling]);

  const goToPrev = useCallback(() => {
    if (canGoPrev && !isScrolling) {
      const newIndex = Math.max(0, currentIndex - cardsPerView);
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  }, [canGoPrev, currentIndex, cardsPerView, isScrolling, scrollToIndex]);

  const goToNext = useCallback(() => {
    if (canGoNext && !isScrolling) {
      const newIndex = Math.min(maxIndex, currentIndex + cardsPerView);
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  }, [canGoNext, currentIndex, cardsPerView, maxIndex, isScrolling, scrollToIndex]);

  // Handle scroll events to update current index
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = cardWidthRef.current;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(Math.max(0, Math.min(newIndex, maxIndex)));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [maxIndex]);

  return (
    <div className="course-cards-wrapper">
      {/* Header */}
      <div className="course-cards-header">
        <h2 className="course-cards-title">Kurslar</h2>
        <div className="flex items-center gap-2">
          <div className="date-filter-modern-compact">
            <div className="date-filter-wrapper">
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                label="From"
                placeholder="Select start date"
                buttonClassName="min-w-[11rem] border-none bg-transparent px-0 py-0 text-left text-sm font-semibold text-slate-700 shadow-none hover:-translate-y-0 hover:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 date-picker-modern"
                align="left"
              />
              <div className="date-filter-divider">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
                </svg>
              </div>
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                label="To"
                placeholder="Select end date"
                buttonClassName="min-w-[11rem] border-none bg-transparent px-0 py-0 text-left text-sm font-semibold text-slate-700 shadow-none hover:-translate-y-0 hover:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 date-picker-modern"
                align="right"
              />
            </div>
          </div>
          <motion.button
            onClick={goToPrev}
            disabled={!canGoPrev || isScrolling}
            whileHover={canGoPrev && !isScrolling ? { scale: 1.1 } : {}}
            whileTap={canGoPrev && !isScrolling ? { scale: 0.95 } : {}}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`course-nav-button course-nav-button-left ${
              !canGoPrev || isScrolling ? "opacity-30 pointer-events-none" : ""
            }`}
            style={!canGoPrev || isScrolling ? { opacity: 0.3, pointerEvents: "none" } : {}}
            aria-label="Previous courses"
          >
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={canGoPrev && !isScrolling ? { x: [0, -2, 0] } : {}}
              transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.button>
          <motion.button
            onClick={goToNext}
            disabled={!canGoNext || isScrolling}
            whileHover={canGoNext && !isScrolling ? { scale: 1.1 } : {}}
            whileTap={canGoNext && !isScrolling ? { scale: 0.95 } : {}}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`course-nav-button course-nav-button-right ${
              !canGoNext || isScrolling ? "opacity-30 pointer-events-none" : ""
            }`}
            style={!canGoNext || isScrolling ? { opacity: 0.3, pointerEvents: "none" } : {}}
            aria-label="Next courses"
          >
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={canGoNext && !isScrolling ? { x: [0, 2, 0] } : {}}
              transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
            >
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="course-cards-scroll-wrapper">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 text-sm">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 text-sm">No courses found</p>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="course-cards-container"
            style={{
              WebkitOverflowScrolling: "touch",
            }}
          >
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <CourseCard
                  id={course.id}
                  image={course.image}
                  title={course.title}
                  instructorName={course.instructor}
                  users={course.users}
                  views={course.views}
                  certificates={course.certificates}
                  portfolio={course.portfolio}
                  delay={index}
                  animate={true}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Scrollbar indicator */}
      <div className="mt-4 flex justify-center gap-1">
        {Array.from({ length: Math.ceil(courses.length / cardsPerView) }).map(
          (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * cardsPerView)}
              className={`h-2 rounded-full transition-all ${
                Math.floor(currentIndex / cardsPerView) === index
                  ? "w-8 bg-slate-700"
                  : "w-2 bg-slate-300"
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          )
        )}
      </div>
    </div>
  );
}

