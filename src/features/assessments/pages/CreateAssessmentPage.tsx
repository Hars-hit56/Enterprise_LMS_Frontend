import {
  ChevronDown,
  GrabIcon,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

export function CreateAssessmentPage() {
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      explanation: "",
      points: 10,
      isOpen: true,
    },
  ]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        question: "",
        options: ["", "", "", ""],
        correctIndex: 0,
        explanation: "",
        points: 10,
        isOpen: true,
      },
    ]);
  };

  const deleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const toggleQuestion = (id: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isOpen: !q.isOpen } : q)),
    );
  };

  const updateQuestion = (id: number, key: string, value: any) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [key]: value } : q)),
    );
  };

  const updateOption = (qId: number, index: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === index ? value : opt)),
            }
          : q,
      ),
    );
  };

  const deleteOption = (qId: number, index: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.filter((_, i) => i !== index),
              correctIndex:
                q.correctIndex > index ? q.correctIndex - 1 : q.correctIndex,
            }
          : q,
      ),
    );
  };

  const addOption = (qId: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: [...q.options, ""],
            }
          : q,
      ),
    );
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold">Create Assessment</h1>
          <p className="text-[12px] text-ink-500">
            Design quizzes and exams for your courses
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="!bg-transparent">
            Save Draft
          </Button>
          <Button>Publish</Button>
        </div>
      </div>

      {/* SETTINGS */}
      <Card className="space-y-4">
        <h2 className="font-medium">Assessment Settings</h2>

        <Input label="Assessment Title" placeholder="React Quiz" />

        <label className="text-xs font-medium text-ink-900">
          Description
          <textarea
            className="w-full mt-1 border rounded-lg p-3 border border-line-200 bg-gray-50 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 mb-4"
            placeholder="Describe what this assessments covers..."
            rows={4}
          />
        </label>

        <div className="grid grid-cols-4 gap-4">
          <Input label="Course" placeholder="Select" />
          <Input label="Time Limit" placeholder="30 min" />
          <Input label="Passing Score" placeholder="70%" />
          <Input label="Max Attempts" placeholder="Select" />
        </div>
      </Card>

      {/* QUESTIONS */}
      {questions.map((q, index) => (
        <Card key={q.id} className="space-y-4">
          {/* Header with collapse */}
          <div
            className="flex justify-between items-center"
            onClick={() => toggleQuestion(q.id)}
          >
            <div className="flex gap-2 align-middle ">
              <GripVertical width={16} className="" />
              <h3
                className="font-medium cursor-pointer"
                onClick={() => toggleQuestion(q.id)}
              >
                Question {index + 1}
              </h3>
            </div>

            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${
                q.isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>

          {/* Collapsible Content */}
          {q.isOpen && (
            <>
              <Input
                label="Points"
                value={q.points}
                onChange={(e) => updateQuestion(q.id, "points", e.target.value)}
              />

              <label className="text-xs font-medium text-ink-900">
                Question Text
                <textarea
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(q.id, "question", e.target.value)
                  }
                  className="w-full mt-1 border rounded-lg p-3 border border-line-200 bg-gray-50 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 mb-4"
                  placeholder="Enter your question..."
                  rows={4}
                />
              </label>

              {/* OPTIONS */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Options</p>

                {q.options.map((opt, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      checked={q.correctIndex === i}
                      onChange={() => updateQuestion(q.id, "correctIndex", i)}
                    />

                    <input
                      value={opt}
                      onChange={(e) => updateOption(q.id, i, e.target.value)}
                      className="flex-1 border rounded-lg p-3 border border-line-200 bg-gray-50 px-3.5 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                      placeholder={`Option ${i + 1}`}
                    />

                    <button
                      onClick={() => deleteOption(q.id, i)}
                      className="text-ink-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {/* Add Option Button */}
                {q.options.length < 4 && (
                  <button
                    onClick={() => addOption(q.id)}
                    className="text-sm text-brand-500 flex items-center gap-1 mt-2"
                  >
                    <Plus size={14} /> Add Option
                  </button>
                )}
              </div>

              <label className="text-xs font-medium text-ink-900">
                Explanation
                <textarea
                  value={q.explanation}
                  onChange={(e) =>
                    updateQuestion(q.id, "explanation", e.target.value)
                  }
                  className="w-full mt-1 border rounded-lg p-3 border border-line-200 bg-gray-50 px-3.5 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 mb-5"
                  placeholder="Explain the correct answer..."
                  rows={4}
                />
              </label>

              {/* Delete at Bottom */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => deleteQuestion(q.id)}
                  className="flex items-center gap-1 text-red-500 text-sm"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </Card>
      ))}

      {/* ADD QUESTION */}
      <div className="flex justify-center">
        <Button onClick={addQuestion} className="w-sm">
          <Plus size={16} /> Add Question
        </Button>
      </div>
    </section>
  );
}
