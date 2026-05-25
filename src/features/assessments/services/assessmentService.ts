import type { AxiosError } from "axios";
import { apiClient } from "../../../services/apiClient";
import { API_ENDPOINT_ASSESSMENT } from "../../../services/apiTypes";
import type { Assessment, AssessmentResult, Question } from "../../../types";

export interface AssessmentFormData {
  title: string;
  description: string;
  course: string;
  timeLimit: string;
  passingScore: string;
  maxAttempts?: string;
  questions: Question[];
}

interface ApiQuestion {
  _id?: string;
  point: number;
  question: string;
  options: string[];
  explanation: string;
  correctAnswer: number;
}

interface ApiAssessment {
  _id: string;
  title: string;
  description?: string;
  courseId?: string;
  course?: string;
  questions?: ApiQuestion[];
  timeLimit?: number;
  totalMarks?: number;
  passingScore?: number;
  maxAttempt?: number;
  createdAt?: string;
}

interface CreateAssessmentPayload {
  title: string;
  description: string;
  courseId: string;
  questions: ApiQuestion[];
  timeLimit: number;
  passingScore: number;
}

interface AssessmentMutationResponse {
  success: boolean;
  message: string;
  assessment: ApiAssessment;
}

interface SubmitAssessmentPayload {
  answers: number[];
}

interface AssessmentResultResponse {
  success: boolean;
  result: AssessmentResult;
}

type AssessmentsApiResponse =
  | ApiAssessment[]
  | {
      assessment?: ApiAssessment[];
      assessments?: ApiAssessment[];
      data?: ApiAssessment[];
    };

function extractErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>;
  return (
    axiosError.response?.data?.message ??
    axiosError.response?.data?.error ??
    fallback
  );
}

function normalizeAssessments(response: AssessmentsApiResponse) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.assessment ?? response.assessments ?? response.data ?? [];
}

function mapApiAssessment(assessment: ApiAssessment): Assessment {
  return {
    id: assessment._id,
    title: assessment.title,
    description: assessment.description,
    course: assessment.course ?? assessment.courseId ?? "",
    courseId: assessment.courseId,
    createdAt: assessment.createdAt
      ? new Date(assessment.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",
    submissions: 0,
    status: "Open",
    timeLimit:
      assessment.timeLimit !== undefined ? `${assessment.timeLimit} min` : "",
    totalMarks:
      assessment.totalMarks !== undefined ? String(assessment.totalMarks) : "",
    passingScore:
      assessment.passingScore !== undefined
        ? String(assessment.passingScore)
        : "",
    maxAttempts:
      assessment.maxAttempt !== undefined ? String(assessment.maxAttempt) : "",
    questions: assessment.questions?.map((question, index) => ({
      id: index + 1,
      question: question.question,
      options: question.options,
      correctIndex: question.correctAnswer,
      explanation: question.explanation,
      points: question.point,
      isOpen: false,
    })),
  };
}

function toNumber(value: string, fallback: number) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function buildCreateAssessmentPayload(
  assessment: AssessmentFormData,
): CreateAssessmentPayload {
  return {
    title: assessment.title,
    description: assessment.description,
    courseId: assessment.course,
    questions: assessment.questions.map((question) => ({
      point: Number(question.points) || 0,
      question: question.question,
      options: question.options,
      explanation: question.explanation,
      correctAnswer: question.correctIndex,
    })),
    timeLimit: toNumber(assessment.timeLimit, 0),
    passingScore: toNumber(assessment.passingScore, 0),
  };
}

function buildUpdateAssessmentPayload(assessment: AssessmentFormData) {
  return {
    title: assessment.title,
    description: assessment.description,
    passingScore: toNumber(assessment.passingScore, 0),
    questions: assessment.questions.map((question) => ({
      point: Number(question.points) || 0,
      question: question.question,
      options: question.options,
      explanation: question.explanation,
      correctAnswer: question.correctIndex,
    })),
  };
}

export const assessmentService = {
  async getAssessments(courseId?: string) {
    try {
      const endpoint = courseId
        ? `${API_ENDPOINT_ASSESSMENT}/${courseId}`
        : API_ENDPOINT_ASSESSMENT;

      const response = await apiClient.get<AssessmentsApiResponse>(endpoint);
      return normalizeAssessments(response.data).map(mapApiAssessment);
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Failed to load assessments."),
      );
    }
  },

  async createAssessment(assessment: AssessmentFormData) {
    try {
      const response = await apiClient.post<AssessmentMutationResponse>(
        API_ENDPOINT_ASSESSMENT,
        buildCreateAssessmentPayload(assessment),
      );

      return {
        assessment: mapApiAssessment(response.data.assessment),
        message: response.data.message,
      };
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Failed to create assessment."),
      );
    }
  },

  async updateAssessment(assessmentId: string, assessment: AssessmentFormData) {
    try {
      const response = await apiClient.put<AssessmentMutationResponse>(
        `${API_ENDPOINT_ASSESSMENT}/${assessmentId}`,
        buildUpdateAssessmentPayload(assessment),
      );

      return {
        assessment: mapApiAssessment(response.data.assessment),
        message: response.data.message,
      };
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Failed to update assessment."),
      );
    }
  },

  async deleteAssessment(assessmentId: string) {
    try {
      await apiClient.delete(`${API_ENDPOINT_ASSESSMENT}/${assessmentId}`);
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Failed to delete assessment."),
      );
    }
  },

  async submitAssessment(assessmentId: string, answers: number[]) {
    try {
      const response = await apiClient.post<AssessmentResultResponse>(
        `${API_ENDPOINT_ASSESSMENT}/${assessmentId}/submit`,
        { answers } satisfies SubmitAssessmentPayload,
      );

      return response.data.result;
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Failed to submit assessment."),
      );
    }
  },

  async getAssessmentResult(assessmentId: string) {
    try {
      const response = await apiClient.get<AssessmentResultResponse>(
        `${API_ENDPOINT_ASSESSMENT}/${assessmentId}/result`,
      );

      return response.data.result;
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Failed to load assessment result."),
      );
    }
  },
};
