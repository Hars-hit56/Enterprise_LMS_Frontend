import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AssessmentQuizPage } from "../features/assessments/pages/AssessmentQuizPage";
import { AdminDashboardPage } from "../features/analytics/pages/AdminDashboardPage";
import { InstructorDashboardPage } from "../features/analytics/pages/InstructorDashboardPage";
import { StudentDashboardPage } from "../features/analytics/pages/StudentDashboardPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { SignupPage } from "../features/auth/pages/SignupPage";
import { EditProfilePage } from "../features/auth/pages/EditProfilePage";
import { CourseManagementPage } from "../features/courses/pages/CourseManagementPage";
import { CourseDetailPage } from "../features/courses/pages/CourseDetailPage";
import { CoursePlayerPage } from "../features/courses/pages/CoursePlayerPage";
import { CoursesPage } from "../features/courses/pages/CoursesPage";
import { CreateCoursePage } from "../features/courses/pages/CreateCoursePage";
import { MyCoursesPage } from "../features/courses/pages/MyCoursesPage";
import { StudentsPage } from "../features/users/pages/StudentsPage";
import { UserManagementPage } from "../features/users/pages/UserManagementPage";
import { AdminLayout } from "../layouts/AdminLayout";
import { InstructorLayout } from "../layouts/InstructorLayout";
import { StudentLayout } from "../layouts/StudentLayout";
import { NotFoundPage } from "../pages/NotFoundPage";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { RoleHomeRedirect } from "./routes/RoleHomeRedirect";
import { CreateAssessmentPage } from "../features/assessments/pages/CreateAssessmentPage";
import { EditCoursePage } from "../features/courses/pages/EditCoursePage";
import { EditAssessmentPage } from "../features/assessments/pages/EditAssessmentPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<RoleHomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="profile" element={<EditProfilePage />} />
            <Route path="my-courses" element={<MyCoursesPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:courseId" element={<CourseDetailPage />} />
            <Route
              path="courses/:courseId/learn"
              element={<CoursePlayerPage />}
            />
            <Route
              path="assessments/:assessmentId"
              element={<AssessmentQuizPage />}
            />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
          <Route path="/instructor" element={<InstructorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<InstructorDashboardPage />} />
            <Route path="profile" element={<EditProfilePage />} />
            <Route path="courses" element={<CourseManagementPage />} />
            <Route path="courses/create" element={<CreateCoursePage />} />
            <Route path="courses/edit/:id" element={<EditCoursePage />} />
            <Route
              path="courses/:courseId/learn"
              element={<CoursePlayerPage />}
            />
            <Route
              path="assessments/create"
              element={<CreateAssessmentPage />}
            />
            <Route
              path="assessments/edit/:id"
              element={<EditAssessmentPage />}
            />
            {/* <Route path="assessments" element={<AssessmentsPage />} /> */}
            <Route path="students" element={<StudentsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="profile" element={<EditProfilePage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="courses" element={<CourseManagementPage />} />
            <Route path="courses/create" element={<CreateCoursePage />} />
            <Route path="courses/edit/:id" element={<EditCoursePage />} />
            <Route
              path="courses/:courseId/learn"
              element={<CoursePlayerPage />}
            />
            <Route
              path="assessments/create"
              element={<CreateAssessmentPage />}
            />
            <Route
              path="assessments/edit/:id"
              element={<EditAssessmentPage />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
