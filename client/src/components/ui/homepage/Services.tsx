import type { FC } from 'react';
import { DataServices } from "@/data/HomeData";

const Services: FC = () => {
    return (
        <div id="services" className="w-full px-[12%] py-10 scroll-mt-20">
            <h4 className="mb-2 text-lg text-center text-light-text dark:text-dark-text">What i offer</h4>
            <h2 className="mb-2 text-5xl text-center text-light-text dark:text-dark-text">My Services</h2>
            <h2 className="text-2xl text-center font-zen text-light-text-secondary dark:text-dark-text/80">私のサービス</h2>
            <p className="max-w-2xl mx-auto mt-5 mb-12 text-center">I am a frontend developer from a parallel world.</p>
            <div className="grid gap-6 my-10 md:grid-cols-2 xl:grid-cols-4">
                { DataServices.map((items) => 
                    <div key={items.id} className="px-8 py-12 duration-500 border border-gray-400 rounded-lg cursor-pointer hover:shadow-black hover:bg-light-surface-2 hover:-translate-x-1 dark:border-light-border dark:hover:shadow-light-bg dark:hover:bg-dark-surface">
                        <i className={`${items.icon} text-2xl text-global-blue`}></i>
                        <h3 className="my-4 text-lg text-light-text-secondary dark:text-dark-text">{items.title}</h3>
                        <p className="text-sm leading-5 text-light-text-secondary dark:text-dark-text">{items.detail}</p>
                        <a href="#" className="flex items-center gap-2 mt-5 text-sm">
                            Read more
                            <i className="ri-arrow-right-double-fill"></i>
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;