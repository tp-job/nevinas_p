import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from 'react';
import type { FC } from 'react';

// page
import HomePage from "@/pages/HomePage";
import Dashboard from "@/pages/Dashboard";
import TechStack from "@/pages/TechStack";
import Performance from "@/pages/Performance";
import ToolsPage from "@/pages/ToolsPage";
import Docs from "@/pages/Docs";
import Website from "@/pages/Website";
import ReactPage from "@/pages/ReactPage";
import Repository from "@/pages/Repository";
import TailwindPage from "@/pages/TailwindPage";
import Gallery from "@/pages/Gallery";
import BlogPage from "@/pages/BlogPage";
// layout
import WorkLayout from "@/layouts/WorkLayout";
// common
import LoadingSpinner from "@/components/common/LoadingSpinner";
import NotFound from "@/components/common/client-error/NotFound";
import ServerError from "@/components/common/server-error/ServerError";
import ServiceUnavailable from "@/components/common/server-error/ServiceUnavailable";
import GatewayTimeout from "@/components/common/server-error/GatewayTimeout";

const AppRoutes: FC = () => {
    return (
        <Router>
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    {/* home */}
                    <Route path="/" element={<HomePage />} />
                    {/* work */}
                    <Route path="/work" element={<WorkLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="website" element={<Website />} />
                        <Route path="react" element={<ReactPage />} />
                        <Route path="tailwindcss" element={<TailwindPage />} />
                        <Route path="tech-stack" element={<TechStack />} />
                        <Route path="performance" element={<Performance />} />
                        <Route path="repository" element={<Repository />} />
                        <Route path="tooling" element={<ToolsPage />} />
                        <Route path="docs" element={<Docs />} />
                        <Route path="gallery" element={<Gallery />} />
                        <Route path="blog" element={<BlogPage />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                    <Route path="/notfound" element={<NotFound />} />
                    <Route path="/loading" element={<LoadingSpinner />} />
                    <Route path="/server-error" element={<ServerError />} />
                    <Route path="/service-unavailable" element={<ServiceUnavailable />} />
                    <Route path="/gateway-timeout" element={<GatewayTimeout />} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRoutes;