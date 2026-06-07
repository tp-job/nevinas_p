import type { FC } from "react";

interface SkipLinkProps {
  targetId?: string;
}

/**
 * SkipLink renders a hidden link that becomes visible when focused.
 * It jumps to the main content area identified by the provided `targetId`.
 */
export const SkipLink: FC<SkipLinkProps> = ({ targetId = "homepage-scroll" }) => (
  <a
    href={`#${targetId}`}
    className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[1000] focus:bg-black focus:text-white focus:p-2 focus:outline focus:outline-2 focus:outline-white"
  >
    Skip to content
  </a>
);

export default SkipLink;
