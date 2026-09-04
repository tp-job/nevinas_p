import type { FC } from "react";
import { useProfile } from "@/context/ProfileContext";
import { DataAbout, DataTools } from "@/data/homeData";

const About: FC = () => {
  const { avatarUrl } = useProfile();

  return (
    <div className="relative w-full px-[12%] py-10 scroll-mt-20 overflow-hidden min-h-[90vh] flex flex-col justify-center">
      <div className="relative z-10">
        <h4 className="mb-1 text-lg text-center text-haze dark:text-cool">
          Introduction
        </h4>
        <h2 className="mb-1 text-4xl sm:text-5xl text-center text-light-text dark:text-dark-text">
          About Me
        </h2>
        <h3 className="text-xl text-center font-zen text-haze dark:text-cool">
          私について
        </h3>
        <div className="flex flex-col items-center w-full gap-20 my-20 lg:flex-row">
          <div className="relative mx-auto max-w-max">
            <img
              src={avatarUrl}
              alt="user"
              loading="lazy"
              decoding="async"
              className="w-64 sm:w-80 rounded-3xl max-w-none object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="max-w-2xl mb-10 text-light-text dark:text-dark-text">
              I am passionate about exploring the world of web development, with a
              focus on HTML, CSS, and JavaScript to craft visually appealing and
              interactive user interfaces.
            </p>
            <ul className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
              {DataAbout.map((items) => (
                <li
                  key={items.id}
                  className="border-[.5px] card-glass p-6 duration-500"
                  tabIndex={0}
                >
                  <i
                    className={`${items.icon} text-5xl text-light-text dark:text-dark-text`}
                  ></i>
                  <h3 className="my-4 font-medium text-light-text dark:text-dark-text">
                    {items.title}
                  </h3>
                  <p className="text-sm text-haze dark:text-cool">
                    {items.detail}
                  </p>
                </li>
              ))}
            </ul>
            <h4 className="my-6 text-haze dark:text-cool">
              Tools I use
            </h4>
            <ul className="flex items-center gap-3 sm:gap-5">
              {DataTools.map((items) => (
                <li
                  key={items.id}
                  className="flex items-center justify-center w-12 duration-500 border border-light-border dark:border-dark-border rounded-lg sm:w-14 aspect-square bg-light-surface-2/50 dark:bg-dark-surface-2/50 backdrop-blur-sm"
                >
                  <i
                    className={`${items.icon} text-2xl`}
                    style={{ color: items.color }}
                  ></i>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
