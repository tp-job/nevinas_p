import type { FC } from "react";
import { DataServices } from "@/data/HomeData";

const Services: FC = () => {
  return (
    <div id="services" className="w-full px-[12%] py-10 scroll-mt-20">
      <h4 className="mb-1 text-lg text-center text-light-text dark:text-dark-text">
        What i offer
      </h4>
      <h2 className="mb-1 text-4xl sm:text-5xl text-center text-light-text dark:text-dark-text">
        My Services
      </h2>
      <h3 className="text-xl text-center font-zen text-light-text-secondary dark:text-dark-text-secondary">
        私のサービス
      </h3>
      <p className="max-w-2xl mx-auto mt-5 mb-12 text-center text-light-text-secondary dark:text-dark-text-secondary">
        I am a frontend developer from a parallel world.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-10 auto-rows-[minmax(280px,auto)]">
        {DataServices.map((items, index) => {
          // Bento Span Logic
          let spanClass = "";
          if (index === 0) spanClass = "lg:col-span-2 lg:row-span-2"; // Large feature
          else if (index === 1) spanClass = "lg:col-span-2"; // Horizontal wide
          else spanClass = "lg:col-span-1"; // Normal tiles

          return (
            <div
              key={items.id}
              className={`${spanClass} card-glass p-8 flex flex-col justify-between cursor-pointer group hover:-translate-y-1`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c060f5]/12 to-[#7b5aff]/12 border border-[rgba(192,96,245,0.20)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <i className={`${items.icon} text-2xl text-[#c060f5]`}></i>
                </div>
                <h3 className="text-xl font-medium text-light-text dark:text-dark-text mb-4">
                  {items.title}
                </h3>
                <p className="text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary line-clamp-4">
                  {items.detail}
                </p>
              </div>
              
              <a href="#" className="flex items-center gap-2 text-sm font-medium text-matte-azure mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                Read more
                <i className="ri-arrow-right-line"></i>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
