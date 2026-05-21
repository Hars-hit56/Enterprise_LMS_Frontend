import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CourseForm } from "../components/EditCourseForm";
import { useAssessments } from "../../assessments/hooks/useAssessments";
import { Toast } from "../../../components/ui/Toast";
import type { CourseFormData, Assessment } from "../../../types";
import type { AppDispatch, RootState } from "../../../store/store";
import { useCourseDetail } from "../hooks/useCourseDetail";
import {
  clearUpdateError,
  fetchCourses,
  updateCourse,
} from "../store/courseStore";
import { fetchInstructorAnalytics } from "../../analytics/store/analyticsStore";

export function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isUpdating, updateError } = useSelector(
    (state: RootState) => state.courses,
  );
  const { course, isLoading, error } = useCourseDetail(id);
  const { assessments } = useAssessments();

  const courseAssessments =
    course ? assessments.filter((a) => a.course === course.title) : [];

  const handleSave = async (data: CourseFormData) => {
    if (!id) {
      return;
    }

    await dispatch(updateCourse({ courseId: id, course: data })).unwrap();
    await Promise.all([
      dispatch(fetchCourses("instructor")).unwrap(),
      dispatch(fetchInstructorAnalytics()).unwrap(),
    ]);
    navigate("/instructor/courses", {
      state: { successMessage: "Course updated successfully." },
    });
  };

  const handleCancel = () => {
    navigate("/instructor/courses");
  };

  const handleEditAssessment = (assessment: Assessment) => {
    navigate(`../assessments/edit/${assessment.id}`);
  };

  const handleDeleteAssessment = (assessment: Assessment) => {
    // TODO: delete assessment
    console.log("Delete assessment", assessment);
  };

  if (isLoading) {
    return <div className="text-sm text-ink-500">Loading course...</div>;
  }

  if (error) {
    return <div className="text-sm font-medium text-danger-700">{error}</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
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
      <CourseForm
        type="edit"
        course={course}
        assessments={courseAssessments}
        onEditAssessment={handleEditAssessment}
        onDeleteAssessment={handleDeleteAssessment}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isUpdating}
      />
    </>
  );
}
