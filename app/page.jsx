"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import HeroSection from "@/components/hero";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";
import LandingAnimations from "@/components/landing-animations";

/* ─── SCROLL ANIMATION HOOK ─── */
function useFadeIn() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-up");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const useCountUp = (targetStr, duration = 2000, start = false) => {
  const target = parseInt(targetStr.replace(/[^0-9]/g, ""));
  const suffix = targetStr.replace(/[0-9]/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);

  return `${count.toLocaleString()}${suffix}`;
};

function StatItem({ target, label, start }) {
  const animatedValue = useCountUp(target, 2000, start);
  return (
    <div className="stat-item group relative flex flex-col items-center justify-center p-6 rounded-2xl
      border-[0.5px] border-primary/20 bg-card/40 backdrop-blur-sm
      hover:border-primary/40 transition-all duration-300
      shadow-[0_2px_20px_rgba(0,0,0,0.06)]">

      {/* Radial glow behind number */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
        bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(37,99,235,0.08),transparent)]
        dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(96,165,250,0.10),transparent)]" />

      <h3 className="relative text-4xl font-bold bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
        {target === "24/7" ? target : animatedValue}
      </h3>
      <p className="relative text-xs font-medium tracking-wide text-muted-foreground mt-2 uppercase">{label}</p>
    </div>
  );
}

