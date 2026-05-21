import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { UserRole } from "../../../types";
import type { AppDispatch, RootState } from "../../../store/store";
import { fetchCourses } from "../store/courseStore";

export function useCourses(role: UserRole) {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, isLoading, error, loadedRole } = useSelector(
    (state: RootState) => state.courses,
  );

  useEffect(() => {
    if (loadedRole === role) {
      return;
    }

    void dispatch(fetchCourses(role));
  }, [dispatch, loadedRole, role]);

  return { courses, isLoading, error };
}
