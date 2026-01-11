import type { QuizQuestion, ValidationResult } from "../types/quiz";

export function validateQuizJSON(jsonString: string): ValidationResult {
  let parsedData: unknown;
  try {
    parsedData = JSON.parse(jsonString);
  } catch (error) {
    return {
      isValid: false,
      message: `Invalid JSON format: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }

  if (!Array.isArray(parsedData)) {
    return {
      isValid: false,
      message: "Invalid format: Root element must be an array of questions",
    };
  }

  if (parsedData.length === 0) {
    return {
      isValid: false,
      message: "Invalid format: Question array cannot be empty",
    };
  }

  const questions: QuizQuestion[] = [];

  for (let i = 0; i < parsedData.length; i++) {
    const question = parsedData[i];

    if (typeof question !== "object" || question === null) {
      return {
        isValid: false,
        message: `Invalid format: Question ${i + 1} must be an object`,
        questionIndex: i,
      };
    }

    if (!("id" in question) || typeof question.id !== "number") {
      return {
        isValid: false,
        message: `Invalid format: Question ${
          i + 1
        } missing or invalid 'id' (must be a number)`,
        questionIndex: i,
        fieldName: "id",
      };
    }

    if (
      !("question" in question) ||
      typeof question.question !== "string" ||
      question.question.trim() === ""
    ) {
      return {
        isValid: false,
        message: `Invalid format: Question ${
          i + 1
        } missing or invalid 'question' (must be non-empty string)`,
        questionIndex: i,
        fieldName: "question",
      };
    }

    if (!("options" in question) || !Array.isArray(question.options)) {
      return {
        isValid: false,
        message: `Invalid format: Question ${
          i + 1
        } missing or invalid 'options' (must be an array)`,
        questionIndex: i,
        fieldName: "options",
      };
    }

    if (question.options.length === 0) {
      return {
        isValid: false,
        message: `Invalid format: Question ${
          i + 1
        } options array cannot be empty`,
        questionIndex: i,
        fieldName: "options",
      };
    }

    const options = question.options;
    let correctCount = 0;

    for (let j = 0; j < options.length; j++) {
      const option = options[j];

      if (typeof option !== "object" || option === null) {
        return {
          isValid: false,
          message: `Invalid format: Question ${i + 1}, Option ${
            j + 1
          } must be an object`,
          questionIndex: i,
        };
      }

      if (
        !("id" in option) ||
        typeof option.id !== "string" ||
        option.id.trim() === ""
      ) {
        return {
          isValid: false,
          message: `Invalid format: Question ${i + 1}, Option ${
            j + 1
          } missing or invalid 'id' (must be non-empty string)`,
          questionIndex: i,
          fieldName: "options[].id",
        };
      }

      if (
        !("text" in option) ||
        typeof option.text !== "string" ||
        option.text.trim() === ""
      ) {
        return {
          isValid: false,
          message: `Invalid format: Question ${i + 1}, Option ${
            j + 1
          } missing or invalid 'text' (must be non-empty string)`,
          questionIndex: i,
          fieldName: "options[].text",
        };
      }

      if (!("isCorrect" in option) || typeof option.isCorrect !== "boolean") {
        return {
          isValid: false,
          message: `Invalid format: Question ${i + 1}, Option ${
            j + 1
          } missing or invalid 'isCorrect' (must be boolean)`,
          questionIndex: i,
          fieldName: "isCorrect",
        };
      }

      if (option.isCorrect) {
        correctCount++;
      }
    }

    if (correctCount === 0) {
      return {
        isValid: false,
        message: `Invalid format: Question ${
          i + 1
        } must have at least one correct answer`,
        questionIndex: i,
        fieldName: "isCorrect",
      };
    }

    questions.push({
      id: question.id,
      question: question.question,
      options: question.options.map(
        (opt: { id: string; text: string; isCorrect: boolean }) => ({
          id: opt.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })
      ),
    });
  }

  return {
    isValid: true,
    data: questions,
  };
}
