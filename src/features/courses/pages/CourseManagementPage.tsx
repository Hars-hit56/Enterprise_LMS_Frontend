import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { ConfirmModal } from "../../../components/common/ConfirmModal";
import { DataTable } from "../../../components/common/DataTable";
import { RowActions } from "../../../components/common/RowActions";
import { StatCard } from "../../../components/common/StatCard";
import { CoursePortfolioSkeleton } from "../../../components/skeletons/CoursePortfolioSkeleton";
import { StatCardSkeletonGrid } from "../../../components/skeletons/StatCardSkeleton";
import { Badge } from "../../../components/ui/Badge";
import { Toast } from "../../../components/ui/Toast";
import { useCourseManagementAnalytics } from "../../analytics/hooks/useAnalytics";
import {
  fetchAdminAnalytics,
  fetchInstructorAnalytics,
} from "../../analytics/store/analyticsStore";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCourses } from "../hooks/useCourses";
import type { Course, UserRole } from "../../../types";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  clearDeleteError,
  clearUpdateError,
  deleteCourse,
  fetchCourses,
  updateCoursePublishStatus,
} from "../store/courseStore";

type PendingStatusChange = {
  course: Course;
  isPublished: boolean;
};

function formatCoursePrice(course: Course) {
  if (course.isFree) {
    return "Free";
  }

  const currency =
    course.currency === "INR" ? "\u20B9" : (course.currency ?? "");

  return `${currency} ${course.price}`.trim();
}

const getColumns = (
  role: UserRole,
  onEditCourse: (course: Course) => void,
  onDeleteCourse: (course: Course) => void,
  onStatusChange: (course: Course, isPublished: boolean) => void,
) => {
  const baseColumns = [
    { key: "title", header: "Course" },

    {
      key: "isPublished",
      header: "Status",
      render: (course: Course) => (
        <CourseStatusDropdown course={course} onChange={onStatusChange} />
      ),
    },

    {
      key: "enrolledStudents",
      header: "Students",
      render: (course: Course) => course.enrolledStudents?.length ?? 0,
    },
    { key: "category", header: "Category" },
    {
      key: "price",
      header: "Revenue",
      render: formatCoursePrice,
    },
    {
      key: "actions",
      header: "",
      render: (course: Course) => (
        <RowActions
          onEdit={() => onEditCourse(course)}
          onDelete={() => onDeleteCourse(course)}
          editLabel="Edit Course"
          deleteLabel="Delete"
        />
      ),
    },
  ];

  if (role === "admin") {
    baseColumns.splice(1, 0, {
      key: "instructor",
      header: "Instructor",
    });
  }

  return baseColumns;
};

