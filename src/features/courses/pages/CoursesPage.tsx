import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { CourseGridSkeleton } from "../../../components/skeletons/CourseGridSkeleton";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { CourseGrid } from "../components/CourseGrid";
import { useCourses } from "../hooks/useCourses";

const categories = [
  "All Categories",
  "Design",
  "Development",
  "Data Science",
  "Cloud",
  "Marketing",
];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export function CoursesPage() {
  const { courses, isLoading } = useCourses("student");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [level, setLevel] = useState(levels[0]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        `${course.title} ${course.instructor} ${course.category}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesCategory =
        category === categories[0] || course.category === category;
      const matchesLevel = level === levels[0] || course.level === level;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [category, courses, level, search]);

  return (
    <section className="space-y-5 h-full flex flex-col">
      <div>
        <h1 className="font-display text-[20px] font-medium tracking-tight text-ink-950">
          Courses
        </h1>
        <p className="mt-1 max-w-2xl text-[12px] text-ink-500">
          Browse the full catalog with the same compact card layout used
          throughout your dashboard.
        </p>
      </div>

      <div className="rounded-2xl border border-line-100 bg-white p-3 shadow-[0_10px_24px_rgba(15,23,42,0.035)]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-line-100 bg-soft px-3 py-2 text-ink-500">
            <Search size={15} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full border-none bg-transparent text-[12px] outline-none placeholder:text-ink-500"
              placeholder="Search courses, instructors, or categories"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border-line-100 bg-white px-3 py-2 text-[12px] text-ink-700"
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="rounded-xl border-line-100 bg-white px-3 py-2 text-[12px] text-ink-700"
            >
              {levels.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Button variant="secondary" className="gap-2 px-3 py-2 text-[12px]">
              <SlidersHorizontal size={14} />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <CourseGridSkeleton count={6} columns="wide" />
      ) : (
        <CourseGrid
          courses={filteredCourses}
          columns="wide"
          variant="catalog"
          emptyTitle="No matching courses"
          emptyDescription="Try another keyword or broaden the filters to explore more of the catalog."
        />
      )}
    </section>
  );
}
