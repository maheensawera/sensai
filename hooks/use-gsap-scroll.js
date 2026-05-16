"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Fade-up animation for a container's children.
 * @param {string} selector - CSS selector for child elements to animate.
 * @param {object} options  - GSAP from() vars + optional ScrollTrigger overrides.
 */
export function useFadeUpOnScroll(selector, options = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray(selector, containerRef.current);
      if (!elements.length) return;

      elements.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
              ...options.scrollTrigger,
            },
            ...options.from,
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [selector]);

  return containerRef;
}

/**
 * Stagger fade-in animation for a list of children.
 */
export function useStaggerFadeIn(selector, stagger = 0.12) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray(selector, containerRef.current);
      if (!elements.length) return;

      gsap.fromTo(
        elements,
        { opacity: 0, y: 32, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [selector, stagger]);

  return containerRef;
}

/**
 * Simple fade-in from below for a single element ref.
 */
export function useFadeInRef(delay = 0) {
  const elRef = useRef(null);

  useEffect(() => {
    if (!elRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        elRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: elRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }, elRef);
    return () => ctx.revert();
  }, [delay]);

  return elRef;
}
