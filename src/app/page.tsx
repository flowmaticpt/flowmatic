import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Services } from "@/components/sections/services";
import { Numbers } from "@/components/sections/numbers";
import { Process } from "@/components/sections/process";
import { Team } from "@/components/sections/team";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <Numbers />
      <Process />
      <Team />
      <Contact />
      <ScrollToTop />
      <Footer />
    </>
  );
}