function CourseStatusDropdown({
  course,
  onChange,
}: {
  course: Course;
  onChange: (course: Course, isPublished: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const isPublished = Boolean(course.isPublished);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleSelect = (nextIsPublished: boolean) => {
    setOpen(false);

    if (nextIsPublished === isPublished) {
      return;
    }

    onChange(course, nextIsPublished);
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-1 rounded-full transition hover:opacity-80"
      >
        <Badge tone={isPublished ? "success" : "warning"}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
        <ChevronDown size={12} className="text-ink-500" />
      </button>

      {open ? (
        <div className="absolute left-0 z-30 mt-2 w-32 rounded-lg border border-line-200 bg-white p-1 shadow-lg">
          <button
            type="button"
            onClick={() => handleSelect(true)}
            className="w-full rounded-md px-2 py-2 text-left text-[11px] font-medium text-ink-900 hover:bg-soft"
          >
            Published
          </button>
          <button
            type="button"
            onClick={() => handleSelect(false)}
            className="w-full rounded-md px-2 py-2 text-left text-[11px] font-medium text-ink-900 hover:bg-soft"
          >
            Draft
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function CourseManagementPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { deleteError, isDeleting, isUpdating, updateError } = useSelector(
    (state: RootState) => state.courses,
  );
  const { courses, isLoading: isCoursesLoading } = useCourses(
    user?.role ?? "student",
  );
  const { stats, isLoading, error } = useCourseManagementAnalytics(user?.role);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
  const [statusSuccessMessage, setStatusSuccessMessage] = useState("");
  const [pendingStatusChange, setPendingStatusChange] =
    useState<PendingStatusChange | null>(null);
  const successMessage =
    typeof location.state === "object" &&
    location.state &&
    "successMessage" in location.state
      ? String(location.state.successMessage)
      : "";

  if (!user) {
    return null;
  }

  const columns = getColumns(
    user.role,
    (course) => {
      navigate(`edit/${course._id ?? course.id}`);
    },
    setCourseToDelete,
    (course, isPublished) => {
      setPendingStatusChange({ course, isPublished });
    },
  );

  const refreshAnalytics = () => {
    if (user.role === "admin") {
      void dispatch(fetchAdminAnalytics());
      return;
    }

    void dispatch(fetchInstructorAnalytics());
  };

  const handleDeleteCourse = async () => {
    const courseId = courseToDelete?._id ?? courseToDelete?.id;

    if (!courseId) {
      return;
    }

    try {
      const result = await dispatch(deleteCourse(courseId)).unwrap();
      setDeleteSuccessMessage(result.message);
      setCourseToDelete(null);
      void dispatch(fetchCourses(user.role));
      refreshAnalytics();
    } catch {
      // The slice stores the API error and the toast renders it.
    }
  };

  const handleUpdateCourseStatus = async () => {
    const courseId =
      pendingStatusChange?.course._id ?? pendingStatusChange?.course.id;

    if (!courseId || !pendingStatusChange) {
      return;
    }

    try {
      const result = await dispatch(
        updateCoursePublishStatus({
          courseId,
          isPublished: pendingStatusChange.isPublished,
          course: pendingStatusChange.course,
        }),
      ).unwrap();
      setStatusSuccessMessage(result.message);
      setPendingStatusChange(null);
      void dispatch(fetchCourses(user.role));
      refreshAnalytics();
    } catch {
      // The slice stores the API error and the toast renders it.
    }
  };

  return (
    <section className="space-y-6">
      {successMessage ? (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => navigate(".", { replace: true, state: null })}
        />
      ) : null}
      {deleteError ? (
        <Toast
          message={deleteError}
          type="error"
          onClose={() => dispatch(clearDeleteError())}
        />
      ) : null}
      {deleteSuccessMessage ? (
        <Toast
          message={deleteSuccessMessage}
          type="success"
          onClose={() => setDeleteSuccessMessage("")}
        />
      ) : null}
      {updateError ? (
        <Toast
          message={updateError}
          type="error"
          onClose={() => dispatch(clearUpdateError())}
        />
      ) : null}
      {statusSuccessMessage ? (
        <Toast
          message={statusSuccessMessage}
          type="success"
          onClose={() => setStatusSuccessMessage("")}
        />
      ) : null}
      <div>
        <h1 className="font-display text-[20px] font-medium tracking-tight text-ink-950">
          {user.role === "admin" ? "Courses" : "My Content"}
        </h1>
        <p className="mt-1 max-w-2xl text-[12px] text-ink-500">
          Manage your courses, lessons, and assessments
        </p>
      </div>

      {user.role !== "admin" && (
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("create")}>Create Course</Button>
          <Button
            variant="secondary"
            onClick={() => navigate("../assessments/create")}
          >
            Create Assessment
          </Button>
        </div>
      )}

      {error ? (
        <p className="text-sm font-medium text-danger-700">{error}</p>
      ) : null}
      {isLoading ? (
        <StatCardSkeletonGrid />
      ) : (
        <div className="grid gap-4 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <StatCard key={stat.id} stat={stat} icon={<Icon size={22} />} />
            );
          })}
        </div>
      )}
      {isCoursesLoading ? (
        <CoursePortfolioSkeleton />
      ) : (
        <DataTable
          title="Course portfolio"
          rows={courses}
          columns={columns}
          searchKey={(course) => course.title}
        />
      )}
      <ConfirmModal
        open={Boolean(courseToDelete)}
        title="Delete course?"
        message={`Are you sure you want to delete "${
          courseToDelete?.title ?? "this course"
        }"? This action cannot be undone.`}
        confirmLabel="Delete"
        loadingLabel="Deleting..."
        cancelLabel="Cancel"
        isLoading={isDeleting}
        onConfirm={handleDeleteCourse}
        onCancel={() => setCourseToDelete(null)}
      />
      <ConfirmModal
        open={Boolean(pendingStatusChange)}
        title="Change status?"
        message={`Are you sure you want to ${
          pendingStatusChange?.isPublished ? "publish" : "move to draft"
        } "${pendingStatusChange?.course.title ?? "this course"}"?`}
        confirmLabel={
          pendingStatusChange?.isPublished ? "Publish" : "Move to draft"
        }
        loadingLabel={
          pendingStatusChange?.isPublished ? "Publishing..." : "Updating..."
        }
        cancelLabel="Cancel"
        isLoading={isUpdating}
        onConfirm={handleUpdateCourseStatus}
        onCancel={() => setPendingStatusChange(null)}
      />
    </section>
  );
}
