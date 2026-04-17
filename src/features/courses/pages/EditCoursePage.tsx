import { useParams, useNavigate } from "react-router-dom";
import { CourseForm } from "../components/EditCourseForm";
import { useCourses } from "../hooks/useCourses";
import { useAssessments } from "../../assessments/hooks/useAssessments";
import { useAuth } from "../../auth/hooks/useAuth";
import type { CourseFormData, Assessment } from "../../../types";

export function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses } = useCourses(user?.role || "student");
  const { assessments } = useAssessments();

  const course = courses.find((c) => c.id === id);
  const courseAssessments =
    course ? assessments.filter((a) => a.course === course.title) : [];

  const handleSave = (data: CourseFormData) => {
    // TODO: save course
    console.log("Save course", data);
    navigate("..");
  };

  const handleCancel = () => {
    navigate("..");
  };

  const handleEditAssessment = (assessment: Assessment) => {
    navigate(`../assessments/edit/${assessment.id}`);
  };

  const handleDeleteAssessment = (assessment: Assessment) => {
    // TODO: delete assessment
    console.log("Delete assessment", assessment);
  };

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <CourseForm
      type="edit"
      course={course}
      assessments={courseAssessments}
      onEditAssessment={handleEditAssessment}
      onDeleteAssessment={handleDeleteAssessment}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
