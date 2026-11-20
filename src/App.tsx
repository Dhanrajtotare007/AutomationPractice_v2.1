import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { ApiDocsPage } from '@/pages/ApiDocsPage';
import { BlogPage } from '@/pages/BlogPage';
import { BlogArticlePage } from '@/pages/BlogArticlePage';
import { InterviewPage } from '@/pages/InterviewPage';
import { ContactPage } from '@/pages/ContactPage';
import { SearchPage } from '@/pages/SearchPage';
import { ChallengesPage } from '@/pages/ChallengesPage';
import { ResourcesPage } from '@/pages/ResourcesPage';
import { DashboardPage } from '@/pages/testing/DashboardPage';
import { ModulePage } from '@/pages/testing/ModulePage';
import { NotFound } from '@/pages/NotFound';

/** Legacy `/testing` URLs keep working - they now live under `/labs`. */
function LegacyModuleRedirect() {
  const { moduleSlug } = useParams();
  return <Navigate to={moduleSlug ? `/labs/${moduleSlug}` : '/labs'} replace />;
}

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="labs" element={<DashboardPage />} />
        <Route path="labs/:moduleSlug" element={<ModulePage />} />
        <Route path="challenges" element={<ChallengesPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="api-docs" element={<ApiDocsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogArticlePage />} />
        <Route path="interview-preparation" element={<InterviewPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="testing" element={<LegacyModuleRedirect />} />
        <Route path="testing/:moduleSlug" element={<LegacyModuleRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
