import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Plus, Trash2 } from "lucide-react";

export function CreateAssessmentPage() {
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      explanation: "",
      points: 10,
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
      },
    ]);
  };

  const deleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: number, key: string, value: any) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [key]: value } : q)),
    );
  };

  const updateOption = (qId: number, index: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId ?
          {
            ...q,
            options: q.options.map((opt, i) => (i === index ? value : opt)),
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
          <h1 className="text-2xl font-semibold">Create Assessment</h1>
          <p className="text-sm text-ink-500">
            Design quizzes and exams for your courses
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary">Save Draft</Button>
          <Button>Publish</Button>
        </div>
      </div>

      {/* SETTINGS */}
      <Card className="space-y-4">
        <h2 className="font-medium">Assessment Settings</h2>

        <Input label="Assessment Title" placeholder="React Quiz" />

        <label className="text-sm">
          Description
          <textarea className="w-full mt-1 border rounded-lg p-3" />
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
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Question {index + 1}</h3>

            <button
              onClick={() => deleteQuestion(q.id)}
              className="text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <Input
            label="Points"
            value={q.points}
            onChange={(e) => updateQuestion(q.id, "points", e.target.value)}
          />

          <label className="text-sm">
            Question Text
            <textarea
              value={q.question}
              onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
              className="w-full mt-1 border rounded-lg p-3"
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
                  className="flex-1 border rounded-lg px-3 py-2"
                  placeholder={`Option ${i + 1}`}
                />
              </div>
            ))}
          </div>

          <label className="text-sm">
            Explanation
            <textarea
              value={q.explanation}
              onChange={(e) =>
                updateQuestion(q.id, "explanation", e.target.value)
              }
              className="w-full mt-1 border rounded-lg p-3"
            />
          </label>
        </Card>
      ))}

      {/* ADD QUESTION */}
      <div className="flex justify-center">
        <Button onClick={addQuestion}>
          <Plus size={16} /> Add Question
        </Button>
      </div>
    </section>
  );
}
