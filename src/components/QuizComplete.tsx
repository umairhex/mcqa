import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

interface QuizCompleteProps {
  totalQuestions: number;
  questionsAnswered: number;
  onRestart: () => void;
}

export function QuizComplete({
  totalQuestions,
  questionsAnswered,
  onRestart,
}: QuizCompleteProps) {
  const isFullComplete = questionsAnswered === totalQuestions;

  return (
    <div className="w-full max-w-md">
      <Card className="shadow-lg py-6">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 rounded-full blur-xl animate-pulse" />
              <CheckCircle className="w-20 h-20 text-green-600 relative" />
            </div>
          </div>

          <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
          <CardDescription>
            {isFullComplete
              ? `You've completed all ${totalQuestions} questions.`
              : `You answered ${questionsAnswered} out of ${totalQuestions} questions.`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>
              {isFullComplete
                ? "Great effort! You've successfully reviewed all the questions and received feedback on each one."
                : "Quiz ended early. Review your results and try again when you're ready."}
            </AlertDescription>
          </Alert>

          {/* Restart Button */}
          <Button onClick={onRestart} className="w-full" size="lg">
            Start New Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
