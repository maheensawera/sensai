"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LandingAnimations() {
  useEffect(() => {
    /* ═══════════════════════════════════
       CURSOR GLOW — smooth lagging light
    ═══════════════════════════════════ */
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    let mouseX = -500, mouseY = -500;
    let currentX = -500, currentY = -500;
    let glowRaf;

    const onMouseMove = (e) => { mouseX = e.clientX; mouseY = e.clientY; };

    const animateGlow = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      glow.style.left = `${currentX}px`;
      glow.style.top = `${currentY}px`;
      glowRaf = requestAnimationFrame(animateGlow);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    glowRaf = requestAnimationFrame(animateGlow);

    /* ═══════════════════════════════════
       GSAP SCROLL ANIMATIONS — original
    ═══════════════════════════════════ */
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
        gsap.fromTo(
          ".how-it-works-section .section-header",
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
            scrollTrigger: {
              trigger: ".how-it-works-section .section-header",
              start: "top 90%",
              once: true,
            },
          }
        );

        document.querySelectorAll(".how-it-works-section .step-item").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 50, scale: 0.97 },
            {
              opacity: 1, y: 0, scale: 1,
              duration: 0.65, ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true,
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
    }, 100);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(glowRaf);
      window.removeEventListener("mousemove", onMouseMove);
      if (glow.parentNode) glow.parentNode.removeChild(glow);
    };
  }, []);

  return null;
}
