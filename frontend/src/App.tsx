import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Spinner } from './components/ui/Spinner';
import { CustomCursor } from './components/ui/CustomCursor';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Analyze } from './pages/Analyze';
import { AnalysisResults } from './pages/AnalysisResults';
import { Improve } from './pages/Improve';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { Resumes } from './pages/Resumes';
import { History } from './pages/History';
import { Profile } from './pages/Profile';
import { Matches } from './pages/Matches';
import { Applications } from './pages/Applications';
import { Help } from './pages/Help';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center"><Spinner className="w-8 h-8" /></div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

import { DashboardLayout } from './components/dashboard/DashboardLayout';

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isLandingPage = location.pathname === '/';
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {!isAuthPage && !isLandingPage && !isDashboardRoute && <Navbar />}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/resume" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Resumes />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/analysis" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Analyze />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/analysis/:id" element={
            <ProtectedRoute>
              <DashboardLayout>
                <AnalysisResults />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/matches" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Matches />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/applications" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Applications />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/insights" element={
            <ProtectedRoute>
              <DashboardLayout>
                <History />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/settings" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/help" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Help />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/improve/:id" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Improve />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Keep old routes for backward compatibility or direct access if needed, but they won't have DashboardLayout unless we change them too. Actually, better to remove or redirect them. Let's redirect them to dashboard equivalents. */}
          <Route path="/analyze" element={<Navigate to="/dashboard/analysis" replace />} />
          <Route path="/analysis/:id" element={<Navigate to="/dashboard/analysis/:id" replace />} />
          <Route path="/improve/:id" element={<Navigate to="/dashboard/improve/:id" replace />} />
          <Route path="/resumes" element={<Navigate to="/dashboard/resume" replace />} />
          <Route path="/history" element={<Navigate to="/dashboard/insights" replace />} />
          <Route path="/profile" element={<Navigate to="/dashboard/settings" replace />} />
          
          <Route path="/dashboard/resume-builder" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ResumeBuilder />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/resume-builder" element={<Navigate to="/dashboard/resume-builder" replace />} />
        </Routes>
      </main>
      {!isAuthPage && !isLandingPage && !isDashboardRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <CustomCursor />
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
