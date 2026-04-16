import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Plus, Trash2, Upload } from "lucide-react";

export function CreateCoursePage() {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    thumbnail: null as File | null,
    thumbnailPreview: "",
    modules: [
      {
        id: Date.now(),
        title: "Module 1: Introduction",
        lessons: [
          {
            id: Date.now() + 1,
            title: "Welcome & Overview",
            video: null as File | null,
          },
        ],
      },
    ],
  });

  // ---------------- COURSE UPDATE ----------------
  const updateCourse = (key: string, value: any) => {
    setCourse((prev) => ({ ...prev, [key]: value }));
  };

  // ---------------- MODULE ----------------
  const addModule = () => {
    setCourse((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          id: Date.now(),
          title: `Module ${prev.modules.length + 1}`,
          lessons: [],
        },
      ],
    }));
  };

  const updateModule = (id: number, value: string) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === id ? { ...m, title: value } : m,
      ),
    }));
  };

  const deleteModule = (id: number) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.filter((m) => m.id !== id),
    }));
  };

  // ---------------- LESSON ----------------
  const addLesson = (moduleId: number) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: [
                ...m.lessons,
                {
                  id: Date.now(),
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
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? {
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
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? {
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
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? {
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

  return (
    <section className="space-y-6 max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold">Create Course</h1>
          <p className="text-[12px] text-ink-500">Build your course content</p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="!bg-transparent">
            Save Draft
          </Button>
          <Button>Publish</Button>
        </div>
      </div>

      {/* BASIC INFO */}
      <Card className="space-y-4">
        <h2 className="font-medium">Basic Information</h2>

        <Input
          label="Course Title"
          value={course.title}
          onChange={(e) => updateCourse("title", e.target.value)}
          placeholder="e.g. Advanced React Patterns"
        />

        <label className="text-xs font-medium text-ink-900">
          Description
          <textarea
            value={course.description}
            onChange={(e) => updateCourse("description", e.target.value)}
            className="w-full mt-1 border rounded-lg p-3 border border-line-200 bg-gray-50 text-sm outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            placeholder="Describe your course..."
            rows={4}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Category"
            value={course.category}
            onChange={(e) => updateCourse("category", e.target.value)}
            placeholder="Select"
          />
          <Input
            label="Difficulty"
            value={course.difficulty}
            onChange={(e) => updateCourse("difficulty", e.target.value)}
            placeholder="Select"
          />
        </div>
      </Card>

      {/* THUMBNAIL */}
      <Card className="space-y-4">
        <h2 className="font-medium">Thumbnail</h2>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-line-200 rounded-lg p-6 cursor-pointer text-sm text-ink-500">
          <input type="file" className="hidden" onChange={handleThumbnail} />

          {course.thumbnailPreview ? (
            <img
              src={course.thumbnailPreview}
              alt="thumbnail"
              className="h-32 object-cover rounded-lg"
            />
          ) : (
            <>
              <Upload size={20} />
              <span>Click to upload thumbnail</span>
              <span className="text-xs">PNG, JPG up to 2MB</span>
            </>
          )}
        </label>
      </Card>

      {/* MODULES */}
      <Card className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Modules & Lessons</h2>
          <Button onClick={addModule} className="flex items-center gap-1">
            <Plus size={14} /> Add Module
          </Button>
        </div>

        {course.modules.map((module) => (
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

            {/* LESSONS */}
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

                  <label className="cursor-pointer text-ink-500">
                    <Upload size={14} />
                    <input
                      type="file"
                      className="hidden"
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
                  </label>

                  <button
                    onClick={() => deleteLesson(module.id, lesson.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {lesson.video && (
                  <span className="text-xs text-ink-500">
                    {lesson.video.name}
                  </span>
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
    </section>
  );
}
