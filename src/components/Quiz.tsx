import { useState, useEffect } from "react";
import type {
  QuizQuestion as QuizQuestionType,
  QuizPhase,
} from "../types/quiz";
import { QuizSetup } from "./QuizSetup";
import { QuestionCard } from "./QuizQuestion";
import { QuizComplete } from "./QuizComplete";
import { ModeToggle } from "./ModeToggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { saveToHistory } from "../lib/history";

function getSavedState() {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("quizState");
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (!parsed.questions || parsed.questions.length === 0) return null;
    return parsed;
  } catch (e) {
    console.error("Failed to load quiz state:", e);
    return null;
  }
}

export function Quiz() {
  const [phase, setPhase] = useState<QuizPhase>(
    () => getSavedState()?.phase || "setup"
  );
  const [questions, setQuestions] = useState<QuizQuestionType[]>(
    () => getSavedState()?.questions || []
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    () => getSavedState()?.currentQuestionIndex || 0
  );
  const [results, setResults] = useState<boolean[]>(
    () => getSavedState()?.results || []
  );
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>(
    () => getSavedState()?.userAnswers || {}
  );

  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(
        "quizState",
        JSON.stringify({
          phase,
          questions,
          currentQuestionIndex,
          results,
          userAnswers,
        })
      );
    }
  }, [phase, questions, currentQuestionIndex, results, userAnswers]);

  const handleQuizStart = (loadedQuestions: QuizQuestionType[]) => {
    localStorage.removeItem("quizState");
    saveToHistory(loadedQuestions);
    setQuestions(loadedQuestions);
    setCurrentQuestionIndex(0);
    setResults([]);
    setUserAnswers({});
    setPhase("quiz");
  };

  const handleAnswerComplete = (isCorrect: boolean, optionId: string) => {
    setResults((prev) => {
      const newResults = [...prev];
      newResults[currentQuestionIndex] = isCorrect;
      return newResults;
    });

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionId,
    }));

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setPhase("complete");
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
    setPhase("quiz");
  };

  const handleQuizEnd = () => {
    setPhase("complete");
  };

  const handleRestart = () => {
    localStorage.removeItem("quizState");
    setPhase("setup");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setResults([]);
    setUserAnswers({});
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <header className="flex items-center justify-between p-4 border-b shrink-0">
        <div className="flex items-center gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" onClick={handleRestart}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage
                  className={
                    phase === "setup" ? "font-bold" : "text-muted-foreground"
                  }
                >
                  Setup
                </BreadcrumbPage>
              </BreadcrumbItem>
              {(phase === "quiz" || phase === "complete") && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage
                      className={
                        phase === "quiz" ? "font-bold" : "text-muted-foreground"
                      }
                    >
                      Quiz
                      {phase === "quiz" &&
                        ` (${currentQuestionIndex + 1}/${questions.length})`}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
              {phase === "complete" && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-bold">
                      Results
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ModeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
        {phase === "setup" && <QuizSetup onQuizStart={handleQuizStart} />}
        {phase === "quiz" && (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            results={results}
            initialSelectedOptionId={userAnswers[currentQuestionIndex]}
            onAnswerComplete={handleAnswerComplete}
            onQuizEnd={handleQuizEnd}
            onQuestionSelect={handleQuestionSelect}
          />
        )}
        {phase === "complete" && (
          <QuizComplete
            totalQuestions={questions.length}
            questionsAnswered={results.filter((r) => r !== undefined).length}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
