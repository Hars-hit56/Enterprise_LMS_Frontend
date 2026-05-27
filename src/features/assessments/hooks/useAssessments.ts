import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  fetchAssessments,
  fetchInstructorCourseAssessments,
} from "../store/assessmentStore";

export function useAssessments(courseId?: string) {
  const dispatch = useDispatch<AppDispatch>();
  const { assessments, error, isLoading } = useSelector(
    (state: RootState) => state.assessments,
  );

  useEffect(() => {
    void dispatch(fetchAssessments(courseId));
  }, [courseId, dispatch]);

  return { assessments, error, isLoading };
}

export function useInstructorCourseAssessments(courseId?: string) {
  const dispatch = useDispatch<AppDispatch>();
  const { assessments, error, isLoading } = useSelector(
    (state: RootState) => state.assessments,
  );

  useEffect(() => {
    if (!courseId) {
      return;
    }

    void dispatch(fetchInstructorCourseAssessments(courseId));
  }, [courseId, dispatch]);

  return { assessments, error, isLoading };
}
