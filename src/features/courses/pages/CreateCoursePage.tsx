import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CreateCourseForm } from "../components/EditCourseForm";
import { Toast } from "../../../components/ui/Toast";
import type { CourseFormData } from "../../../types";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  clearCreateError,
  createCourse,
  fetchCourses,
} from "../store/courseStore";
import { fetchInstructorAnalytics } from "../../analytics/store/analyticsStore";

export function CreateCoursePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isCreating, createError } = useSelector(
    (state: RootState) => state.courses,
  );

  const handleSave = async (courseData: CourseFormData) => {
    await dispatch(createCourse(courseData)).unwrap();
    await Promise.all([
      dispatch(fetchCourses("instructor")).unwrap(),
      dispatch(fetchInstructorAnalytics()).unwrap(),
    ]);
    navigate("/instructor/courses", {
      state: { successMessage: "Course created successfully." },
    });
  };

  const handleCancel = () => {
    navigate("/instructor/courses");
  };

  return (
    <>
      {createError ? (
        <Toast
          message={createError}
          type="error"
          onClose={() => dispatch(clearCreateError())}
        />
      ) : null}
      <CreateCourseForm
        isSaving={isCreating}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </>
  );
}
