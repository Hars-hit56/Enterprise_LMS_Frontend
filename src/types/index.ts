import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type UserRole = "student" | "instructor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  status?: "Active" | "Invited" | "Review";
  joined?: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  instructor: string;
  progress: number;
  lessons: number;
  duration: string;
  status: "Published" | "Draft" | "Review";
  students: number;
  rating: number;
  thumbnail: string;
  description?: string;
  nextLesson?: string;
  isEnrolled?: boolean;
  isRecommended?: boolean;
  price: string;
  difficulty?: string;
  modules?: Module[];
}

export interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  video?: File | null;
}

export interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface Assessment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  score?: number;
  submissions: number;
  status: "Upcoming" | "Open" | "Closed";
  description?: string;
  timeLimit?: string;
  passingScore?: string;
  maxAttempts?: string;
  questions?: Question[];
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
  isOpen: boolean;
}

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  delta?: string;
  tone?: "brand" | "success" | "warning" | "danger";
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
}

export interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export interface CourseFormData {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  thumbnail: File | null;
  thumbnailPreview: string;
  modules: Module[];
}
