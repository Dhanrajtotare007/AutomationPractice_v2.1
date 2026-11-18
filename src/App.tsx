import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { CoursesPage } from '@/pages/CoursesPage';
import { EventsPage } from '@/pages/EventsPage';
import { ShopPage } from '@/pages/ShopPage';
import { ApiDocsPage } from '@/pages/ApiDocsPage';
import { BlogPage } from '@/pages/BlogPage';
import { BlogArticlePage } from '@/pages/BlogArticlePage';
import { InterviewPage } from '@/pages/InterviewPage';
import { ContactPage } from '@/pages/ContactPage';
import { SearchPage } from '@/pages/SearchPage';
import { DashboardPage } from '@/pages/testing/DashboardPage';
import { ModulePage } from '@/pages/testing/ModulePage';
import { NotFound } from '@/pages/NotFound';

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="api-docs" element={<ApiDocsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogArticlePage />} />
        <Route path="interview-preparation" element={<InterviewPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="testing" element={<DashboardPage />} />
        <Route path="testing/:moduleSlug" element={<ModulePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
