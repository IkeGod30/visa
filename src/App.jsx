import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ObjectivePage from './pages/ObjectivePage.jsx';
import GuidePage from './pages/GuidePage.jsx';
import AssessmentPage from './pages/AssessmentPage.jsx';
import AssistPage from './pages/AssistPage.jsx';
import ResourcesPage from './pages/ResourcesPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Admin-only page (and Firebase Auth) is split out of the public bundle.
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/purpose/:objectiveId" element={<ObjectivePage />} />
          <Route path="/purpose/:objectiveId/:countryId" element={<GuidePage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/assist" element={<AssistPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div className="container section muted">Loading…</div>}>
                <AdminPage />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
