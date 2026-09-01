import type { FC } from "react";
import { folderStructure } from "@/data/docData";
import DocSection from "./DocSection";
import CodeBlock from "./CodeBlock";

/**
 * Project Structure — `folderStructure` rendered verbatim.
 *
 * `folderStructure` was rewritten from the real tree in Phase 1 of this plan
 * (it previously drew a `models/` directory that never existed and a
 * `server.js` that has never been anything but `.ts`), and is checked against
 * the real tree by `npm run docs:check`.
 *
 * `wide`: a directory tree is looked at, not read as sentences — the same
 * reasoning DocSection's other grids already use.
 */
const ProjectStructureSection: FC = () => (
  <DocSection
    title="Project Structure"
    subtitle="How the repository is laid out."
    wide
  >
    <CodeBlock language="text" code={folderStructure} />
  </DocSection>
);

export default ProjectStructureSection;
