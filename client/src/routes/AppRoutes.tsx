import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, useEffect, lazy } from "react";
import type { FC } from "react";

// context
import { ErrorProvider, useError } from "@/context/ErrorContext";
import { NotificationProvider } from "@/context/NotificationContext";
import ToastViewport from "@/components/ui/Toast";
// http error dispatch — apiFetch reports 5xx here so error pages can render
import { registerErrorHandler } from "@/utils/api";
// error boundary
import ErrorBoundary from "@/components/common/server-error/ErrorBoundary";

// pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const TechStack = lazy(() => import("@/pages/TechStack"));
const Performance = lazy(() => import("@/pages/Performance"));
const ToolsPage = lazy(() => import("@/pages/ToolsPage"));
const Docs = lazy(() => import("@/pages/Docs"));
const Website = lazy(() => import("@/pages/Website"));
const ReactPage = lazy(() => import("@/pages/ReactPage"));
const Repository = lazy(() => import("@/pages/Repository"));
const GraphView = lazy(() => import("@/pages/GraphView"));
const TailwindPage = lazy(() => import("@/pages/TailwindPage"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const FlutterPage = lazy(() => import("@/pages/FlutterPage"));
// layout
import WorkLayout from "@/layouts/WorkLayout";
// common
import LoadingScreen from "@/components/common/loading/LoadingPage";
// Route transitions get the cheap fallback, not the WebGL HUD — see the file.
import RouteFallback from "@/components/common/loading/RouteFallback";
import NotFound from "@/components/common/client-error/NotFound";
import ServerError from "@/components/common/server-error/ServerError";
import ServiceUnavailable from "@/components/common/server-error/ServiceUnavailable";
import GatewayTimeout from "@/components/common/server-error/GatewayTimeout";
// Debug-only route — lazy so the heavy three.js WebGL effect isn't pulled
// into the initial bundle for every visitor.
const LaserFlow = lazy(() => import("@/components/effect/LaserFlow"));
// Debug-only route — sandbox for the ParticleScroll effect, see the file header.
const ParticleScrollLab = lazy(() => import("@/pages/ParticleScrollLab"));

// ─── Error page map ───────────────────────────────────────────────────────────
// ✅ แก้ที่นี่ที่เดียว เพื่อเพิ่ม / เปลี่ยน error page ต่อ status code
const ERROR_PAGE_MAP: Record<number, FC> = {
  500: ServerError,
  503: ServiceUnavailable,
  504: GatewayTimeout,
};
// ─────────────────────────────────────────────────────────────────────────────

/**
 * AppRoutesInner — ต้องอยู่ใน ErrorProvider เพื่อใช้ useError
 * Registers the apiFetch error handler here so it has access to setError from context.
 */
const AppRoutesInner: FC = () => {
  const { errorCode, setError, clearError } = useError();

  // Register the apiFetch 5xx handler once on mount
  useEffect(() => {
    registerErrorHandler(setError);
  }, [setError]);

  // ─── Global HTTP error overlay ─────────────────────────────────
  // ถ้ามี errorCode → render error page แทน routes ทันที
  if (errorCode !== null) {
    const ErrorPage = ERROR_PAGE_MAP[errorCode] ?? ServerError;
    return (
      <div className="relative">
        <ErrorPage />
        {/* Dismiss — clear the error and return to the app.
            Design-system tokens only: the previous version hardcoded
            #1f2937/#374151/#9ca3af and asked for 'JetBrains Mono', a font this
            project does not ship (Inter + Zen Kaku Gothic New only), so it
            silently fell back to the generic monospace. */}
        <button
          onClick={clearError}
          title="Dismiss error and return to app"
          className="fixed top-4 right-4 z-[400] rounded-lg px-3.5 py-1.5
                     text-xs tracking-[0.08em] font-normal
                     bg-light-surface-2 dark:bg-dark-surface
                     border border-light-border dark:border-dark-border
                     text-light-text-secondary dark:text-dark-text-secondary
                     backdrop-blur-md transition-colors
                     hover:text-light-text dark:hover:text-dark-text
                     hover:border-haze/40 dark:hover:border-periwinkle/30
                     focus-visible:outline-2 focus-visible:outline-offset-2
                     focus-visible:outline-haze dark:focus-visible:outline-periwinkle"
        >
          <i aria-hidden="true" className="ri-close-line mr-1.5 align-[-1px]" />
          DISMISS
        </button>
      </div>
    );
  }

  // ─── Normal routes ─────────────────────────────────────────────
  return (
    <Routes>
      {/* home */}
      <Route path="/" element={<HomePage />} />

      {/* work — nested under WorkLayout */}
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
        <Route path="flutter" element={<FlutterPage />} />
      </Route>

      {/* full-page graph view — outside WorkLayout */}
      <Route path="/work/repository/graph-view" element={<GraphView />} />

      {/* utility / debug routes */}
      <Route path="/loading" element={<LoadingScreen />} />
      <Route path="/laserflow" element={<LaserFlow />} />
      <Route path="/particle-scroll" element={<ParticleScrollLab />} />

      {/* explicit error routes — for direct navigation & testing */}
      <Route path="/notfound" element={<NotFound />} />
      <Route path="/server-error" element={<ServerError />} />
      <Route path="/service-unavailable" element={<ServiceUnavailable />} />
      <Route path="/gateway-timeout" element={<GatewayTimeout />} />

      {/* catch-all 404 — MUST be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// ─── Root export ───────────────────────────────────────────────────────────────
const AppRoutes: FC = () => (
  <Router>
    <ErrorProvider>
      {/* Outside ErrorBoundary so notifications survive a boundary reset, and
          above the routes so any page's useFetch can reach it. */}
      <NotificationProvider>
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <AppRoutesInner />
          </Suspense>
        </ErrorBoundary>
        <ToastViewport />
      </NotificationProvider>
    </ErrorProvider>
  </Router>
);

export default AppRoutes;