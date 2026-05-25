import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AssessmentForm } from "../components/EditAssessmentForm";
import { useAssessments } from "../hooks/useAssessments";
import { useCourses } from "../../courses/hooks/useCourses";
import { useAuth } from "../../auth/hooks/useAuth";
import type { AssessmentFormData } from "../services/assessmentService";
import type { AppDispatch, RootState } from "../../../store/store";
import { Toast } from "../../../components/ui/Toast";
import {
  clearUpdateError,
  updateAssessment,
} from "../store/assessmentStore";

export function EditAssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const role = user?.role === "admin" ? "admin" : "instructor";
  const sourceCourseId = searchParams.get("courseId");
  const { assessments } = useAssessments();
  const { courses } = useCourses(user?.role || "student");
  const { isUpdating, updateError } = useSelector(
    (state: RootState) => state.assessments,
  );

  const assessment = assessments.find((a) => a.id === id);
  const course = assessment
    ? courses.find((course) => {
        const courseId = course._id ?? course.id;
        return (
          courseId === assessment.courseId ||
          courseId === assessment.course ||
          course.title === assessment.course
        );
      })
    : null;

  const getBackPath = () => {
    if (sourceCourseId) {
      return `/${role}/courses/edit/${sourceCourseId}`;
    }

    if (course) {
      return `/${role}/courses/edit/${course._id ?? course.id}`;
    }

    return `/${role}/courses`;
  };

  const handleSave = async (data: AssessmentFormData) => {
    if (!id) {
      return;
    }

    try {
      await dispatch(
        updateAssessment({ assessmentId: id, assessment: data }),
      ).unwrap();
      navigate(getBackPath(), {
        replace: true,
        state: { successMessage: "Assessment updated successfully." },
      });
    } catch {
      // The slice stores the API error and the toast renders it.
    }
  };

  const handleCancel = () => {
    navigate(getBackPath(), { replace: true });
  };

  if (!assessment) {
    return <div>Assessment not found</div>;
  }

  return (
    <>
      {updateError ? (
        <Toast
          message={updateError}
          type="error"
          onClose={() => dispatch(clearUpdateError())}
        />
      ) : null}
      <AssessmentForm
        type="edit"
        assessment={assessment}
        courses={courses}
        isSaving={isUpdating}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </>
  );
}
