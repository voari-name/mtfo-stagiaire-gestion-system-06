
import { useState, ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useSupabaseAuthContext } from "@/contexts/SupabaseAuthContext";

type MainLayoutProps = {
  children: ReactNode;
  title: string;
  currentPage?: string;
  username?: string;
};

const MainLayout = ({ 
  children, 
  title, 
  currentPage = "dashboard",
  username = ""
}: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useSupabaseAuthContext();
  
  const handleLogout = async () => {
    await logout('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} username={username} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
