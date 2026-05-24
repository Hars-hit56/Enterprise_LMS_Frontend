import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { fetchCourseById } from "../store/courseStore";

export function useCourseDetail(courseId?: string) {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCourse, isDetailLoading, detailError } = useSelector(
    (state: RootState) => state.courses,
  );
  const courseMatchesRoute =
    selectedCourse?._id === courseId || selectedCourse?.id === courseId;

  useEffect(() => {
    if (!courseId) {
      return;
    }

    void dispatch(fetchCourseById(courseId));
  }, [courseId, dispatch]);

  return {
    course: courseMatchesRoute ? selectedCourse : null,
    isLoading:
      isDetailLoading || Boolean(courseId && !courseMatchesRoute && !detailError),
    error: detailError,
  };
}
