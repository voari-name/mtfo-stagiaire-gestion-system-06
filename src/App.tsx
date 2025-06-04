
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { SettingsProvider } from '@/contexts/SettingsContext';
import { DataProvider } from '@/contexts/DataContext';
import { ProjectsProvider } from '@/contexts/ProjectsContext';
import { EvaluationsProvider } from '@/contexts/EvaluationsContext';
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

function App() {
  return (
    <SettingsProvider>
      <DataProvider>
        <ProjectsProvider>
          <EvaluationsProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/internships" element={<Internships />} />
                  <Route path="/evaluations" element={<Evaluations />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="/affectation" element={<Affectation />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </EvaluationsProvider>
        </ProjectsProvider>
      </DataProvider>
    </SettingsProvider>
  );
}

export default App;
