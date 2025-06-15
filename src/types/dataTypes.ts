
// Import types
export interface Intern {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  startDate: string;
  endDate: string;
  status: "début" | "en cours" | "fin";
  gender: "Masculin" | "Féminin";
  photo?: string;
}

export interface Task {
  id: number;
  name: string;
  status: "completed" | "in-progress" | "not-started";
}

export interface ProjectIntern {
  id: string;
  name: string;
  status: "début" | "en cours" | "fin";
  completion: number;
}

export interface Project {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
  interns: ProjectIntern[];
  tasks: Task[];
  status?: string | null;
}

export interface EvaluationType {
  id: string;
  firstName: string;
  lastName: string;
  startDate: string;
  endDate: string;
  grade: number;
  comment: string;
}
