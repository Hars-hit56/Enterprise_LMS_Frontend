import { useNavigate } from "react-router-dom";
import { CreateCourseForm } from "../components/EditCourseForm";
import type { CourseFormData } from "../../../types";

export function CreateCoursePage() {
  const navigate = useNavigate();

  const handleSave = (courseData: CourseFormData) => {
    console.log("Create course", courseData);
    // navigate("..");
  };

  const handleCancel = () => {
    navigate("..");
  };

  return <CreateCourseForm onSave={handleSave} onCancel={handleCancel} />;
}
