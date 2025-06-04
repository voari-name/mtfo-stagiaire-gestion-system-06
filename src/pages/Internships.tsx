
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useDataContext } from "@/contexts/DataContext";
import { useSettings } from "@/contexts/SettingsContext";
import InternsHeader from "@/components/internships/InternsHeader";
import InternsTabs from "@/components/internships/InternsTabs";
import InternForm from "@/components/internships/InternForm";
import InternEditForm from "@/components/internships/InternEditForm";
import type { Intern } from "@/contexts/DataContext";

const Internships = () => {
  const { interns, addIntern, updateIntern, deleteIntern } = useDataContext();
  const { translations } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingIntern, setEditingIntern] = useState<Intern | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filter interns based on search term
  const filteredInterns = interns.filter(intern =>
    intern.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditIntern = (intern: Intern) => {
    setEditingIntern(intern);
    setIsEditDialogOpen(true);
  };

  return (
    <MainLayout title={translations["Gestion des stages"] || "Gestion des stages"} currentPage="internships">
      <div className="space-y-6">
        <InternsHeader 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={() => setIsDialogOpen(true)}
        />

        <InternForm
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={addIntern}
        />

        <InternEditForm
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={updateIntern}
          intern={editingIntern}
        />

        <InternsTabs
          filteredInterns={filteredInterns}
          searchTerm={searchTerm}
          onEditIntern={handleEditIntern}
          onDeleteIntern={deleteIntern}
        />
      </div>
    </MainLayout>
  );
};

export default Internships;
