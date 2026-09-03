import type { FC } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import { Outlet } from "react-router-dom";
import { RepoProvider } from "@/context/RepoContext";

const WorkLayout: FC = () => {
  return (
    <div className="h-screen flex overflow-hidden bg-theme-surface">
      <Sidebar />
      {/* RepoProvider wraps only the /work section, not the whole app: the
          repository list is what these pages are about, and HomePage does not
          consume it. Mounting it higher would fetch ~50KB on a route that has
          no use for it. */}
      <main className="flex-1 px-5 lg:px-8 xl:px-[8%] pt-20 lg:pt-10 pb-10 space-y-10 overflow-y-auto bg-theme-surface">
        <RepoProvider>
          <Outlet />
        </RepoProvider>
      </main>
    </div>
  );
};

export default WorkLayout;
