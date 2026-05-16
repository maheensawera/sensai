"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const imageRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-title",
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1 }
      )
        .fromTo(
          ".hero-subtitle",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          ".hero-buttons",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          ".hero-image-wrapper",
          { opacity: 0, y: 60, rotateX: 20, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            rotateX: 15,
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=0.3"
        );
    }, sectionRef);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      ctx.revert();
    };
  }, []);

  return (
    // ✅ FIX: relative add kiya — hero-glow absolute position ke liye zaroori tha
    // overflow-hidden nahi lagaya — warna glow clip ho jaata
    <section ref={sectionRef} className="relative w-full pt-36 md:pt-48 pb-10 overflow-visible">

      {/* ✅ Glow circle — ab section ke andar sahi jagah rahega */}
      <div className="hero-glow" />

      <div className="relative z-10 space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="hero-title text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title opacity-0">
            Your AI Career Mentor for
            <br />
            Professional Success
          </h1>
          <p className="hero-subtitle mx-auto max-w-150 text-muted-foreground md:text-xl opacity-0">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for job success.
          </p>
        </div>

        <div className="hero-buttons flex justify-center space-x-4 opacity-0">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          <Link href="https://www.youtube.com/roadsidecoder">
            <Button size="lg" variant="outline" className="px-8">
              Watch Demo
            </Button>
          </Link>
        </div>

        <div className="hero-image-wrapper mt-5 md:mt-0 opacity-0">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/Mentor.png"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
