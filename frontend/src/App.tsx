import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ChatProvider } from './context/ChatContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/ui/CustomCursor';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CallModal } from './components/calling/CallModal';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
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
import { Opportunities } from './pages/Opportunities';
import { Projects } from './pages/Projects';
import { Messages } from './pages/Messages';
import { Assistant } from './pages/Assistant';
import { Help } from './pages/Help';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsers } from './pages/AdminUsers';
import { AdminClients } from './pages/AdminClients';
import { AdminProjects } from './pages/AdminProjects';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { ManagerTeam } from './pages/ManagerTeam';
import { ManagerProjects } from './pages/ManagerProjects';
import { ManagerJDs } from './pages/ManagerJDs';
import { ManagerApplications } from './pages/ManagerApplications';
import { ManagerCandidates } from './pages/ManagerCandidates';

import { DashboardLayout } from './components/dashboard/DashboardLayout';

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isLandingPage = location.pathname === '/';
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/manager');

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {!isAuthPage && !isLandingPage && !isDashboardRoute && <Navbar />}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/employees" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <AdminUsers />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/managers" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <AdminUsers />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/clients" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <AdminClients />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/projects" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <AdminProjects />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Manager Routes */}
          <Route path="/manager" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <DashboardLayout>
                <ManagerDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/team" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <DashboardLayout>
                <ManagerTeam />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/projects" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <DashboardLayout>
                <ManagerProjects />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/jds" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <DashboardLayout>
                <ManagerJDs />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/applications" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <DashboardLayout>
                <ManagerApplications />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/jds/:jdId/matches" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <DashboardLayout>
                <ManagerCandidates />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/messages" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <DashboardLayout>
                <Messages />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Employee / General Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/resume" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <DashboardLayout>
                <Resumes />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/analysis" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <DashboardLayout>
                <Analyze />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/analysis/:id" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <DashboardLayout>
                <AnalysisResults />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/matches" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <DashboardLayout>
                <Matches />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/applications" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <DashboardLayout>
                <Applications />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/opportunities" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <DashboardLayout>
                <Opportunities />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/projects" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <DashboardLayout>
                <Projects />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/messages" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <DashboardLayout>
                <Messages />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/assistant" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <DashboardLayout>
                <Assistant />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/insights" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <DashboardLayout>
                <History />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/settings" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/help" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <DashboardLayout>
                <Help />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/improve/:id" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <DashboardLayout>
                <Improve />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/resume-builder" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <DashboardLayout>
                <ResumeBuilder />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/analyze" element={<Navigate to="/dashboard/analysis" replace />} />
          <Route path="/analysis/:id" element={<AnalysisRedirect />} />
          <Route path="/improve/:id" element={<ImproveRedirect />} />
          <Route path="/resumes" element={<Navigate to="/dashboard/resume" replace />} />
          <Route path="/history" element={<Navigate to="/dashboard/insights" replace />} />
          <Route path="/profile" element={<Navigate to="/dashboard/settings" replace />} />
          <Route path="/resume-builder" element={<Navigate to="/dashboard/resume-builder" replace />} />
        </Routes>
      </main>
      {!isAuthPage && !isLandingPage && !isDashboardRoute && <Footer />}
    </div>
  );
}

import { useParams } from 'react-router-dom';

function AnalysisRedirect() {
  const { id } = useParams();
  return <Navigate to={`/dashboard/analysis/${id}`} replace />;
}

function ImproveRedirect() {
  const { id } = useParams();
  return <Navigate to={`/dashboard/improve/${id}`} replace />;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ChatProvider>
            <CustomCursor />
            <CallModal />
            <AppLayout />
          </ChatProvider>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
