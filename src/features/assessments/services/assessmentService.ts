import type { Assessment } from "../../../types";
import { mockApi } from "../../../services/mockApi";

const assessments: Assessment[] = [
  {
    id: "a-201",
    title: "Component Architecture Quiz",
    course: "React Architecture at Scale",
    dueDate: "Apr 18, 2026",
    description:
      "Test your knowledge of components, props, and reusable UI architecture.",
    timeLimit: "15 min",
    score: 92,
    submissions: 148,
    status: "Open",
  },
  {
    id: "a-202",
    title: "Accessibility Heuristics Review",
    course: "Design Systems for Product Teams",
    dueDate: "Apr 21, 2026",
    description:
      "Review accessibility basics including focus, labels, contrast, and semantics.",
    timeLimit: "15 min",
    submissions: 132,
    status: "Upcoming",
  },
  {
    id: "a-202",
    title: "Accessibility Heuristics Review",
    course: "Design Systems for Product Teams",
    dueDate: "Apr 21, 2026",
    submissions: 132,
    status: "Upcoming",
  },
  {
    id: "a-202",
    title: "Accessibility Heuristics Review",
    course: "Design Systems for Product Teams",
    dueDate: "Apr 21, 2026",
    submissions: 132,
    status: "Upcoming",
  },
  {
    id: "a-202",
    title: "Accessibility Heuristics Review",
    course: "Design Systems for Product Teams",
    dueDate: "Apr 21, 2026",
    submissions: 132,
    status: "Upcoming",
  },
  {
    id: "a-202",
    title: "Accessibility Heuristics Review",
    course: "Design Systems for Product Teams",
    dueDate: "Apr 21, 2026",
    submissions: 132,
    status: "Upcoming",
  },
  {
    id: "a-202",
    title: "Accessibility Heuristics Review",
    course: "Design Systems for Product Teams",
    dueDate: "Apr 21, 2026",
    submissions: 132,
    status: "Upcoming",
  },
  {
    id: "a-202",
    title: "Accessibility Heuristics Review",
    course: "Design Systems for Product Teams",
    dueDate: "Apr 21, 2026",
    submissions: 132,
    status: "Upcoming",
  },
  {
    id: "a-202",
    title: "Accessibility Heuristics Review",
    course: "Design Systems for Product Teams",
    dueDate: "Apr 21, 2026",
    submissions: 132,
    status: "Upcoming",
  },
  {
    id: "a-202",
    title: "Accessibility Heuristics Review",
    course: "Design Systems for Product Teams",
    dueDate: "Apr 21, 2026",
    submissions: 132,
    status: "Upcoming",
  },
  {
    id: "a-203",
    title: "Data Storytelling Assignment",
    course: "Data Visualization Essentials",
    dueDate: "Apr 10, 2026",
    description:
      "Practice reading charts, spotting patterns, and communicating the right takeaway.",
    timeLimit: "15 min",
    score: 88,
    submissions: 96,
    status: "Closed",
  },
];

export const assessmentService = {
  async getAssessments() {
    return mockApi(assessments);
  },
};
