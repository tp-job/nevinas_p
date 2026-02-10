import type { FC } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import { Outlet } from 'react-router-dom';

const WorkLayout: FC = () => {
    return (
        <div className="h-screen flex overflow-hidden">
            <Sidebar />
            <main className="flex-1 px-5 lg:px-8 xl:px-[8%] pt-20 lg:pt-10 pb-10 space-y-10 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default WorkLayout;