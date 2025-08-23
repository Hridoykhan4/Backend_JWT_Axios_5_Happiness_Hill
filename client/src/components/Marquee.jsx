"use client";

import { useRef, useEffect, useCallback } from "react";
import useScrollToTop from "../hooks/useScrollToTop";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import { Star } from "lucide-react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const useAnimationFrame = (callback) => {
  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);

  const animate = useCallback(
    (time) => {
      if (
        previousTimeRef.current !== null &&
        previousTimeRef.current !== undefined
      ) {
        const delta = time - previousTimeRef.current;
        callback(time, delta);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);
};

function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  speed = 50,
  vertical = false,
  repeat = 4,
  ...props
}) {
  useScrollToTop();
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const singleContentBlockRef = useRef(null);
  const animX = useRef(0);
  const isPaused = useRef(false);

  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/reviews`
      );
      return data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  useAnimationFrame((_, delta) => {
    if (
      !containerRef.current ||
      !contentRef.current ||
      !singleContentBlockRef.current
    )
      return;
    if (pauseOnHover && isPaused.current) return;

    const singleContentBlockSize = vertical
      ? singleContentBlockRef.current.offsetHeight
      : singleContentBlockRef.current.offsetWidth;

    const contentStyle = window.getComputedStyle(contentRef.current);
    const computedGap = parseFloat(
      vertical ? contentStyle.rowGap || "0" : contentStyle.columnGap || "0"
    );

    const loopDistance = singleContentBlockSize + computedGap;
    const dx = (speed * delta) / 1000;
    const effectiveDx = reverse ? dx : -dx;

    animX.current += effectiveDx;
    if (Math.abs(animX.current) >= loopDistance) {
      animX.current = animX.current % loopDistance;
    }

    if (vertical) {
      contentRef.current.style.transform = `translateY(${animX.current}px)`;
    } else {
      contentRef.current.style.transform = `translateX(${animX.current}px)`;
    }
  });

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) isPaused.current = true;
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) isPaused.current = false;
  }, [pauseOnHover]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    console.error("Error loading reviews:", error);
    return (
      <div className="text-red-600 font-semibold text-center">
        Failed to load reviews
      </div>
    );
  }

  return (
    <div
      {...props}
      ref={containerRef}
      className={cn(
        "group flex overflow-hidden p-4 [--gap:2rem] [gap:var(--gap)]" +
          (vertical ? " flex-col" : " flex-row"),
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={contentRef}
        className={cn(
          "flex shrink-0 justify-around [gap:var(--gap)]" +
            (vertical ? " flex-col" : " flex-row")
        )}
      >
        {Array(repeat)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              ref={i === 0 ? singleContentBlockRef : null}
              className="flex gap-6"
            >
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 w-72 flex-shrink-0 hover:shadow-xl transition"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={review?.customerDetail?.photo}
                      alt={review.customerDetail.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                        {review.customerDetail.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {review.customerDetail.email}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        size={16}
                        className={
                          starIdx < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    "{review.review}"
                  </p>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Marquee;
