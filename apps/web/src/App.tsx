import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollToTop } from "@/components/client/ScrollToTop";
import Index from "./pages/Index";
import DocsRouter from "./docs/DocsRouter";

const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const Government = lazy(() => import("./pages/Government"));
const Customers = lazy(() => import("./pages/Customers"));
const Documentation = lazy(() => import("./pages/Documentation"));
const Resources = lazy(() => import("./pages/Resources"));
const News = lazy(() => import("./pages/News"));
const NewsPost = lazy(() => import("./pages/NewsPost"));
const Api = lazy(() => import("./pages/Api"));
const Support = lazy(() => import("./pages/Support"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const RequestQuota = lazy(() => import("./pages/RequestQuota"));
const Learn = lazy(() => import("./pages/Learn"));
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
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/enterprise" element={<Enterprise />} />
            <Route path="/government" element={<Government />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/docs/*" element={<DocsRouter />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsPost />} />
            <Route path="/api" element={<Api />} />
            <Route path="/support" element={<Support />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/request-quota" element={<RequestQuota />} />
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
