/** Total scroll-driven slides (matches interactive5.html) */
export const SLIDE_COUNT = 16;

export const SLIDE_INDEX = {
  HERO: 0,
  DESIGN: 1,
  DEVELOP: 2,
  THINK: 3,
  LISTEN: 4,
  ABOUT: 5,
  TIMELINE: 6,
  BENTO: 7,
  JOURNEY: 8,
  SERVICES: 9,
  WORK: 10,
  CLARITY: 11,
  AGENCY: 12,
  CONTACT: 13,
  FAQ: 14,
  RSC: 15,
} as const;

export const LIGHT_SLIDE_INDICES = new Set([
  SLIDE_INDEX.TIMELINE,
  SLIDE_INDEX.BENTO,
  SLIDE_INDEX.SERVICES,
  SLIDE_INDEX.CLARITY,
  SLIDE_INDEX.AGENCY,
  SLIDE_INDEX.RSC,
  SLIDE_INDEX.FAQ,
]);

export const NAV_LINKS = [
  { label: "About", index: SLIDE_INDEX.ABOUT },
  { label: "Timeline", index: SLIDE_INDEX.TIMELINE },
  { label: "Work", index: SLIDE_INDEX.WORK },
  { label: "Agency", index: SLIDE_INDEX.AGENCY },
  { label: "Contact", index: SLIDE_INDEX.CONTACT },
] as const;
