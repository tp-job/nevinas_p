import type { FC } from 'react';
import { Assets } from '@/data/HomeData';
import { useProfile } from '@/context/ProfileContext';

const Header: FC = () => {
    const { avatar, setAvatar, avatarUrl } = useProfile();

    return (
        <div className="flex flex-col items-center justify-center w-11/12 h-screen max-w-3xl gap-4 mx-auto text-center">
            {/* photo portfolio */}
            <div className="relative w-60 h-60 sm:w-72 sm:h-72">
                {/* main avatar */}
                <div className="flex items-center justify-center mt-10">
                    <img src={avatarUrl} alt="profile" className="object-cover w-40 h-40 sm:w-60 sm:h-60 rounded-full" />
                </div>

                {/* nevinas - top */}
                <button onClick={() => setAvatar('nevinas')} aria-pressed={avatar === 'nevinas'} className={`absolute top-[50px] left-[-55px] sm:top-[50px] sm:left-[-75px] overflow-hidden rounded-full w-18 h-18 sm:w-20 sm:h-20 ring-2 ${avatar === 'nevinas' ? 'ring-global-blue' : 'ring-light-border'} shadow hover:-translate-y-1 duration-500`}>
                    <img src={Assets.nevinas} alt="nevinas" className="object-cover w-full h-full" />
                </button>

                {/* changli - left */}
                <button onClick={() => setAvatar('changli')} aria-pressed={avatar === 'changli'} className={`absolute top-[150px] left-[-55px] sm:top-[180px] sm:left-[-75px] overflow-hidden rounded-full w-18 h-18 sm:w-24 sm:h-24 ring-2 ${avatar === 'changli' ? 'ring-global-blue' : 'ring-light-border'} shadow hover:-translate-y-1 duration-500`}>
                    <img src={Assets.changli} alt="changli" className="object-cover w-full h-full" />
                </button>

                {/* feixiao - right */}
                <button onClick={() => setAvatar('feixiao')} aria-pressed={avatar === 'feixiao'} className={`absolute top-[90px] right-[-65px] sm:top-[120px] sm:right-[-85px] overflow-hidden rounded-full w-18 h-18 sm:w-24 sm:h-24 ring-2 ${avatar === 'feixiao' ? 'ring-global-blue' : 'ring-light-border'} shadow hover:-translate-y-1 duration-500`}>
                    <img src={Assets.feixiao} alt="feixiao" className="object-cover w-full h-full" />
                </button>
            </div>
            <h3 className="flex items-end gap-4 mb-1 text-xl md:text-2xl text-light-text dark:text-white">
                Hi I'm Nevinas
                <i className="ri-check-line text-base text-center text-white bg-global-blue rounded-full px-1"></i>
            </h3>
            <h1 className="text-3xl sm:text-6xl lg:text-[66px] text-light-text dark:text-dark-text">Frontend web developer based in Isekai</h1>
            <h4 className="max-w-2xl mx-auto font-zen text-light-text-secondary dark:text-dark-text-secondary">私の名前はネヴィナスです。異世界出身のフロントエンド開発者です。</h4>
            <div className="flex flex-col items-center gap-4 mt-4 sm:flex-row">
                <a href="#contact" className="px-10 py-3 border rounded-full bg-gradient-to-r from-global-pink to-global-purple text-white flex items-center gap-2 dark:border-transparent">Contact Me</a>
                <a href={Assets.resume} download className="flex items-center gap-2 px-10 py-3 bg-light-surface border border-dark-surface-2 rounded-full dark:text-black">My resume</a>
            </div>
        </div>
    );
};

export default Header;