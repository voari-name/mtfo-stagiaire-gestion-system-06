
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { SettingsProvider } from '@/contexts/SettingsContext';
import { DataProvider } from '@/contexts/DataContext';
import { ProjectsProvider } from '@/contexts/ProjectsContext';
import { EvaluationsProvider } from '@/contexts/EvaluationsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Projects from '@/pages/Projects';
import Internships from '@/pages/Internships';
import Evaluations from '@/pages/Evaluations';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Reports from '@/pages/Reports';
import Statistics from '@/pages/Statistics';
import Affectation from '@/pages/Affectation';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <DataProvider>
            <ProjectsProvider>
              <EvaluationsProvider>
                <div className="min-h-screen bg-background">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/projects" element={
                      <ProtectedRoute>
                        <Projects />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/internships" element={
                      <ProtectedRoute>
                        <Internships />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/evaluations" element={
                      <ProtectedRoute>
                        <Evaluations />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/reports" element={
                      <ProtectedRoute>
                        <Reports />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/statistics" element={
                      <ProtectedRoute>
                        <Statistics />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/affectation" element={
                      <ProtectedRoute>
                        <Affectation />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                </div>
              </EvaluationsProvider>
            </ProjectsProvider>
          </DataProvider>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
