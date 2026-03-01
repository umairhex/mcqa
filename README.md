# MCQA – Modern Quiz Application

Modern, interactive multiple-choice quiz engine.  
JSON-driven, instant feedback, locked answers, progress/history persistence, full accessibility, dark mode.

Live demo → https://mcqa.vercel.app

## Features

- Dynamic quiz loading from raw JSON input  
- Strict single-attempt flow: instant feedback + answer locking  
- Automatic progress & result persistence (local storage)  
- Complete WCAG-compliant accessibility (keyboard navigation, screen-reader support, proper ARIA)  
- System + manual dark mode  
- Clean, responsive UI built with modern component primitives

## Tech Stack

- React 19  
- TypeScript 5  
- Vite 7  
- Tailwind CSS 4  
- shadcn/ui  
- Lucide React (icons)

## Installation

```bash
# Recommended: use pnpm
git clone https://github.com/umairhex/mcqa.git
cd mcqa
pnpm install
```

## Development

```bash
pnpm dev
```

Open http://localhost:5173

## Build for production

```bash
pnpm build
```

Output appears in `dist/`

## Quiz JSON Format

Place your quiz files in `public/quizzes/` or load remotely. Example structure:

```json
{
  "title": "Sample Quiz",
  "description": "Optional short description",
  "questions": [
    {
      "id": "q1",
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correctIndex": 1,
      "explanation": "Basic arithmetic"
    }
    // more questions...
  ]
}
```

## Accessibility

- Full keyboard navigation  
- ARIA labels and roles on all interactive elements  
- High-contrast focus states  
- Screen-reader tested flow

## License

MIT

Umair Niazi  
https://umairrx.dev | [@umairhex](https://twitter.com/umairhex)
