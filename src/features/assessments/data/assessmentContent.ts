export interface AssessmentQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
}

export const assessmentQuestions: Record<string, AssessmentQuestion[]> = {
  "a-201": [
    {
      id: "q-1",
      prompt: "What is the main benefit of component composition in React?",
      options: [
        "It removes the need for props",
        "It helps build reusable UI from smaller parts",
        "It replaces state management entirely",
        "It makes CSS unnecessary",
      ],
      correctAnswer: "It helps build reusable UI from smaller parts",
    },
    {
      id: "q-2",
      prompt: "Which hook is used for side effects?",
      options: ["useState", "useRef", "useEffect", "useMemo"],
      correctAnswer: "useEffect",
    },
    {
      id: "q-3",
      prompt: "Which prop is commonly used to help React identify list items?",
      options: ["index", "name", "key", "value"],
      correctAnswer: "key",
    },
    {
      id: "q-4",
      prompt:
        "Which hook is best for storing a local value that changes over time?",
      options: ["useId", "useState", "useRef", "useContext"],
      correctAnswer: "useState",
    },
    {
      id: "q-5",
      prompt: "What does lifting state up help with?",
      options: [
        "Sharing data between related components",
        "Removing all props",
        "Avoiding JSX",
        "Styling buttons faster",
      ],
      correctAnswer: "Sharing data between related components",
    },
    {
      id: "q-6",
      prompt:
        "Which file pattern is commonly used for reusable React components?",
      options: [
        "Single-purpose component files",
        "Only JSON files",
        "Only CSS files",
        "Only README files",
      ],
      correctAnswer: "Single-purpose component files",
    },
    {
      id: "q-7",
      prompt: "Why are props useful in React?",
      options: [
        "They pass data into components",
        "They replace routing",
        "They only style the UI",
        "They remove the need for state",
      ],
      correctAnswer: "They pass data into components",
    },
    {
      id: "q-8",
      prompt: "Which statement about JSX is correct?",
      options: [
        "JSX lets you write UI markup inside JavaScript",
        "JSX is required for CSS",
        "JSX disables components",
        "JSX only works in HTML files",
      ],
      correctAnswer: "JSX lets you write UI markup inside JavaScript",
    },
    {
      id: "q-9",
      prompt: "What is a common reason to split a UI into smaller components?",
      options: [
        "Better reuse and easier maintenance",
        "To avoid all imports",
        "To remove event handlers",
        "To stop rendering",
      ],
      correctAnswer: "Better reuse and easier maintenance",
    },
    {
      id: "q-10",
      prompt: "Which React pattern helps render lists efficiently and clearly?",
      options: [
        "Mapping arrays into components with keys",
        "Writing every item manually",
        "Using random values as IDs every render",
        "Avoiding arrays in UI code",
      ],
      correctAnswer: "Mapping arrays into components with keys",
    },
  ],
  "a-202": [
    {
      id: "q-1",
      prompt: "What improves keyboard accessibility most directly?",
      options: [
        "Using only div elements",
        "Removing focus styles",
        "Ensuring interactive elements are reachable by tab",
        "Adding more colors to the layout",
      ],
      correctAnswer: "Ensuring interactive elements are reachable by tab",
    },
    {
      id: "q-2",
      prompt: "What should every meaningful form field have?",
      options: ["A hover state", "A label", "An icon", "A border radius"],
      correctAnswer: "A label",
    },
    {
      id: "q-3",
      prompt: "Which contrast level is easier to read?",
      options: [
        "Low contrast text",
        "Text that blends into the background",
        "High contrast text",
        "Transparent text",
      ],
      correctAnswer: "High contrast text",
    },
    {
      id: "q-4",
      prompt: "What should happen when a modal opens?",
      options: [
        "Focus should move into the modal",
        "Focus should disappear",
        "The keyboard should stop working",
        "The page should refresh",
      ],
      correctAnswer: "Focus should move into the modal",
    },
    {
      id: "q-5",
      prompt: "Why are visible focus states important?",
      options: [
        "They help keyboard users know where they are",
        "They are only decorative",
        "They replace labels",
        "They are useful only on mobile",
      ],
      correctAnswer: "They help keyboard users know where they are",
    },
    {
      id: "q-6",
      prompt: "What is the purpose of alt text on informative images?",
      options: [
        "To describe the image for assistive technologies",
        "To increase border size",
        "To replace headings",
        "To hide images from users",
      ],
      correctAnswer: "To describe the image for assistive technologies",
    },
    {
      id: "q-7",
      prompt: "Which button label is most accessible?",
      options: ["Click here", "Submit assignment", "Open", "More"],
      correctAnswer: "Submit assignment",
    },
    {
      id: "q-8",
      prompt: "What improves readability in long forms?",
      options: [
        "Clear grouping and spacing",
        "Removing headings",
        "Using tiny fonts",
        "Hiding instructions",
      ],
      correctAnswer: "Clear grouping and spacing",
    },
    {
      id: "q-9",
      prompt: "When should error text appear for a field?",
      options: [
        "When validation fails and the user needs guidance",
        "Only on page load",
        "Never",
        "Only after logout",
      ],
      correctAnswer: "When validation fails and the user needs guidance",
    },
    {
      id: "q-10",
      prompt: "What is the best use of semantic HTML?",
      options: [
        "To give structure and meaning to content",
        "To avoid accessibility rules",
        "To replace all CSS",
        "To hide buttons",
      ],
      correctAnswer: "To give structure and meaning to content",
    },
  ],
  "a-203": [
    {
      id: "q-1",
      prompt: "What makes a chart easier to understand quickly?",
      options: [
        "Decorative effects only",
        "Clear labels and a focused message",
        "Too many colors",
        "Missing legends",
      ],
      correctAnswer: "Clear labels and a focused message",
    },
    {
      id: "q-2",
      prompt: "Which chart is often best for showing trends over time?",
      options: ["Pie chart", "Line chart", "Scatter icon", "Table only"],
      correctAnswer: "Line chart",
    },
    {
      id: "q-3",
      prompt: "What should a data story highlight first?",
      options: [
        "Every possible metric",
        "The most important takeaway",
        "Only technical jargon",
        "Random ordering",
      ],
      correctAnswer: "The most important takeaway",
    },
    {
      id: "q-4",
      prompt: "Which chart is usually best for comparing categories?",
      options: ["Bar chart", "Line chart", "Area blur", "Icon set only"],
      correctAnswer: "Bar chart",
    },
    {
      id: "q-5",
      prompt: "Why should chart titles be specific?",
      options: [
        "They help viewers understand the message quickly",
        "They replace the data source",
        "They remove the need for labels",
        "They are only for decoration",
      ],
      correctAnswer: "They help viewers understand the message quickly",
    },
    {
      id: "q-6",
      prompt: "What should be reduced in a clear dashboard?",
      options: [
        "Visual clutter",
        "Relevant insights",
        "Readable labels",
        "Data accuracy",
      ],
      correctAnswer: "Visual clutter",
    },
    {
      id: "q-7",
      prompt: "What helps viewers compare two values most easily?",
      options: [
        "Consistent scales",
        "Random axes",
        "Different measurement units without labels",
        "Decorative backgrounds",
      ],
      correctAnswer: "Consistent scales",
    },
    {
      id: "q-8",
      prompt: "When is annotation helpful in a chart?",
      options: [
        "When you need to call out an important point",
        "Only when there is no data",
        "To hide outliers",
        "To replace axis labels",
      ],
      correctAnswer: "When you need to call out an important point",
    },
    {
      id: "q-9",
      prompt: "What is a strong data-storytelling practice?",
      options: [
        "Ordering content from insight to support",
        "Showing all metrics equally",
        "Avoiding context",
        "Using unclear legends",
      ],
      correctAnswer: "Ordering content from insight to support",
    },
    {
      id: "q-10",
      prompt: "Which choice improves trust in a visualization?",
      options: [
        "Showing the source and labeling units clearly",
        "Hiding methodology",
        "Stretching axes without note",
        "Removing legends and notes",
      ],
      correctAnswer: "Showing the source and labeling units clearly",
    },
  ],
};

export function getAssessmentQuestionCount(assessmentId: string) {
  return assessmentQuestions[assessmentId]?.length ?? 0;
}
