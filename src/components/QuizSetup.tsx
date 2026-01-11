import { useState, useEffect } from "react";
import type { QuizQuestion, ValidationError } from "../types/quiz";
import { validateQuizJSON } from "../lib/validation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  Check,
  Copy,
  FileJson,
  Play,
  Sparkles,
  History,
  Trash2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getHistory,
  deleteHistoryItem,
  type HistoryItem,
} from "../lib/history";

interface QuizSetupProps {
  onQuizStart: (questions: QuizQuestion[]) => void;
}

export function QuizSetup({ onQuizStart }: QuizSetupProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<ValidationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null);

  useEffect(() => {
    if (isHistoryOpen) {
      setHistory(getHistory());
    }
  }, [isHistoryOpen]);

  const handleSelectHistory = (item: HistoryItem) => {
    setJsonInput(JSON.stringify(item.questions, null, 2));
    setError(null);
    setIsHistoryOpen(false);
  };

  const aiPrompt = `Generate quiz questions in the following JSON format:

[
  {
    "id": 1,
    "question": "Your question text here?",
    "options": [
      { "id": "a", "text": "First option", "isCorrect": false },
      { "id": "b", "text": "Second option", "isCorrect": true },
      { "id": "c", "text": "Third option", "isCorrect": false },
      { "id": "d", "text": "Fourth option", "isCorrect": false }
    ]
  }
]

Rules:
- Return a valid JSON array of question objects
- Each question must have a unique numeric "id"
- Each question must have a "question" string
- Each question must have an "options" array with 2-6 options
- Each option must have: "id" (letter like "a", "b", etc.), "text" (string), and "isCorrect" (boolean)
- Exactly ONE option per question must have "isCorrect": true
- Return ONLY the JSON, no markdown code blocks or explanations`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = validateQuizJSON(jsonInput);

      if (!result.isValid) {
        setError(result);
        setIsLoading(false);
      } else {
        onQuizStart(result.data);
      }
    }, 300);
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(aiPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    const sampleJSON = JSON.stringify(
      [
        {
          id: 1,
          question: "What is the capital of France?",
          options: [
            { id: "a", text: "London", isCorrect: false },
            { id: "b", text: "Paris", isCorrect: true },
            { id: "c", text: "Berlin", isCorrect: false },
            { id: "d", text: "Madrid", isCorrect: false },
          ],
        },
        {
          id: 2,
          question: "Which planet is known as the Red Planet?",
          options: [
            { id: "a", text: "Venus", isCorrect: false },
            { id: "b", text: "Mars", isCorrect: true },
            { id: "c", text: "Jupiter", isCorrect: false },
            { id: "d", text: "Saturn", isCorrect: false },
          ],
        },
        {
          id: 3,
          question: "What is 2 + 2?",
          options: [
            { id: "a", text: "3", isCorrect: false },
            { id: "b", text: "4", isCorrect: true },
            { id: "c", text: "5", isCorrect: false },
          ],
        },
      ],
      null,
      2
    );
    setJsonInput(sampleJSON);
    setError(null);
  };

  const handleDeleteHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(deleteHistoryItem(id));
  };

  const handleCopyHistory = async (e: React.MouseEvent, item: HistoryItem) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(
      JSON.stringify(item.questions, null, 2)
    );
    setCopiedHistoryId(item.id);
    setTimeout(() => setCopiedHistoryId(null), 2000);
  };

  return (
    <Card className="w-full max-w-2xl h-[calc(100vh-8rem)] max-h-[700px] shadow-lg flex flex-col">
      <CardHeader className="shrink-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileJson className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">MCQ Quiz Setup</CardTitle>
            <CardDescription>
              Paste your question JSON to start the quiz
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 pb-6">
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col min-h-0 gap-4"
        >
          <div className="flex-1 flex flex-col min-h-0 space-y-2">
            <div className="flex items-center justify-between shrink-0">
              <label htmlFor="json-input" className="text-sm font-medium">
                Question JSON
              </label>
              <Button
                type="button"
                onClick={handleCopyPrompt}
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy AI Prompt
                  </>
                )}
              </Button>
            </div>
            <div className="relative flex-1 min-h-0 w-full">
              <Textarea
                id="json-input"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder={`Paste your quiz JSON here...

Example format:
[
  {
    "id": 1,
    "question": "What is...?",
    "options": [
      { "id": "a", "text": "Option A", "isCorrect": false },
      { "id": "b", "text": "Option B", "isCorrect": true }
    ]
  }
]`}
                className="absolute inset-0 resize-none font-mono text-sm h-full w-full field-sizing-fixed"
                aria-label="JSON input for quiz questions"
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="shrink-0">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Error</AlertTitle>
              <AlertDescription>
                <p>{error.message}</p>
                {error.questionIndex !== undefined && (
                  <p className="text-xs mt-1 opacity-80">
                    Question {error.questionIndex + 1}
                    {error.fieldName && ` • Field: ${error.fieldName}`}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 shrink-0">
            <Button
              type="submit"
              disabled={isLoading || !jsonInput.trim()}
              className="flex-1"
              size="lg"
            >
              {isLoading ? (
                <>
                  <span className="animate-pulse">Validating...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Quiz
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={handleLoadSample}
              variant="outline"
              size="lg"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Load Sample
            </Button>

            <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="lg">
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Recent Quizzes</SheetTitle>
                  <SheetDescription>
                    Pick a quiz from your history to load it back into the
                    editor.
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] mt-4 px-3">
                  <div className="space-y-3 pr-4">
                    {history.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No history found. Start a quiz to save it here.
                      </p>
                    ) : (
                      history.map((item) => (
                        <div
                          key={item.id}
                          className="group relative border rounded-md p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div
                            className="cursor-pointer pr-1"
                            onClick={() => handleSelectHistory(item)}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {new Date(item.timestamp).toLocaleDateString()}{" "}
                                {new Date(item.timestamp).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {item.count} Qs
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {item.preview}
                            </p>
                          </div>

                          <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-md border shadow-sm">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              title="Copy JSON"
                              onClick={(e) => handleCopyHistory(e, item)}
                            >
                              {copiedHistoryId === item.id ? (
                                <Check className="h-3.5 w-3.5 text-green-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 hover:text-destructive hover:bg-destructive/10"
                              title="Delete"
                              onClick={(e) => handleDeleteHistory(e, item.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
