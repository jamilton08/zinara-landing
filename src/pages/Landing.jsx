import { C } from "../tokens";
import { SectionDivider } from "../components/Visuals";
import {
  Hero, Vision, TechSpecs, DevSection, CTA,
} from "../components/sections";

export default function Landing() {
  return (
    <>
      <Hero />
      <SectionDivider color={C.purple} />
      <Vision />
      <SectionDivider color={C.teal} />
      <TechSpecs />
      <SectionDivider color={C.purple} />
      <DevSection />
      <SectionDivider color={C.teal} />
      <CTA />
    </>
  );
}