export default function LandingPage() {
  useFadeIn();
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="grid-background"></div>
      <LandingAnimations />
      <HeroSection />

      {/* FEATURES */}
      <section className="features-section w-full py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="features-eyebrow inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">Powerful Tools</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Powerful Features for Your Career Growth</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 max-w-6xl mx-auto items-start">
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {features.map((feature, index) => (
                <button key={index} onClick={() => setActiveFeature(index)}
                  className={`feature-tab-btn group relative min-w-50 md:min-w-full p-4 rounded-xl text-left transition-all duration-300 shrink-0 
                    border-[0.5px] overflow-hidden
                    ${activeFeature === index
                      ? "border-primary/50 shadow-[0_0_20px_rgba(37,99,235,0.15)] dark:shadow-[0_0_20px_rgba(96,165,250,0.12)]"
                      : "border-border/60 bg-card/40 hover:border-primary/30 hover:bg-primary/5"
                    }`}>

                  {/* Sliding background highlight */}
                  {activeFeature === index && (
                    <span className="absolute inset-0 bg-linear-to-r from-primary/12 via-primary/8 to-transparent rounded-xl" />
                  )}

                  {/* Left accent bar */}
                  <span className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full transition-all duration-300
                    ${activeFeature === index ? "bg-primary opacity-100" : "opacity-0"}`} />

                  <div className="relative flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300
                      ${activeFeature === index ? "bg-primary/20 shadow-[0_0_12px_rgba(37,99,235,0.2)]" : "bg-muted/60 group-hover:bg-primary/10"}`}>
                      <span className={`[&>svg]:w-5 [&>svg]:h-5 transition-colors duration-300
                        ${activeFeature === index ? "text-primary" : "text-muted-foreground"}`}>
                        {feature.icon}
                      </span>
                    </div>
                    <span className={`font-medium text-sm leading-tight transition-colors duration-300
                      ${activeFeature === index ? "text-foreground" : "text-muted-foreground"}`}>
                      {feature.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="feature-panel relative rounded-2xl border border-border bg-card p-8 md:p-12 overflow-hidden min-h-105 shadow-xl">
              <div className="absolute top-0 right-0 w-56 h-56 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                    <span className="text-primary [&>svg]:w-7 [&>svg]:h-7">{features[activeFeature].icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight">{features[activeFeature].title}</h3>
                    <p className="text-sm text-primary font-medium mt-1">{features[activeFeature].subtitle}</p>
                  </div>
                </div>
                <p className="text-muted-foreground/90 text-sm md:text-base leading-relaxed mb-6 max-w-xl">{features[activeFeature].description}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {features[activeFeature].tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-primary/8">{tag}</span>
                  ))}
                </div>
                <Link href="/dashboard">
                  <Button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                    Try Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={sectionRef} className="stats-section w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              ["50+", "Industries Covered"],
              ["1000+", "Interview Questions"],
              ["95%", "Success Rate"],
              ["24/7", "AI Support"]
            ].map(([num, label]) => (
              <StatItem key={label} target={num} label={label} start={isVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      {/* ✅ FIX: overflow-hidden HATA diya — ScrollTrigger ke saath conflict karta tha */}
      <section className="how-it-works-section w-full py-24 bg-background relative">
        <div className="container mx-auto px-4 md:px-6">
          {/* ✅ FIX: class ab section-header hai (GSAP ko yahi chahiye tha) */}
          <div className="section-header text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How It Works</h2>
            <p className="text-muted-foreground">Four simple steps to accelerate your career growth</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="timeline-line hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

            <div className="space-y-12">
              {howItWorks.map((item, index) => (
                // ✅ FIX: class ab step-item hai (GSAP ko yahi chahiye tha)
                <div
                  key={index}
                  className={`step-item flex flex-col md:flex-row items-center gap-8 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="flex-1 w-full">
                    <Card className={`border-border bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg ${index % 2 === 1 ? "md:text-right" : "md:text-left"}`}>
                      <CardContent className="p-6">
                        <div className={`flex items-center gap-3 mb-4 ${index % 2 === 1 ? "md:justify-end" : ""}`}>
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            {item.icon}
                          </div>
                          <span className="text-3xl font-black tracking-tighter
                            bg-linear-to-b from-primary/40 to-primary/10
                            bg-clip-text text-transparent
                            drop-shadow-[0_0_8px_rgba(37,99,235,0.3)]
                            dark:drop-shadow-[0_0_8px_rgba(96,165,250,0.25)]">
                            0{index + 1}
                          </span>
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-foreground">{item.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="hidden md:flex items-center justify-center z-10">
                    <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-background shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                  </div>

                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonial.map((t, index) => (
              <Card key={index} className="testimonial-card bg-card/60 backdrop-blur-md border-white/10">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative h-12 w-12 shrink-0">
                        <Image width={40} height={40} src={t.image} alt={t.author} className="rounded-full object-cover border-2 border-primary/20" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{t.author}</p>
                        <p className="text-sm text-muted-foreground">{t.role}</p>
                        <p className="text-sm text-primary">{t.company}</p>
                      </div>
                    </div>
                    <blockquote>
                      <p className="text-muted-foreground italic relative">
                        <span className="text-3xl text-primary absolute -top-4 -left-2">&quot;</span>
                        {t.quote}
                        <span className="text-3xl text-primary absolute -bottom-4">&quot;</span>
                      </p>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section w-full pt-16 pb-0 md:pt-28 md:pb-0">
        <div className="container mx-auto px-4 md:px-6">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">
              Got Questions?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our platform
            </p>
          </div>

          {/* FAQ Cards */}
          <div className="max-w-3xl mx-auto space-y-4">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="faq-item border border-border/60 rounded-xl bg-card/50 backdrop-blur-sm px-6 overflow-hidden transition-all duration-200 hover:border-primary/30 hover:bg-card/80 hover:shadow-md"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground py-5 hover:no-underline gap-4 [&>svg]:text-primary [&>svg]:shrink-0">
                    <div className="flex items-center gap-4">
                      {/* Numbered badge */}
                      <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5 pl-11">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </div>
      </section>

      {/* Smooth transition divider between FAQ and CTA */}
      <div className="w-full h-24 bg-linear-to-b from-transparent via-muted/20 to-transparent" />

      {/* CTA — Full width silver gradient, exactly like original */}
      <section className="cta-section w-full">
        <div
          className="relative w-full px-8 py-28 md:px-16 text-center overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #bec5d1 0%, #9aa0ad 35%, #7b8694 65%, #4a5568 100%)",
          }}
        >
          {/* Horizontal sheen overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 100% 80% at 50% 40%, rgba(255,255,255,0.22) 0%, transparent 65%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto">
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-700">
              Get Started Today
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              Ready to Accelerate Your Career?
            </h2>
            <p className="max-w-lg text-gray-700 md:text-lg leading-relaxed">
              Join thousands of professionals advancing their careers with AI-powered guidance.
            </p>
            <Link href="/dashboard" passHref>
              <Button
                size="lg"
                className="mt-2 h-12 px-8 text-base font-semibold bg-gray-900 hover:bg-gray-800 text-white border-0 shadow-lg hover:scale-105 transition-all duration-200 rounded-xl"
              >
                Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}