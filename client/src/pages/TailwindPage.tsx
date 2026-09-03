import type { FC } from "react";
import SkillShowcase from "@/components/showcase/SkillShowcase";
import { skillShowcases } from "@/data/skillShowcases";

/**
 * /work/tailwindcss
 *
 * A route wrapper. All behaviour lives in SkillShowcase; everything that makes
 * this page different from its three siblings lives in data/skillShowcases.ts.
 * The file exists so AppRoutes.tsx can keep lazy-loading this route on its own.
 */
const TailwindPage: FC = () => (
  <SkillShowcase config={skillShowcases.tailwindcss} />
);

export default TailwindPage;
