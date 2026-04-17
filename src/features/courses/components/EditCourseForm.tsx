import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Plus, Trash2, Upload } from "lucide-react";
import { AssessmentList } from "../../assessments/components/AssessmentList";
import type {
  Course,
  Module,
  CourseFormData,
  Assessment,
} from "../../../types";

interface CourseFormProps {
  type: "create" | "edit";
  course?: Course;
  assessments?: Assessment[];
  onEditAssessment?: (assessment: Assessment) => void;
  onDeleteAssessment?: (assessment: Assessment) => void;
  onSave: (course: CourseFormData) => void;
  onCancel?: () => void;
}

// ---------------- COMPONENT ----------------
export function CourseForm({
  type,
  course,
  assessments,
  onEditAssessment,
  onDeleteAssessment,
  onSave,
  onCancel,
}: CourseFormProps) {
  const defaultModules: Module[] = [
    {
      id: Date.now(),
      title: "Module 1: Introduction",
      lessons: [
        {
          id: Date.now() + 1,
          title: "Welcome & Overview",
          video: null,
        },
      ],
    },
  ];

  const [courseData, setCourseData] = useState<CourseFormData>({
    title: course?.title || "",
    description: course?.description || "",
    category: course?.category || "",
    difficulty: course?.difficulty || "",
    thumbnail: null,
    thumbnailPreview: course?.thumbnail || "",
    modules: course?.modules ?? defaultModules,
  });

  // ---------------- CLEANUP (thumbnail URL) ----------------
  useEffect(() => {
    return () => {
      if (courseData.thumbnailPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(courseData.thumbnailPreview);
      }
    };
  }, [courseData.thumbnailPreview]);

  // ---------------- COURSE UPDATE ----------------
  const updateCourse = <K extends keyof CourseFormData>(
    key: K,
    value: CourseFormData[K],
  ) => {
    setCourseData((prev) => ({ ...prev, [key]: value }));
  };

  // ---------------- MODULE ----------------
  const addModule = () => {
    setCourseData((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          id: Date.now() + Math.random(),
          title: `Module ${prev.modules.length + 1}`,
          lessons: [],
        },
      ],
    }));
  };

  const updateModule = (id: number, value: string) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === id ? { ...m, title: value } : m,
      ),
    }));
  };

  const deleteModule = (id: number) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.filter((m) => m.id !== id),
    }));
  };

  // ---------------- LESSON ----------------
  const addLesson = (moduleId: number) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId ?
          {
            ...m,
            lessons: [
              ...m.lessons,
              {
                id: Date.now() + Math.random(),
                title: "",
                video: null,
              },
            ],
          }
        : m,
      ),
    }));
  };

  const updateLesson = (moduleId: number, lessonId: number, value: string) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId ?
          {
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === lessonId ? { ...l, title: value } : l,
            ),
          }
        : m,
      ),
    }));
  };

  const deleteLesson = (moduleId: number, lessonId: number) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId ?
          {
            ...m,
            lessons: m.lessons.filter((l) => l.id !== lessonId),
          }
        : m,
      ),
    }));
  };

  const uploadLessonVideo = (
    moduleId: number,
    lessonId: number,
    file: File,
  ) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId ?
          {
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === lessonId ? { ...l, video: file } : l,
            ),
          }
        : m,
      ),
    }));
  };

  // ---------------- THUMBNAIL ----------------
  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      updateCourse("thumbnail", file);
      updateCourse("thumbnailPreview", URL.createObjectURL(file));
    }
  };

  // ---------------- SAVE ----------------
  const handleSave = () => {
    if (!courseData.title.trim()) {
      alert("Course title is required");
      return;
    }
    onSave(courseData);
  };

  // ---------------- UI ----------------
  return (
    <section className="space-y-6 max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold">
            {type === "edit" ? "Edit Course" : "Create Course"}
          </h1>
          <p className="text-[12px] text-ink-500">
            {type === "edit" ?
              "Update your course content"
            : "Create a new course with modules, lessons, and assignments"}
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {" "}
            {type === "edit" ? "Save Changes" : "Create Course"}
          </Button>
        </div>
      </div>

      {/* BASIC INFO */}
      <Card className="space-y-4">
        <h2 className="font-medium">Basic Information</h2>

        <Input
          label="Course Title"
          value={courseData.title}
          onChange={(e) => updateCourse("title", e.target.value)}
          placeholder="e.g. Advanced React Patterns"
        />

        <label className="text-xs font-medium text-ink-900">
          Description
          <textarea
            value={courseData.description}
            onChange={(e) => updateCourse("description", e.target.value)}
            className="w-full mt-1 border rounded-lg p-3 border border-line-200 bg-gray-50 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            rows={4}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Category"
            value={courseData.category}
            onChange={(e) => updateCourse("category", e.target.value)}
          />
          <Input
            label="Difficulty"
            value={courseData.difficulty}
            onChange={(e) => updateCourse("difficulty", e.target.value)}
          />
        </div>
      </Card>

      {/* THUMBNAIL */}
      <Card className="space-y-4">
        <h2 className="font-medium">Thumbnail</h2>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-line-200 rounded-lg p-6 cursor-pointer text-sm text-ink-500">
          <input type="file" className="hidden" onChange={handleThumbnail} />

          {courseData.thumbnailPreview ?
            <img
              src={courseData.thumbnailPreview}
              className="h-32 object-cover rounded-lg"
            />
          : <>
              <Upload size={20} />
              <span>Click to upload thumbnail</span>
            </>
          }
        </label>
      </Card>

      {/* MODULES */}
      <Card className="space-y-4">
        <div className="flex justify-between">
          <h2 className="font-medium">Modules & Lessons</h2>
          <Button onClick={addModule}>
            <Plus size={14} /> Add Module
          </Button>
        </div>

        {courseData.modules.map((module) => (
          <div
            key={module.id}
            className="border rounded-lg p-4 space-y-3 border-gray-200"
          >
            <div className="flex justify-between items-center">
              <Input
                value={module.title}
                onChange={(e) => updateModule(module.id, e.target.value)}
              />
              <button
                onClick={() => deleteModule(module.id)}
                className="text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {module.lessons.map((lesson) => (
              <div key={lesson.id} className="flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                  <input
                    value={lesson.title}
                    onChange={(e) =>
                      updateLesson(module.id, lesson.id, e.target.value)
                    }
                    className="flex-1 border rounded-lg p-2 border border-line-200 bg-gray-50 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    placeholder="Lesson title"
                  />

                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        uploadLessonVideo(
                          module.id,
                          lesson.id,
                          e.target.files[0],
                        );
                      }
                    }}
                  />

                  <button
                    onClick={() => deleteLesson(module.id, lesson.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {lesson.video && (
                  <span className="text-xs">{lesson.video.name}</span>
                )}
              </div>
            ))}

            <button
              onClick={() => addLesson(module.id)}
              className="text-sm text-brand-500 flex items-center gap-1"
            >
              <Plus size={14} /> Add Lesson
            </button>
          </div>
        ))}
      </Card>

      {/* ASSESSMENTS */}
      {type === "edit" && assessments && (
        <Card className="space-y-4">
          <h2 className="font-medium">Assessments</h2>
          <AssessmentList
            assessments={assessments}
            onEdit={onEditAssessment}
            onDelete={onDeleteAssessment}
          />
        </Card>
      )}
    </section>
  );
}

export function EditCourseForm(props: Omit<CourseFormProps, "type">) {
  return <CourseForm type="edit" {...props} />;
}

export function CreateCourseForm(props: Omit<CourseFormProps, "type">) {
  return <CourseForm type="create" {...props} />;
}
