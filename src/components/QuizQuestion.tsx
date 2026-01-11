import { useState, useEffect } from "react";
import type { QuizQuestion, QuestionPhase } from "../types/quiz";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  results: boolean[];
  initialSelectedOptionId?: string;
  onAnswerComplete: (isCorrect: boolean, optionId: string) => void;
  onQuizEnd: () => void;
  onQuestionSelect: (index: number) => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  results,
  initialSelectedOptionId,
  onAnswerComplete,
  onQuizEnd,
  onQuestionSelect,
}: QuestionCardProps) {
  const [phase, setPhase] = useState<QuestionPhase>("active");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  useEffect(() => {
    const resetState = () => {
      if (initialSelectedOptionId) {
        setSelectedOptionId(initialSelectedOptionId);
        setPhase("feedback");
      } else {
        setPhase("active");
        setSelectedOptionId(null);
      }
    };
    resetState();
  }, [question.id, initialSelectedOptionId]);

  const selectedOption = question.options.find(
    (opt) => opt.id === selectedOptionId
  );
  const isCorrect = selectedOptionId
    ? (selectedOption?.isCorrect ?? false)
    : false;

  const handleOptionClick = (optionId: string) => {
    if (phase !== "active") return;
    setSelectedOptionId(optionId);
    setPhase("selection");

    setTimeout(() => {
      setPhase("locked");
      setPhase("evaluation");
      setPhase("feedback");
    }, 100);
  };

  const handleNextQuestion = () => {
    if (phase !== "feedback") return;

    setPhase("progression");
    setTimeout(() => onAnswerComplete(isCorrect, selectedOptionId!), 200);
  };

  return (
    <Card className="shadow-lg overflow-hidden flex flex-col h-fit w-full max-w-2xl">
      {/* Header with progress indicator */}
      <CardHeader className="bg-primary text-primary-foreground shrink-0">
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-2xl">
              Question {questionNumber}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              of {totalQuestions} questions
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            {/* Cell Progress Bar */}
            <div className="flex gap-0.5 h-3 w-32 sm:w-48">
              {Array.from({ length: totalQuestions }).map((_, i) => {
                const isCurrent = i === questionNumber - 1;
                const result = results[i];
                const isAnswered = result !== undefined;

                const isReachable = i <= results.length;

                let bgClass = "bg-primary-foreground/20";

                if (isCurrent) {
                  bgClass =
                    "bg-primary-foreground ring-2 ring-primary-foreground/50 z-10 scale-110";
                } else if (isAnswered) {
                  bgClass = result ? "bg-green-500" : "bg-destructive";
                }

                if (!isReachable) {
                  bgClass += " opacity-30 cursor-not-allowed";
                }

                let statusText = "Locked";
                if (isCurrent) statusText = "Current Question";
                else if (isAnswered)
                  statusText = result ? "Correct" : "Incorrect";
                else if (isReachable) statusText = "Not Attempted";

                return (
                  <TooltipProvider key={i}>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div
                          className={`h-full flex-1 rounded-[1px] transition-all ${
                            isReachable ? "cursor-pointer hover:opacity-80" : ""
                          } ${bgClass}`}
                          onClick={() => isReachable && onQuestionSelect(i)}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        <p className="font-semibold">Question {i + 1}</p>
                        <p className="text-muted-foreground">{statusText}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-7 text-xs px-3 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  Finish
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will end the quiz immediately. You won't be able to
                    answer the remaining questions.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onQuizEnd}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Finish Quiz
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 p-8">
        {/* Question */}
        <div className="mb-6 shrink-0">
          <h2 className="text-2xl font-bold text-foreground">
            {question.question}
          </h2>
        </div>

        <ScrollArea className="flex-1 rounded-md border bg-muted/20 min-h-[200px] max-h-[350px]">
          <div className="space-y-3 p-4">
            {question.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isLockedPhase =
                phase === "locked" ||
                phase === "evaluation" ||
                phase === "feedback" ||
                phase === "progression";

              const variant = "outline";
              let className = "";

              if (isLockedPhase) {
                if (isSelected && isCorrect) {
                  className =
                    "border-green-500 bg-green-500/10 text-green-500 hover:bg-green-500/20";
                } else if (isSelected && !isCorrect) {
                  className =
                    "border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20";
                } else if (option.isCorrect && !isSelected) {
                  if (!isCorrect && selectedOption) {
                    className =
                      "border-green-500 bg-green-500/10 text-green-500 hover:bg-green-500/20";
                  }
                }
              }

              const icon = isLockedPhase ? (
                isSelected && isCorrect ? (
                  <Check className="w-5 h-5" />
                ) : isSelected && !isCorrect ? (
                  <span className="text-lg font-bold">✕</span>
                ) : option.isCorrect &&
                  !isSelected &&
                  !isCorrect &&
                  selectedOption ? (
                  <Check className="w-5 h-5" />
                ) : null
              ) : null;

              return (
                <Button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  disabled={isLockedPhase}
                  variant={variant}
                  className={`w-full justify-start h-auto py-4 px-4 text-left font-medium cursor-pointer ${className}`}
                  aria-pressed={isSelected}
                  aria-disabled={isLockedPhase}
                >
                  <span className="inline-flex items-center gap-3 w-full">
                    <span className="text-xs font-semibold bg-muted text-muted-foreground rounded px-2 py-1">
                      {option.id.toUpperCase()}
                    </span>
                    <span className="flex-1">{option.text}</span>
                    {icon && <span className="shrink-0">{icon}</span>}
                  </span>
                </Button>
              );
            })}
          </div>
        </ScrollArea>

        {phase === "feedback" && (
          <div className="mt-6 shrink-0">
            <Button
              onClick={handleNextQuestion}
              className="w-full cursor-pointer"
              size="lg"
              autoFocus
            >
              Continue →
            </Button>
          </div>
        )}

        {/* Disabled state message */}
        {phase === "active" && (
          <Alert className="mt-6 shrink-0">
            <AlertDescription>Select an answer to continue →</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
