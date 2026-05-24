import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type UserRole = "student" | "instructor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  photoUrl?: string;
  status?: "Active" | "Inactive" | "Invited";
  joined?: string;
}

export interface creator {
  _id: string;
  name: string;
  photoUrl: string;
}
export interface Course {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  instructor?: string;
  progress?: number;
  lessons?: number;
  duration?: string;
  status?: "Published" | "Draft" | "Review";
  students?: number;
  rating?: number;
  thumbnail?: string;
  description?: string;
  nextLesson?: string;
  isEnrolled?: boolean;
  isRecommended?: boolean;
  price: string | number;
  currency?: string;
  isFree?: boolean;
  enrolledStudents?: unknown[];
  creator?: creator;
  isPublished?: boolean;
  reviews?: unknown[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  difficulty?: string;
  modules?: Module[];
  enrollmentId?: string;
}

export interface Module {
  _id?: string;
  id?: number | string;
  moduleTitle?: string;
  title?: string;
  lectures?: Array<Lesson | string>;
  lessons?: Lesson[];
}

export interface Lesson {
  _id?: string;
  id?: number | string;
  lectureTitle?: string;
  title?: string;
  videoUrl?: string | null;
  isPreviewFree?: boolean;
  createdAt?: string;
  updatedAt?: string;
  video?: File | null;
  isFree?: boolean;
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
  courseId?: string;
  createdAt: string;
  score?: number;
  submissions: number;
  status: "Upcoming" | "Open" | "Closed";
  description?: string;
  timeLimit?: string;
  totalMarks?: string;
  passingScore?: string;
  maxAttempts?: string;
  questions?: Question[];
}

export interface AssessmentQuestionResult {
  _id?: string;
  question: string;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
}

export interface AssessmentResult {
  _id?: string;
  assessmentId: string;
  userId: string;
  score: number;
  totalPoints: number;
  correctCount: number;
  incorrectCount: number;
  percentage: number;
  passed: boolean;
  status: "PASS" | "FAIL" | string;
  totalQuestions: number;
  questionResults: AssessmentQuestionResult[];
  createdAt?: string;
  updatedAt?: string;
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
  price: string;
  currency: string;
  isFree: boolean;
  isPublished?: boolean;
  thumbnail: File | null;
  thumbnailPreview: string;
  modules: Module[];
}
