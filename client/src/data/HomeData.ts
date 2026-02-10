import type { typeDataAbout, typeDataTools, typeDataServices, typeDataWork, typeDataSong } from '@/types/homeData';

import nevinas from '@/assets/image/nevinas.jpg';
import feixiao from '@/assets/image/feixiao.png';
import castorice from '@/assets/image/castorice.png';
import changli from '@/assets/image/changli.png';
import logo from '@/assets/image/logo.jpg';
import work1 from '@/assets/image/work-1.jpg';
import work2 from '@/assets/image/work-2.jpg';
import work3 from '@/assets/image/work-3.jpg';
import work4 from '@/assets/image/work-4.jpg';
import bgpage from '@/assets/image/bg-page.png';

import song1 from '@/assets/audio/A_night_on_the_town_-_Stefan_Kartenberg.mp3'; 
import song2 from '@/assets/audio/When_Paris_is_Singing_-_Dazie_Mae.mp3';
import song3 from '@/assets/audio/Why_We_-_JO.BITE.mp3';

import resume from '@/assets/pdf/resume-nevinas-ka.pdf';

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
        detail: "King Mongkut's Institute of Technology Ladkrabang - School of Industrial Education and Technology",
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
        title: "Web design",
        detail: "Web development is the process of building, programming...",
    },
    {
        id: 2,
        icon: "ri-device-line",
        title: "Mobile app",
        detail: "Web development is the process of building, programming...",
    },
    {
        id: 3,
        icon: "ri-palette-fill",
        title: "UI/ UX design",
        detail: "Web development is the process of building, programming...",
    },
    {
        id: 4,
        icon: "ri-image-fill",
        title: "Graphics design",
        detail: "Web development is the process of building, programming...",
    },
];

export const DataWork: typeDataWork[] = [
    {
        id: 1,
        img: work1,
        title: "Frontend Project",
        detail: "Web Design"
    },
    {
        id: 2,
        img: work2,
        title: "Frontend Project",
        detail: "Mobile app"
    },
    {
        id: 3,
        img: work3,
        title: "Frontend Project",
        detail: "UI/ UX design"
    },
    {
        id: 4,
        img: work4,
        title: "Frontend Project",
        detail: "Graphics design"
    },
];

export const DataSong: typeDataSong[] = [
    {
        id: 1,
        title: "A night on the town - Stefan Kartenberg",
        song: song1
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
    }
];