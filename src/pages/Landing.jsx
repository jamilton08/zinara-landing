import { C } from "../tokens";
import { SectionDivider } from "../components/Visuals";
import {
  Hero, Thesis, Vision, TechSpecs, DevSection, CTA,
} from "../components/sections";

export default function Landing() {
  return (
    <>
      <Hero />
      <SectionDivider color={C.purple} />
      <Thesis />
      <SectionDivider color={C.teal} />
      <Vision />
      <SectionDivider color={C.purple} />
      <TechSpecs />
      <SectionDivider color={C.teal} />
      <DevSection />
      <SectionDivider color={C.purple} />
      <CTA />
    </>
  );
}