import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toast } from "../../../components/ui/Toast";
import type { AppDispatch, RootState } from "../../../store/store";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCourses } from "../../courses/hooks/useCourses";
import { CreateAssessmentForm } from "../components/EditAssessmentForm";
import type { AssessmentFormData } from "../services/assessmentService";
import { clearCreateError, createAssessment } from "../store/assessmentStore";

export function CreateAssessmentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses, isLoading: isCoursesLoading } = useCourses(
    user?.role ?? "instructor",
  );
  const dispatch = useDispatch<AppDispatch>();
  const { createError, isCreating } = useSelector(
    (state: RootState) => state.assessments,
  );
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = async (assessmentData: AssessmentFormData) => {
    try {
      const result = await dispatch(createAssessment(assessmentData)).unwrap();
      setSuccessMessage(result.message);
      navigate("../courses");
    } catch {
      // The store keeps the create error and the toast renders it.
    }
  };

  const handleCancel = () => {
    navigate("../courses");
  };

  return (
    <>
      {successMessage ? (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => setSuccessMessage("")}
        />
      ) : null}
      {createError ? (
        <Toast
          message={createError}
          type="error"
          onClose={() => dispatch(clearCreateError())}
        />
      ) : null}
      <CreateAssessmentForm
        courses={courses}
        isCoursesLoading={isCoursesLoading}
        isSaving={isCreating}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </>
  );
}
