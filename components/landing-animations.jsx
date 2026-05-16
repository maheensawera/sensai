"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LandingAnimations() {
  useEffect(() => {
    // Small delay — DOM ko settle hone do (Next.js hydration ke baad)
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {

        // ── FEATURES SECTION ──
        gsap.fromTo(
          ".features-section h2, .features-section .features-eyebrow",
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: {
              trigger: ".features-section",
              start: "top 45%",
              toggleActions: "play none none none",
            },
          }
        );

        gsap.fromTo(
          ".features-section .feature-tab-btn",
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0, duration: 0.55,
            stagger: 0.1, ease: "power3.out",
            scrollTrigger: {
              trigger: ".features-section",
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );

        gsap.fromTo(
          ".features-section .feature-panel",
          { opacity: 0, x: 40, scale: 0.97 },
          {
            opacity: 1, x: 0, scale: 1,
            duration: 0.7, ease: "power3.out",
            delay: 0.3,
            scrollTrigger: {
              trigger: ".features-section",
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );

        // ── STATS SECTION ──
        gsap.fromTo(
          ".stats-section .stat-item",
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.6,
            stagger: 0.15, ease: "power2.out",
            scrollTrigger: {
              trigger: ".stats-section",
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );

        // ── HOW IT WORKS ──
        // Heading — apna trigger
        gsap.fromTo(
          ".how-it-works-section .section-header",
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
            scrollTrigger: {
              trigger: ".how-it-works-section .section-header",
              start: "top 90%",  // jab heading viewport mein aaye tab fire karo
              once: true,         // sirf ek baar
            },
          }
        );

        // ✅ KEY FIX: Har card ka APNA ScrollTrigger — section ka nahi
        // Warna saray cards ek saath fire hote hain jab section top pe aata hai
        document.querySelectorAll(".how-it-works-section .step-item").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 50, scale: 0.97 },
            {
              opacity: 1, y: 0, scale: 1,
              duration: 0.65, ease: "power3.out",
              scrollTrigger: {
                trigger: el,          // har card khud apna trigger hai
                start: "top 88%",     // jab woh card viewport mein aaye
                once: true,           // sirf ek baar — scroll back pe reset nahi
              },
            }
          );
        });

        // ── TESTIMONIALS ──
        gsap.fromTo(
          ".testimonials-section .testimonial-card",
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.65, stagger: 0.18, ease: "power3.out",
            scrollTrigger: {
              trigger: ".testimonials-section",
              start: "top 50%",
              toggleActions: "play none none none",
            },
          }
        );

        // ── FAQ ──
        gsap.fromTo(
          ".faq-section .faq-item",
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0,
            duration: 0.55, stagger: 0.1, ease: "power2.out",
            scrollTrigger: {
              trigger: ".faq-section",
              start: "top 60%",
              toggleActions: "play none none none",
            },
          }
        );

        // ── CTA ──
        gsap.fromTo(
          ".cta-section",
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: {
              trigger: ".cta-section",
              start: "top 60%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      return () => ctx.revert();
    }, 100); // 100ms delay — hydration ke baad DOM ready hota hai

    return () => clearTimeout(timer);
  }, []); // ✅ Koi guard nahi — React khud handle karta hai

  return null;
}
