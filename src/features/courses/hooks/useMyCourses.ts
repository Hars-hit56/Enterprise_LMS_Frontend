import { useEffect, useState } from "react";
import type { Course } from "../../../types";
import { courseService } from "../services/courseService";

export function useMyCourses(enabled = true) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadMyCourses() {
      setIsLoading(true);
      setError(null);

      try {
        const enrolledCourses = await courseService.getMyCourses();

        if (isMounted) {
          setCourses(enrolledCourses);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load enrolled courses.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadMyCourses();

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  return { courses, isLoading, error };
}
