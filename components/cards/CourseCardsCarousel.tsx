"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CourseCard } from "./CourseCard";
import { DatePicker } from "../shared/DatePicker";

interface Course {
  id: number;
  title: string;
  image: string;
}

interface CourseCardsCarouselProps {
  courses: Course[];
}

export function CourseCardsCarousel({ courses }: CourseCardsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardWidthRef = useRef(220 + 24); // card width + gap

  // Set dates on client side only to avoid hydration mismatch
  useEffect(() => {
    setStartDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    setEndDate(new Date());
  }, []);

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
    <div className="relative w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-slate-900">Kurslar</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white px-3 py-2 shadow-sm transition-all duration-200 ease-out hover:bg-slate-50 hover:shadow-md">
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              label="From"
              placeholder="Select start date"
              buttonClassName="min-w-[11rem] border-none bg-transparent px-0 py-0 text-left text-sm font-semibold text-slate-700 shadow-none hover:-translate-y-0 hover:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              align="left"
            />
            <div className="w-px h-4 bg-slate-200"></div>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              label="To"
              placeholder="Select end date"
              buttonClassName="min-w-[11rem] border-none bg-transparent px-0 py-0 text-left text-sm font-semibold text-slate-700 shadow-none hover:-translate-y-0 hover:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              align="right"
            />
          </div>
          <motion.button
            onClick={goToPrev}
            disabled={!canGoPrev || isScrolling}
            whileHover={canGoPrev && !isScrolling ? { scale: 1.1 } : {}}
            whileTap={canGoPrev && !isScrolling ? { scale: 0.95 } : {}}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`p-2.5 rounded-lg transition-all duration-200 ease-out ${
              canGoPrev && !isScrolling
                ? "bg-white hover:bg-slate-50 text-slate-700 shadow-sm hover:shadow-md cursor-pointer active:scale-95"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
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
            className={`p-2.5 rounded-lg transition-all duration-200 ease-out ${
              canGoNext && !isScrolling
                ? "bg-white hover:bg-slate-50 text-slate-700 shadow-sm hover:shadow-md cursor-pointer active:scale-95"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
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
      <div className="relative overflow-hidden rounded-xl">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
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
              className="flex-shrink-0"
            >
              <CourseCard
                id={course.id}
                image={course.image}
                title={course.title}
                delay={index}
                animate={true}
              />
            </motion.div>
          ))}
        </div>
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

