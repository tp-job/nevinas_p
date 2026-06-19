import type {
  typeDataAbout,
  typeDataTools,
  typeDataServices,
  typeDataWork,
  typeDataSong,
  typeDataTimeline,
} from "@/types/homeData";

import nevinas from "@/assets/image/nevinas.jpg";
import feixiao from "@/assets/image/feixiao.png";
import castorice from "@/assets/image/castorice.png";
import changli from "@/assets/image/changli.png";
import logo from "@/assets/image/logo.jpg";
import work1 from "@/assets/image/work-1.jpg";
import work2 from "@/assets/image/work-2.jpg";
import work3 from "@/assets/image/work-3.jpg";
import work4 from "@/assets/image/work-4.jpg";
import bgpage from "@/assets/image/bg-page.png";

import song1 from "@/assets/audio/A_night_on_the_town_-_Stefan_Kartenberg.mp3";
import song2 from "@/assets/audio/When_Paris_is_Singing_-_Dazie_Mae.mp3";
import song3 from "@/assets/audio/Why_We_-_JO.BITE.mp3";

import resume from "@/assets/pdf/resume-nevinas-ka.pdf";

export const Assets = {
  nevinas,
  feixiao,
  castorice,
  changli,
  logo,
  work1,
  work2,
  work3,
  work4,
  resume,
  bgpage,
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
