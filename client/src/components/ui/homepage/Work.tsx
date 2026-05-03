import { Link } from "react-router-dom";
import { DataWork } from "@/data/HomeData.ts";
import type { FC } from "react";

const Work: FC = () => {
  return (
    <div id="work" className="w-full px-[12%] py-10 scroll-mt-20">
      <h4 className="mb-1 text-lg text-center text-light-text dark:text-dark-text">
        My portfolio
      </h4>
      <h2 className="mb-1 text-4xl sm:text-5xl text-center text-light-text dark:text-dark-text">
        My latest work
      </h2>
      <h3 className="text-xl text-center font-zen text-light-text-secondary dark:text-dark-text-secondary">
        私の最新の作品
      </h3>
      <p className="max-w-2xl mx-auto mt-5 mb-12 text-center text-light-text-secondary dark:text-dark-text-secondary">
        Welcome to my web development portfolio Explore a collection of projects
        showcasing my expertise in front-end development.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-10 auto-rows-[minmax(300px,auto)]">
        {DataWork.map((items, index) => {
          let spanClass = "";
          if (index === 0) spanClass = "lg:col-span-2 lg:row-span-2";
          else if (index === 1) spanClass = "lg:col-span-2";
          else spanClass = "lg:col-span-1";

          return (
            <Link 
              key={items.id} 
              to="/work/dashboard" 
              className={`${spanClass} block group card-glass overflow-hidden relative cursor-pointer transition-all duration-500 hover:-translate-y-2`}
            >
              <div
                style={{ backgroundImage: `url(${items.img})` }}
                className="absolute inset-0 bg-no-repeat bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
              
              <div className="absolute inset-x-0 bottom-0 p-6 flex items-center justify-between transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">
                    {items.title}
                  </h3>
                  <p className="text-sm text-white/70 font-medium">
                    {items.detail}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform rotate-45 group-hover:rotate-0">
                  <i className="ri-arrow-right-up-line text-lg"></i>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <Link
        to="/work/dashboard"
        className="w-max flex items-center justify-center gap-2 text-light-text-secondary border-[.5px] border-light-text-secondary rounded-full py-3 px-10 mx-auto my-20 hover:bg-dark-bg hover:text-light-surface duration-500 dark:hover:bg-light-surface dark:text-dark-text dark:border-dark-text dark:hover:text-light-text"
      >
        Show more
      </Link>
    </div>
  );
};

export default Work;
