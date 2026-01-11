import { validateQuizJSON } from "../lib/validation";

console.log("LOG: Test 1 - Valid JSON");
const validJSON = JSON.stringify([
  {
    id: 1,
    question: "What is 2+2?",
    options: [
      { id: "a", text: "3", isCorrect: false },
      { id: "b", text: "4", isCorrect: true },
      { id: "c", text: "5", isCorrect: false },
    ],
  },
  {
    id: 2,
    question: "What is the capital of France?",
    options: [
      { id: "a", text: "London", isCorrect: false },
      { id: "b", text: "Paris", isCorrect: true },
      { id: "c", text: "Berlin", isCorrect: false },
    ],
  },
]);

let result = validateQuizJSON(validJSON);
if (result.isValid) {
  console.log("✓ Valid JSON accepted. Questions:", result.data.length);
  result.data.forEach((q) => {
    const correctAnswer = q.options.find((o) => o.isCorrect);
    console.log(
      `  Q${q.id}: "${q.question}" → Answer: "${correctAnswer?.text}"`
    );
  });
} else {
  console.error("✗ Valid JSON rejected:", result.message);
}

console.log("\nLOG: Test 2 - Malformed JSON");
const malformedJSON = "{ invalid json }";
result = validateQuizJSON(malformedJSON);
if (!result.isValid) {
  console.log("✓ Correctly rejected malformed JSON:", result.message);
} else {
  console.error("✗ Malformed JSON was accepted");
}

console.log("\nLOG: Test 3 - Not an array");
const notArrayJSON = JSON.stringify({ question: "test" });
result = validateQuizJSON(notArrayJSON);
if (!result.isValid) {
  console.log("✓ Correctly rejected non-array:", result.message);
} else {
  console.error("✗ Non-array JSON was accepted");
}

console.log("\nLOG: Test 4 - Missing isCorrect field");
const missingIsCorrectJSON = JSON.stringify([
  {
    id: 1,
    question: "What is 2+2?",
    options: [
      { id: "a", text: "3" },
      { id: "b", text: "4", isCorrect: true },
    ],
  },
]);
result = validateQuizJSON(missingIsCorrectJSON);
if (!result.isValid) {
  console.log("✓ Correctly rejected missing isCorrect:", result.message);
} else {
  console.error("✗ Missing isCorrect was accepted");
}

console.log("\nLOG: Test 5 - No correct answer in question");
const noCorrectJSON = JSON.stringify([
  {
    id: 1,
    question: "What is 2+2?",
    options: [
      { id: "a", text: "3", isCorrect: false },
      { id: "b", text: "5", isCorrect: false },
    ],
  },
]);
result = validateQuizJSON(noCorrectJSON);
if (!result.isValid) {
  console.log("✓ Correctly rejected no correct answer:", result.message);
} else {
  console.error("✗ No correct answer was accepted");
}

console.log("\nLOG: Test 6 - Empty options array");
const emptyOptionsJSON = JSON.stringify([
  {
    id: 1,
    question: "What is 2+2?",
    options: [],
  },
]);
result = validateQuizJSON(emptyOptionsJSON);
if (!result.isValid) {
  console.log("✓ Correctly rejected empty options:", result.message);
} else {
  console.error("✗ Empty options was accepted");
}

console.log("\nLOG: Test 7 - Empty questions array");
const emptyQuestionsJSON = JSON.stringify([]);
result = validateQuizJSON(emptyQuestionsJSON);
if (!result.isValid) {
  console.log("✓ Correctly rejected empty questions array:", result.message);
} else {
  console.error("✗ Empty questions array was accepted");
}

console.log("\nLOG: Test 8 - Valid JSON with special characters");
const specialCharsJSON = JSON.stringify([
  {
    id: 1,
    question: 'What is "x" in the equation: 2x + 5 = 11?',
    options: [
      { id: "a", text: "2 (incorrect)", isCorrect: false },
      { id: "b", text: "3 (correct)", isCorrect: true },
      { id: "c", text: "5 & more", isCorrect: false },
    ],
  },
]);
result = validateQuizJSON(specialCharsJSON);
if (result.isValid) {
  console.log("✓ Valid JSON with special characters accepted");
} else {
  console.error(
    "✗ Valid JSON with special characters rejected:",
    result.message
  );
}

console.log("\nLOG: All validation tests completed!");
