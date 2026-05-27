import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { ConfirmModal } from "../../../components/common/ConfirmModal";
import { CourseForm } from "../components/EditCourseForm";
import { useInstructorCourseAssessments } from "../../assessments/hooks/useAssessments";
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
import {
  clearDeleteError,
  deleteAssessment,
} from "../../assessments/store/assessmentStore";

export function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isUpdating, updateError } = useSelector(
    (state: RootState) => state.courses,
  );
  const { deleteError, isDeleting } = useSelector(
    (state: RootState) => state.assessments,
  );
  const { course, isLoading, error } = useCourseDetail(id);
  const { assessments: courseAssessments } = useInstructorCourseAssessments(id);
  const [assessmentToDelete, setAssessmentToDelete] =
    useState<Assessment | null>(null);
  const successMessage =
    typeof location.state === "object" &&
    location.state &&
    "successMessage" in location.state
      ? String(location.state.successMessage)
      : "";

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
      replace: true,
      state: { successMessage: "Course updated successfully." },
    });
  };

  const handleCancel = () => {
    navigate("/instructor/courses", { replace: true });
  };

  const handleEditAssessment = (assessment: Assessment) => {
    navigate(`/instructor/assessments/edit/${assessment.id}?courseId=${id}`);
  };

  const handleDeleteAssessment = (assessment: Assessment) => {
    setAssessmentToDelete(assessment);
  };

  const handleConfirmDeleteAssessment = async () => {
    if (!assessmentToDelete) {
      return;
    }

    try {
      await dispatch(deleteAssessment(assessmentToDelete.id)).unwrap();
      setAssessmentToDelete(null);
    } catch {
      // The slice stores the API error and the toast renders it.
    }
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
      {successMessage ? (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => navigate(".", { replace: true, state: null })}
        />
      ) : null}
      {updateError ? (
        <Toast
          message={updateError}
          type="error"
          onClose={() => dispatch(clearUpdateError())}
        />
      ) : null}
      {deleteError ? (
        <Toast
          message={deleteError}
          type="error"
          onClose={() => dispatch(clearDeleteError())}
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
      <ConfirmModal
        open={Boolean(assessmentToDelete)}
        title="Delete assessment?"
        message={`Are you sure you want to delete "${
          assessmentToDelete?.title ?? "this assessment"
        }"? This action cannot be undone.`}
        confirmLabel="Delete"
        loadingLabel="Deleting..."
        cancelLabel="Cancel"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteAssessment}
        onCancel={() => setAssessmentToDelete(null)}
      />
    </>
  );
}
