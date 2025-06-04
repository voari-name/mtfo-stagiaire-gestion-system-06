
// Import types
export interface Intern {
  id: number;
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
  id: number;
  name: string;
  status: "début" | "en cours" | "fin";
  completion: number;
}

export interface Project {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
  interns: ProjectIntern[];
  tasks: Task[];
}

export interface EvaluationType {
  id: number;
  firstName: string;
  lastName: string;
  startDate: string;
  endDate: string;
  grade: number;
  comment: string;
}
