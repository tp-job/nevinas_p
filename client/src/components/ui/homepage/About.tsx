import type { FC } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { DataAbout, DataTools } from '@/data/HomeData';

const About: FC = () => {
    const { avatarUrl } = useProfile();

    return (
        <div id="about" className="w-full px-[12%] py-10 scroll-mt-20">
            <h4 className="mb-2 text-lg text-center text-light-text dark:text-dark-text">Introduction</h4>
            <h2 className="mb-2 text-5xl text-center text-light-text dark:text-dark-text">About Me</h2>
            <h2 className="text-2xl text-center font-zen text-light-text-secondary dark:text-dark-text-secondary">私について</h2>
            <div className="flex flex-col items-center w-full gap-20 my-20 lg:flex-row">
                <div className="relative mx-auto max-w-max">
                    <img src={avatarUrl} alt="user" className="w-64 sm:w-80 rounded-3xl max-w-none" />
                </div>
                <div className="flex-1">
                    <p className="max-w-2xl mb-10 text-light-text dark:text-dark-text">I am passionate about exploring the world of web development, with a focus on HTML, CSS, and JavaScript to craft visually appealing and interactive user interfaces.</p>
                    <ul className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
                        { DataAbout.map((items) => (
                            <li key={items.id} className="border-[.5px] border-light-border rounded-xl p-6 cursor-pointer hover:bg-light-surface-2 hover:-translate-y-1 duration-500 hover:shadow-black dark:border-dark-text dark:hover:shadow-dark-text dark:hover:bg-dark-surface">
                                <i className={`${items.icon} text-5xl text-light-text dark:text-dark-text`}></i>
                                <h3 className="my-4 font-semibold text-light-text dark:text-dark-text">{items.title}</h3>
                                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{items.detail}</p>
                            </li>
                        ))}
                    </ul>
                    <h4 className="my-6 text-light-text-secondary dark:text-dark-text">Tools i user</h4>
                    <ul className="flex items-center gap-3 sm:gap-5">
                        { DataTools.map((items) => (
                            <li key={items.id} className="flex items-center justify-center w-12 duration-500 border border-light-border rounded-lg cursor-pointer sm:w-14 aspect-square hover:-translate-y-1 dark:border-dark-text">
                                <i className={`${items.icon} text-2xl`} style={{ color: items.color }}></i>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default About;