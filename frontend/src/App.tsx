import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { CompanyProvider } from './context/CompanyContext';
import { LanguageProvider } from './context/LanguageContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { CartDrawer } from './components/agro/CartDrawer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AgroPage } from './pages/AgroPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { DevelopmentPage } from './pages/DevelopmentPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ITPage } from './pages/ITPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { CareersPage } from './pages/CareersPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage';
import { AdminITPage } from './pages/admin/AdminITPage';
import { AdminNewsPage } from './pages/admin/AdminNewsPage';
import { AdminTeamPage } from './pages/admin/AdminTeamPage';
import { AdminCareersPage } from './pages/admin/AdminCareersPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCompanyInfoPage } from './pages/admin/AdminCompanyInfoPage';
import { ScrollToTop } from './components/common/ScrollToTop';

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CompanyProvider>
          <LanguageProvider>
            <ThemeProvider>
              <CartProvider>
            {/* Global Sonner Toast Notifications */}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                duration: 4000,
                className: 'font-sans text-xs',
              }}
            />

            <Routes>
              {/* Public Website Routes (Wrapped with Public Navbar, Cart Drawer & Footer) */}
              <Route
                element={
                  <>
                    <CartDrawer />
                    <PublicLayout />
                  </>
                }
              >
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Bayt Agro */}
                <Route path="/agro" element={<AgroPage />} />
                <Route path="/agro/products/:slug" element={<ProductDetailPage />} />
                <Route path="/agro/checkout" element={<CheckoutPage />} />

                {/* Bayt Development */}
                <Route path="/development" element={<DevelopmentPage />} />
                <Route path="/development/projects/:slug" element={<ProjectDetailPage />} />

                {/* Bayt IT */}
                <Route path="/it" element={<ITPage />} />

                {/* Shared Modules */}
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:slug" element={<NewsDetailPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
              </Route>

              {/* Standalone Admin Login (No Public Navbar, No Admin Sidebar) */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Dedicated Admin Portal (Dedicated Sidebar, No Public Navbar/Footer) */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="projects" element={<AdminProjectsPage />} />
                <Route path="inquiries" element={<AdminInquiriesPage />} />
                <Route path="it" element={<AdminITPage />} />
                <Route path="news" element={<AdminNewsPage />} />
                <Route path="team" element={<AdminTeamPage />} />
                <Route path="careers" element={<AdminCareersPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="company-info" element={<AdminCompanyInfoPage />} />
              </Route>

              {/* 404 Catch All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </ThemeProvider>
        </LanguageProvider>
        </CompanyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
