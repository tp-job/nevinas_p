import { Link } from "react-router-dom";
import { DataWork } from "@/data/HomeData.ts";
import type { FC } from 'react';

const Work: FC = () => {
    return (
        <div id="work" className="w-full px-[12%] py-10 scroll-mt-20">
            <h4 className="mb-2 text-lg text-center text-light-text dark:text-dark-text">My portfolio</h4>
            <h2 className="mb-2 text-5xl text-center text-light-text dark:text-dark-text">My latest work</h2>
            <h2 className="text-2xl text-center font-zen text-light-text-secondary dark:text-dark-text/80">私の最新の作品</h2>
            <p className="max-w-2xl mx-auto mt-5 mb-12 text-center">Welcome to my web development portfolio Explore a collection of projects showcasing my expertise in front-end development.</p>
            <div className="grid gap-5 my-10 md:grid-cols-2 xl:grid-cols-4">
                { DataWork.map((items) => (
                    <Link key={items.id} to="/work/dashboard" className="block group">
                        <div style={{ backgroundImage : `url(${items.img})`}} className={`aspect-square bg-no-repeat bg-cover bg-center rounded-lg relative cursor-pointer`}>
                            <div className="absolute flex items-center justify-between w-10/12 px-5 py-3 duration-500 -translate-x-1/2 bg-dark-text rounded-md bottom-5 left-1/2 group-hover:bottom-7">
                                <div className="">
                                    <h2 className="font-semibold dark:text-light-text">{items.title}</h2>
                                    <p className="text-sm text-light-text-secondary">{items.detail}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <Link to="/work/dashboard" className="w-max flex items-center justify-center gap-2 text-light-text-secondary border-[.5px] border-light-text-secondary rounded-full py-3 px-10 mx-auto my-20 hover:bg-dark-bg hover:text-light-surface duration-500 dark:hover:bg-light-surface dark:text-dark-text dark:border-dark-text dark:hover:text-light-text">Show more</Link>
        </div>
    );
};

export default Work;