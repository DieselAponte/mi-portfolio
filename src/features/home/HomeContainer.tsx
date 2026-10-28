import { HeroSection } from "./components/HeroSection/HomeHeroSection";
import { WhatIDo } from "./components/WhatIDo";
import { CasesOfStudy } from "./components/CasesOfStudy";
import { AboutMe } from "./components/AboutMe";
import { BookACallSection } from "./components/BookACallSection";
import { Footer } from "./components/Footer";
import type { HomeCaseOfStudy, HomeService, HomeAbout } from "./types";

type HomeContainerProps = {
  services: HomeService[];
  casesOfStudy: HomeCaseOfStudy[];
  about?: HomeAbout;
};

export const HomeContainer = ({ services, casesOfStudy, about }: HomeContainerProps) => {
  return (
    <main className="relative w-full">
      <section id="hero" className="h-screen w-full">
        <HeroSection />
      </section>

      <section id="what-i-do" className="py-20 px-6">
        <WhatIDo services={services} />
      </section>

      <section id="cases" className="relative overflow-hidden py-20 bg-aperture-dark/30">
        <CasesOfStudy cases={casesOfStudy} />
      </section>

      <section id="about" className="py-20 bg-aperture-dark/30">
        <AboutMe imageUrl={about?.image_url} />
      </section>

      <BookACallSection id="contact" />

      <Footer />
    </main>
  );
};
