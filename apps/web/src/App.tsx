import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollToTop } from "@/components/client/ScrollToTop";
import Index from "./pages/Index";

const DocsRouter = lazy(() => import("./docs/DocsRouter"));
const News = lazy(() => import("./pages/News"));
const NewsPost = lazy(() => import("./pages/NewsPost"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Privacy = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Terms })));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return <div className="min-h-screen bg-background" aria-hidden />;
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="adara-ui-theme">
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<Navigate to={{ pathname: "/", hash: "mission" }} replace />} />
            <Route path="/products" element={<Navigate to={{ pathname: "/", hash: "features" }} replace />} />
            <Route path="/enterprise" element={<Navigate to={{ pathname: "/", hash: "who-we-serve" }} replace />} />
            <Route path="/government" element={<Navigate to={{ pathname: "/", hash: "who-we-serve" }} replace />} />
            <Route path="/customers" element={<Navigate to={{ pathname: "/", hash: "who-we-serve" }} replace />} />
            <Route path="/documentation" element={<Navigate to="/docs/introduction" replace />} />
            <Route path="/docs/*" element={<DocsRouter />} />
            <Route path="/resources" element={<Navigate to={{ pathname: "/", hash: "news" }} replace />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsPost />} />
            <Route path="/api" element={<Navigate to={{ pathname: "/", hash: "approach" }} replace />} />
            <Route path="/support" element={<Navigate to={{ pathname: "/", hash: "contact" }} replace />} />
            <Route path="/learn" element={<Navigate to={{ pathname: "/", hash: "approach" }} replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/request-quota" element={<Navigate to={{ pathname: "/", hash: "contact" }} replace />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/client-dashboard" element={<Navigate to="/" replace />} />
            <Route path="/labeler-dashboard" element={<Navigate to="/" replace />} />
            <Route path="/admin-dashboard" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
