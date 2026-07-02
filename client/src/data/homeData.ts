import type {
  typeDataAbout,
  typeDataTools,
  typeDataServices,
  typeDataWork,
  typeDataSong,
  typeDataTimeline,
} from "@/types/homeData";

// image profile
import nevinas from "@/assets/image/profile/nevinas.jpg";
import nevinasPng from "@/assets/image/profile/nevinas.png";
import nevinasFullBody from "@/assets/image/profile/nevinas-full-body.png";
import feixiao from "@/assets/image/profile/feixiao.png";
import castorice from "@/assets/image/profile/castorice.png";
import changli from "@/assets/image/profile/changli.png";

// image icon
import logo from "@/assets/image/icon/logo.jpg";

// image work
import work1 from "@/assets/image/work/work-1.jpg";
import work2 from "@/assets/image/work/work-2.jpg";
import work3 from "@/assets/image/work/work-3.jpg";
import work4 from "@/assets/image/work/work-4.jpg";

// image background
import glassAbstract from "@/assets/image/background/glass-abstract.png";
import iconIllu2 from "@/assets/image/background/icon-illu2.png";
import landscape1 from "@/assets/image/background/landspace-1.png";
import landscape2 from "@/assets/image/background/landspace-2.png";
import theTree from "@/assets/image/background/the-tree.png";

// image icon
import abstract3Icon from "@/assets/image/icon/abstract-3-icon.png";
import escButton from "@/assets/image/icon/esc-button.png";
import handNe from "@/assets/image/icon/hand-ne.png";
import handSocial from "@/assets/image/icon/hand-social.png";
import heroArt from "@/assets/image/icon/hero-art.png";
import integrationStatusIcons from "@/assets/image/icon/integration-status-icons.png";
import joystick from "@/assets/image/icon/joystick.png";
import load from "@/assets/image/icon/load.png";

// song
import song1 from "@/assets/audio/A_night_on_the_town_-_Stefan_Kartenberg.mp3";
import song2 from "@/assets/audio/When_Paris_is_Singing_-_Dazie_Mae.mp3";
import song3 from "@/assets/audio/Why_We_-_JO.BITE.mp3";

import resume from "@/assets/pdf/resume-nevinas-ka.pdf";

export const Assets = {
  nevinas,
  nevinasPng,
  nevinasFullBody,
  feixiao,
  castorice,
  changli,
  logo,
  work1,
  work2,
  work3,
  work4,
  glassAbstract,
  iconIllu2,
  landscape1,
  landscape2,
  theTree,
  abstract3Icon,
  escButton,
  handNe,
  handSocial,
  heroArt,
  integrationStatusIcons,
  joystick,
  load,
  resume,

  // ── Aliases for semantic keys used across components ──
  // These map to the closest existing asset so consumers stay type-safe.
  valleyBase64: landscape1,
  spheresBase64: landscape2,
  codeIcon: abstract3Icon,
  webIcon: iconIllu2,
  aiSolution: integrationStatusIcons,
  folderIcon: abstract3Icon,
  chineseRoof: theTree,
  waterfallValley: landscape1,
  shimenawa: landscape2,
  bgpage: glassAbstract,
};

export const DataAbout: typeDataAbout[] = [
  {
    id: 1,
    icon: "ri-code-s-slash-fill",
    title: "Languages",
    detail: "HTML, CSS, JavaScript, Python",
  },
  {
    id: 2,
    icon: "ri-graduation-cap-line",
    title: "Education",
    detail:
      "King Mongkut's Institute of Technology Ladkrabang - School of Industrial Education and Technology",
  },
  {
    id: 3,
    icon: "ri-briefcase-2-line",
    title: "Projects",
    detail: "Built more than 5 projects",
  },
];

export const DataTools: typeDataTools[] = [
  {
    id: 1,
    icon: "ri-code-s-slash-fill",
    color: "#1598ea",
  },
  {
    id: 2,
    icon: "ri-reactjs-line",
    color: "#23cdef",
  },
  {
    id: 3,
    icon: "ri-tailwind-css-fill",
    color: "#23cdef",
  },
  {
    id: 4,
    icon: "ri-nodejs-fill",
    color: "#68a063",
  },
  {
    id: 5,
    icon: "ri-github-fill",
    color: "#e16f24",
  },
  {
    id: 6,
    icon: "ri-openai-fill",
    color: "#10a37f",
  },
];

export const DataServices: typeDataServices[] = [
  {
    id: 1,
    icon: "ri-global-line",
    title: "Web Design",
    detail: "Crafting simple yet powerful web experiences using modern technologies like React 19 and Hono for peak performance.",
  },
  {
    id: 2,
    icon: "ri-device-line",
    title: "Mobile App",
    detail: "Designing intuitive mobile interfaces that seamlessly adapt to modern user behaviors and needs.",
  },
  {
    id: 3,
    icon: "ri-palette-fill",
    title: "UI/UX Design",
    detail: "Focusing on deep research and detailed wireframing to build robust and user-centric digital structures.",
  },
  {
    id: 4,
    icon: "ri-image-fill",
    title: "Graphics",
    detail: "Creating compelling visual identities that clearly communicate and reflect your brand's unique personality.",
  },
];

export const DataWork: typeDataWork[] = [
  {
    id: 1,
    img: work1,
    title: "The Blade Forge",
    detail: "Architecting precision through advanced frontend patterns...",
  },
  {
    id: 2,
    img: work2,
    title: "Frontend Project",
    detail: "Mobile app",
  },
  {
    id: 3,
    img: work3,
    title: "Frontend Project",
    detail: "UI/ UX design",
  },
  {
    id: 4,
    img: work4,
    title: "Frontend Project",
    detail: "Graphics design",
  },
];

export const DataSong: typeDataSong[] = [
  {
    id: 1,
    title: "A night on the town - Stefan Kartenberg",
    song: song1,
  },
  {
    id: 2,
    title: "When Paris is Singing - Dazie Mae",
    song: song2,
  },
  {
    id: 3,
    title: "Why We - JO.BITE",
    song: song3,
  },
];

export const DataTimeline: typeDataTimeline[] = [
  {
    id: 1,
    title: "Languages",
    description:
      "JavaScript, TypeScript, Python, HTML, CSS - focused on building modern web applications with clean architecture.",
    date: "Core Skills",
  },
  {
    id: 2,
    title: "Education",
    description:
      "Self-taught developer with strong focus on frontend engineering, UI/UX systems, and real-world project building.",
    date: "Learning Journey",
  },
  {
    id: 3,
    title: "Projects",
    description:
      "Smart Learning Hub (LMS), 3D Interactive Web, Timeline Systems - combining UI, logic, and user experience.",
    date: "Portfolio Work",
  },
  {
    id: 4,
    title: "Tools I Use",
    description:
      "React, TailwindCSS, Flask, Three.js, VS Code, Git - building scalable and modern web systems.",
    date: "Tech Stack",
  },
  {
    id: 5,
    title: "Future Goals",
    description:
      "Becoming a developer who can teach, build impactful systems, and push creative UI/UX boundaries.",
    date: "Vision",
  },
];
