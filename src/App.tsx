
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { SettingsProvider } from '@/contexts/SettingsContext';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import Index from '@/pages/Index';
import SupabaseLogin from '@/pages/SupabaseLogin';
import UpdatePassword from '@/pages/UpdatePassword';
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
import SupabaseProtectedRoute from '@/components/SupabaseProtectedRoute';

function App() {
  return (
    <Router>
      <SupabaseAuthProvider>
        <SettingsProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<SupabaseLogin />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              
              {/* Redirect old login route to new auth route */}
              <Route path="/login" element={<Navigate to="/auth" replace />} />
              
              <Route path="/dashboard" element={
                <SupabaseProtectedRoute>
                  <Dashboard />
                </SupabaseProtectedRoute>
              } />
              
              <Route path="/projects" element={
                <SupabaseProtectedRoute>
                  <Projects />
                </SupabaseProtectedRoute>
              } />
              
              <Route path="/internships" element={
                <SupabaseProtectedRoute>
                  <Internships />
                </SupabaseProtectedRoute>
              } />
              
              <Route path="/evaluations" element={
                <SupabaseProtectedRoute>
                  <Evaluations />
                </SupabaseProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <SupabaseProtectedRoute>
                  <Profile />
                </SupabaseProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <SupabaseProtectedRoute>
                  <Settings />
                </SupabaseProtectedRoute>
              } />
              
              <Route path="/reports" element={
                <SupabaseProtectedRoute>
                  <Reports />
                </SupabaseProtectedRoute>
              } />
              
              <Route path="/statistics" element={
                <SupabaseProtectedRoute>
                  <Statistics />
                </SupabaseProtectedRoute>
              } />
              
              <Route path="/affectation" element={
                <SupabaseProtectedRoute>
                  <Affectation />
                </SupabaseProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </SettingsProvider>
      </SupabaseAuthProvider>
    </Router>
  );
}

export default App;
