import { useParams, useNavigate } from "react-router-dom";
import { AssessmentForm } from "../components/EditAssessmentForm";
import { useAssessments } from "../hooks/useAssessments";
import { useCourses } from "../../courses/hooks/useCourses";
import { useAuth } from "../../auth/hooks/useAuth";
import type { AssessmentFormData } from "../services/assessmentService";

export function EditAssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { assessments } = useAssessments();
  const { courses } = useCourses(user?.role || "student");

  const assessment = assessments.find((a) => a.id === id);
  const course =
    assessment ? courses.find((c) => c.title === assessment.course) : null;

  const handleSave = (data: AssessmentFormData) => {
    // TODO: save assessment
    console.log("Save assessment", data);
    // Navigate back to course edit
    if (course) {
      navigate(`../../courses/edit/${course.id}`);
    } else {
      navigate("../../courses");
    }
  };

  const handleCancel = () => {
    // Navigate back to course edit
    if (course) {
      navigate(`../../courses/edit/${course.id}`);
    } else {
      navigate("../../courses");
    }
  };

  if (!assessment) {
    return <div>Assessment not found</div>;
  }

  return (
    <AssessmentForm
      type="edit"
      assessment={assessment}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
